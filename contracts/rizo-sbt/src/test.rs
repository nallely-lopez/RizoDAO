use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger as _}, Env, String};

// ─── Test helpers ─────────────────────────────────────────────────────────────

fn setup() -> (Env, Address, RizoSbtClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, RizoSbt);
    let client = RizoSbtClient::new(&env, &contract_id);

    // SAFETY: env outlives the test function — lifetime is artificially widened
    // only so the tuple can be returned together. This pattern mirrors
    // rizo-loyalty's own test setup.
    let client = unsafe {
        core::mem::transmute::<RizoSbtClient<'_>, RizoSbtClient<'static>>(client)
    };

    let admin = Address::generate(&env);
    client.initialize(&admin);

    (env, admin, client)
}

// ─── Test 1: mint creates a credential bound to the stylist ──────────────────

#[test]
fn test_mint_creates_credential() {
    let (env, _admin, client) = setup();
    let stylist = Address::generate(&env);

    let credential_type = String::from_str(&env, "curl_specialist");
    let id = client.mint_sbt(&stylist, &credential_type);

    // ID must be a positive integer
    assert!(id > 0);

    // Credential must appear in get_credentials
    let creds = client.get_credentials(&stylist);
    assert_eq!(creds.len(), 1);

    let cred = creds.get(0).unwrap();
    assert_eq!(cred.id, id);
    assert_eq!(cred.owner, stylist);
    assert_eq!(cred.credential_type, CredentialType::CurlSpecialist);
}

// ─── Test 2: all four credential types are accepted ──────────────────────────

#[test]
fn test_all_credential_types_accepted() {
    let (env, _admin, client) = setup();
    let stylist = Address::generate(&env);

    let types = [
        "curl_specialist",
        "natural_hair",
        "loc_stylist",
        "color_specialist",
    ];

    for ct in &types {
        let s = String::from_str(&env, ct);
        client.mint_sbt(&stylist, &s);
    }

    let creds = client.get_credentials(&stylist);
    assert_eq!(creds.len(), 4);
}

// ─── Test 3: verify_credential returns true for a valid credential ────────────

#[test]
fn test_verify_credential_valid() {
    let (env, _admin, client) = setup();
    let stylist = Address::generate(&env);

    let id = client.mint_sbt(&stylist, &String::from_str(&env, "natural_hair"));
    let result = client.verify_credential(&stylist, &id);
    assert!(result);
}

// ─── Test 4: verify_credential panics for wrong owner ────────────────────────

#[test]
#[should_panic]
fn test_verify_credential_wrong_owner_panics() {
    let (env, _admin, client) = setup();
    let stylist = Address::generate(&env);
    let attacker = Address::generate(&env);

    let id = client.mint_sbt(&stylist, &String::from_str(&env, "loc_stylist"));

    // Attempting to verify with the wrong owner must panic
    client.verify_credential(&attacker, &id);
}

// ─── Test 5: transfer always panics with TransferNotAllowed ──────────────────

#[test]
#[should_panic]
fn test_transfer_is_rejected() {
    let (env, _admin, client) = setup();
    let owner = Address::generate(&env);
    let recipient = Address::generate(&env);

    let id = client.mint_sbt(&owner, &String::from_str(&env, "color_specialist"));

    // Any transfer attempt must be explicitly rejected
    client.transfer(&owner, &recipient, &id);
}

// ─── Test 6: invalid credential type panics ──────────────────────────────────

#[test]
#[should_panic]
fn test_invalid_credential_type_panics() {
    let (env, _admin, client) = setup();
    let stylist = Address::generate(&env);

    // "braider" is not a valid credential type
    client.mint_sbt(&stylist, &String::from_str(&env, "braider"));
}

// ─── Test 7: metadata fields are stored correctly ────────────────────────────

#[test]
fn test_metadata_fields_populated() {
    let (env, admin, client) = setup();
    let stylist = Address::generate(&env);

    // Advance the ledger timestamp so issued_at is non-zero
    env.ledger().with_mut(|li| {
        li.timestamp = 1_700_000_000; // arbitrary Unix timestamp
    });

    let id = client.mint_sbt(&stylist, &String::from_str(&env, "color_specialist"));

    let creds = client.get_credentials(&stylist);
    let cred = creds.get(0).unwrap();

    // name must be the human-readable certificate title
    assert_eq!(
        cred.name,
        String::from_str(&env, "Color Specialist Certificate")
    );
    // issuer must be the admin who minted
    assert_eq!(cred.issuer, admin);
    // issued_at must reflect the ledger time we set
    assert_eq!(cred.issued_at, 1_700_000_000);
    // id must match the returned mint id
    assert_eq!(cred.id, id);
}

// ─── Test 8: multiple stylists have independent credential lists ──────────────

#[test]
fn test_independent_credential_lists() {
    let (env, _admin, client) = setup();
    let stylist_a = Address::generate(&env);
    let stylist_b = Address::generate(&env);

    client.mint_sbt(&stylist_a, &String::from_str(&env, "curl_specialist"));
    client.mint_sbt(&stylist_a, &String::from_str(&env, "natural_hair"));
    client.mint_sbt(&stylist_b, &String::from_str(&env, "loc_stylist"));

    assert_eq!(client.get_credentials(&stylist_a).len(), 2);
    assert_eq!(client.get_credentials(&stylist_b).len(), 1);
}

// ─── Test 9: re-initialisation is rejected ───────────────────────────────────

#[test]
#[should_panic]
fn test_double_initialize_panics() {
    let (env, _admin, client) = setup();
    let new_admin = Address::generate(&env);
    // Second initialize call must panic
    client.initialize(&new_admin);
}

// ─── Test 10: get_credentials returns empty list for unknown address ──────────

#[test]
fn test_get_credentials_empty_for_unknown_address() {
    let (env, _admin, client) = setup();
    let unknown = Address::generate(&env);

    let creds = client.get_credentials(&unknown);
    assert_eq!(creds.len(), 0);
}
