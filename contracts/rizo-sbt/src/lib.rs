#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short,
    Address, Env, String, Vec,
};

// ─── Credential types ─────────────────────────────────────────────────────────

/// Valid stylist credential types.
#[contracttype]
#[derive(Clone, PartialEq)]
pub enum CredentialType {
    CurlSpecialist,
    NaturalHair,
    LocStylist,
    ColorSpecialist,
}

// ─── Data structures ──────────────────────────────────────────────────────────

/// Metadata stored for each Soulbound Token.
#[contracttype]
#[derive(Clone)]
pub struct SbtMetadata {
    /// Human-readable credential name (e.g. "Curl Specialist").
    pub credential_name: String,
    /// Unix timestamp of when the credential was issued.
    pub issued_at: u64,
    /// Address of the issuer (the party that called mint_sbt).
    pub issuer: Address,
    /// Type of the credential.
    pub credential_type: CredentialType,
}

/// A single minted Soulbound Token.
#[contracttype]
#[derive(Clone)]
pub struct SoulboundToken {
    /// Unique token ID within the contract (sequential, 1-based).
    pub id: u32,
    /// The stylist that owns this token.
    pub owner: Address,
    /// Rich metadata about the credential.
    pub metadata: SbtMetadata,
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    /// Vec<SoulboundToken> — all tokens held by a stylist.
    Credentials(Address),
    /// u32 — global token ID counter.
    NextId,
}

// ─── Errors ───────────────────────────────────────────────────────────────────

/// All contract error codes surfaced via `panic_with_error!`.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum SbtError {
    /// The caller attempted to transfer an SBT — always forbidden.
    TransferNotAllowed = 1,
    /// The requested credential_id does not exist for the given address.
    CredentialNotFound = 2,
}

// ─── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct RizoSbt;

#[contractimpl]
impl RizoSbt {
    // ── Write operations ──────────────────────────────────────────────────────

    /// Mints a new Soulbound Token and binds it permanently to `stylist`.
    ///
    /// # Arguments
    /// * `issuer`          – address authorising the credential (must sign).
    /// * `stylist`         – address receiving the credential.
    /// * `credential_type` – one of: `CurlSpecialist`, `NaturalHair`,
    ///                        `LocStylist`, `ColorSpecialist`.
    /// * `credential_name` – human-readable label stored in the metadata.
    ///
    /// Returns the new token ID. Emits event: `sbt_mint`.
    pub fn mint_sbt(
        env: Env,
        issuer: Address,
        stylist: Address,
        credential_type: CredentialType,
        credential_name: String,
    ) -> u32 {
        // Only the issuer may authorise minting.
        issuer.require_auth();

        let token_id = Self::next_id(&env);

        let metadata = SbtMetadata {
            credential_name,
            issued_at: env.ledger().timestamp(),
            issuer: issuer.clone(),
            credential_type,
        };

        let token = SoulboundToken {
            id: token_id,
            owner: stylist.clone(),
            metadata,
        };

        // Append to the stylist's credential list.
        let key = DataKey::Credentials(stylist.clone());
        let mut creds: Vec<SoulboundToken> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Vec::new(&env));
        creds.push_back(token);
        env.storage().persistent().set(&key, &creds);

        env.events()
            .publish((symbol_short!("sbt_mint"), stylist), token_id);

        token_id
    }

    /// Explicitly rejects any transfer attempt.
    ///
    /// Soulbound Tokens are **non-transferable** by design. Calling this
    /// function always panics with `SbtError::TransferNotAllowed` (error 1).
    pub fn transfer(env: Env, _from: Address, _to: Address, _token_id: u32) {
        panic_with_error!(env, SbtError::TransferNotAllowed);
    }

    // ── Read operations ───────────────────────────────────────────────────────

    /// Returns all Soulbound Tokens held by `stylist`.
    pub fn get_credentials(env: Env, stylist: Address) -> Vec<SoulboundToken> {
        env.storage()
            .persistent()
            .get(&DataKey::Credentials(stylist))
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Verifies that `stylist` holds a credential with `credential_id`.
    ///
    /// Returns `true` if found. Panics with `SbtError::CredentialNotFound`
    /// if the id does not exist in the stylist's credential list.
    pub fn verify_credential(env: Env, stylist: Address, credential_id: u32) -> bool {
        let creds: Vec<SoulboundToken> = env
            .storage()
            .persistent()
            .get(&DataKey::Credentials(stylist))
            .unwrap_or_else(|| Vec::new(&env));

        for token in creds.iter() {
            if token.id == credential_id {
                return true;
            }
        }

        // No matching credential found — abort with a descriptive error.
        panic_with_error!(env, SbtError::CredentialNotFound);
    }

    /// Returns the total number of SBTs minted across all stylists.
    pub fn total_minted(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::NextId)
            .unwrap_or(0)
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    /// Atomically increments and returns the next token ID.
    fn next_id(env: &Env) -> u32 {
        let key = DataKey::NextId;
        let id: u32 = env.storage().persistent().get(&key).unwrap_or(0) + 1;
        env.storage().persistent().set(&key, &id);
        id
    }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod test;
