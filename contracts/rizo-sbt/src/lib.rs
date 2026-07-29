#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short,
    Address, Env, String, Vec,
};

// ─── Error codes ──────────────────────────────────────────────────────────────

/// Contract-level errors.  The `#[contracterror]` macro implements the
/// `Into<soroban_sdk::Error>` conversion required by `panic_with_error!`.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum SbtError {
    /// Transfers are forbidden — SBTs are non-transferable by design
    TransferNotAllowed = 1,
    /// The provided credential type string is not one of the four valid values
    InvalidCredentialType = 2,
    /// A credential with this ID does not exist for the given address
    CredentialNotFound = 3,
    /// The caller is not authorised to perform the requested action
    Unauthorized = 4,
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    /// List of credential IDs owned by an address
    Credentials(Address),
    /// Full metadata for a credential ID
    CredentialData(u64),
    /// Monotonic counter for credential IDs
    NextId,
    /// Address of the contract admin (who can mint SBTs)
    Admin,
}

// ─── Domain types ─────────────────────────────────────────────────────────────

/// The four recognised stylist credential types.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CredentialType {
    CurlSpecialist,
    NaturalHair,
    LocStylist,
    ColorSpecialist,
}

/// Metadata stored on-chain for every minted SBT.
#[contracttype]
#[derive(Clone, Debug)]
pub struct SbtCredential {
    /// Unique ID for this credential (auto-incremented)
    pub id: u64,
    /// Wallet address the token is permanently bound to
    pub owner: Address,
    /// Category of the credential
    pub credential_type: CredentialType,
    /// Human-readable name (e.g. "Curl Specialist Certificate")
    pub name: String,
    /// Unix timestamp of issuance (ledger time at mint)
    pub issued_at: u64,
    /// Stellar address of the issuer (admin at time of mint)
    pub issuer: Address,
}

// ─── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct RizoSbt;

#[contractimpl]
impl RizoSbt {
    // ── Initialisation ────────────────────────────────────────────────────────

    /// Initialise the contract with an admin address.
    /// Must be called exactly once after deployment.
    pub fn initialize(env: Env, admin: Address) {
        // Prevent re-initialisation
        if env.storage().persistent().has(&DataKey::Admin) {
            panic_with_error!(&env, SbtError::Unauthorized);
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::NextId, &1_u64);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    fn get_admin(env: &Env) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(env, SbtError::Unauthorized))
    }

    fn next_id(env: &Env) -> u64 {
        let id: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::NextId)
            .unwrap_or(1);
        env.storage().persistent().set(&DataKey::NextId, &(id + 1));
        id
    }

    /// Parse a `soroban_sdk::String` into a `CredentialType`.
    ///
    /// We copy the bytes into a fixed-size stack buffer and compare — there is
    /// no heap allocation or `std::string::String` available in `no_std`.
    fn parse_credential_type(env: &Env, raw: &String) -> CredentialType {
        let len = raw.len() as usize;

        // Longest valid key is "color_specialist" = 16 bytes.
        // Anything longer is immediately invalid.
        if len > 16 {
            panic_with_error!(env, SbtError::InvalidCredentialType);
        }

        let mut buf = [0u8; 16];
        raw.copy_into_slice(&mut buf[..len]);
        let slice = &buf[..len];

        match slice {
            b"curl_specialist" => CredentialType::CurlSpecialist,
            b"natural_hair" => CredentialType::NaturalHair,
            b"loc_stylist" => CredentialType::LocStylist,
            b"color_specialist" => CredentialType::ColorSpecialist,
            _ => panic_with_error!(env, SbtError::InvalidCredentialType),
        }
    }

    fn credential_name(env: &Env, ct: &CredentialType) -> String {
        match ct {
            CredentialType::CurlSpecialist => {
                String::from_str(env, "Curl Specialist Certificate")
            }
            CredentialType::NaturalHair => {
                String::from_str(env, "Natural Hair Expert Certificate")
            }
            CredentialType::LocStylist => {
                String::from_str(env, "Loc Stylist Certificate")
            }
            CredentialType::ColorSpecialist => {
                String::from_str(env, "Color Specialist Certificate")
            }
        }
    }

    // ── Core public functions ─────────────────────────────────────────────────

    /// Mint a Soulbound Token and bind it permanently to `stylist`.
    ///
    /// Only the contract admin may call this function.
    ///
    /// `credential_type_str` must be one of:
    ///   "curl_specialist" | "natural_hair" | "loc_stylist" | "color_specialist"
    ///
    /// Returns the newly assigned credential ID.
    ///
    /// Emits event: `sbt_mint`
    pub fn mint_sbt(env: Env, stylist: Address, credential_type_str: String) -> u64 {
        // Only the admin may mint
        let admin = Self::get_admin(&env);
        admin.require_auth();

        let credential_type = Self::parse_credential_type(&env, &credential_type_str);
        let name = Self::credential_name(&env, &credential_type);
        let id = Self::next_id(&env);
        let issued_at = env.ledger().timestamp();

        let credential = SbtCredential {
            id,
            owner: stylist.clone(),
            credential_type,
            name,
            issued_at,
            issuer: admin.clone(),
        };

        // Persist the credential data
        env.storage()
            .persistent()
            .set(&DataKey::CredentialData(id), &credential);

        // Append to the stylist's list of credential IDs
        let list_key = DataKey::Credentials(stylist.clone());
        let mut ids: Vec<u64> = env
            .storage()
            .persistent()
            .get(&list_key)
            .unwrap_or_else(|| Vec::new(&env));
        ids.push_back(id);
        env.storage().persistent().set(&list_key, &ids);

        env.events()
            .publish((symbol_short!("sbt_mint"), stylist), (id, admin));

        id
    }

    /// Return all SBT credentials held by `stylist`.
    pub fn get_credentials(env: Env, stylist: Address) -> Vec<SbtCredential> {
        let ids: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::Credentials(stylist))
            .unwrap_or_else(|| Vec::new(&env));

        let mut result: Vec<SbtCredential> = Vec::new(&env);
        for id in ids.iter() {
            if let Some(cred) = env
                .storage()
                .persistent()
                .get::<DataKey, SbtCredential>(&DataKey::CredentialData(id))
            {
                result.push_back(cred);
            }
        }
        result
    }

    /// Verify that a credential with `credential_id` exists and belongs to
    /// `stylist`. Returns `true` if valid, panics with `CredentialNotFound`
    /// if it does not exist or the owner does not match.
    pub fn verify_credential(env: Env, stylist: Address, credential_id: u64) -> bool {
        let cred: SbtCredential = env
            .storage()
            .persistent()
            .get(&DataKey::CredentialData(credential_id))
            .unwrap_or_else(|| panic_with_error!(&env, SbtError::CredentialNotFound));

        if cred.owner != stylist {
            panic_with_error!(&env, SbtError::CredentialNotFound);
        }

        true
    }

    /// Explicitly reject any attempt to transfer an SBT.
    ///
    /// SBTs are non-transferable by design. This function always panics with
    /// `TransferNotAllowed` to make the restriction visible and auditable.
    pub fn transfer(env: Env, _from: Address, _to: Address, _credential_id: u64) {
        panic_with_error!(env, SbtError::TransferNotAllowed);
    }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test;
