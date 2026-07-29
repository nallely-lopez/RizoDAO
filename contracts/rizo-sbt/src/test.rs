//! Unit tests for the RizoSbt Soulbound Token contract.
//!
//! Run with: `cargo test --features testutils`

#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/// Deploy the contract and return an (Env, client, issuer_address) tuple.
fn setup() -> (Env, RizoSbtClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, RizoSbt);
    let client = RizoSbtClient::new(&env, &contract_id);
    // SAFETY: lifetime is tied to `env` which lives for the entire test body.
    let client = unsafe {
        core::mem::transmute::<RizoSbtClient<'_>, RizoSbtClient<'static>>(client)
    };
    let issuer = Address::generate(&env);
    (env, client, issuer)
}

// ─── Test 1: Mint increases credential count ──────────────────────────────────

#[test]
fn test_mint_stores_credential() {
    let (env, client, issuer) = setup();
    let stylist = Address::generate(&env);

    let token_id = client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::CurlSpecialist,
        &String::from_str(&env, "Curl Specialist"),
    );

    assert_eq!(token_id, 1);

    let creds = client.get_credentials(&stylist);
    assert_eq!(creds.len(), 1);

    let token = creds.get(0).unwrap();
    assert_eq!(token.id, 1);
    assert_eq!(token.owner, stylist);
    assert_eq!(token.metadata.issuer, issuer);
}

// ─── Test 2: Multiple mints accumulate tokens on the same stylist ─────────────

#[test]
fn test_multiple_mints_accumulate() {
    let (env, client, issuer) = setup();
    let stylist = Address::generate(&env);

    client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::CurlSpecialist,
        &String::from_str(&env, "Curl Specialist"),
    );
    client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::ColorSpecialist,
        &String::from_str(&env, "Color Specialist"),
    );
    client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::LocStylist,
        &String::from_str(&env, "Loc Stylist"),
    );

    let creds = client.get_credentials(&stylist);
    assert_eq!(creds.len(), 3);
    // IDs should be sequential
    assert_eq!(creds.get(0).unwrap().id, 1);
    assert_eq!(creds.get(1).unwrap().id, 2);
    assert_eq!(creds.get(2).unwrap().id, 3);
    assert_eq!(client.total_minted(), 3);
}

// ─── Test 3: Credentials belong to distinct stylists independently ────────────

#[test]
fn test_credentials_are_per_stylist() {
    let (env, client, issuer) = setup();
    let stylist_a = Address::generate(&env);
    let stylist_b = Address::generate(&env);

    client.mint_sbt(
        &issuer,
        &stylist_a,
        &CredentialType::NaturalHair,
        &String::from_str(&env, "Natural Hair Specialist"),
    );

    // stylist_b has no credentials
    let creds_b = client.get_credentials(&stylist_b);
    assert_eq!(creds_b.len(), 0);

    // stylist_a has exactly one
    let creds_a = client.get_credentials(&stylist_a);
    assert_eq!(creds_a.len(), 1);
}

// ─── Test 4: verify_credential returns true for a valid credential ────────────

#[test]
fn test_verify_credential_valid() {
    let (env, client, issuer) = setup();
    let stylist = Address::generate(&env);

    let token_id = client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::LocStylist,
        &String::from_str(&env, "Loc Stylist"),
    );

    let valid = client.verify_credential(&stylist, &token_id);
    assert!(valid);
}

// ─── Test 5: verify_credential panics for a non-existent credential ───────────

#[test]
#[should_panic]
fn test_verify_credential_not_found() {
    let (env, client, issuer) = setup();
    let stylist = Address::generate(&env);

    // Mint one credential to ensure the stylist exists in storage
    client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::CurlSpecialist,
        &String::from_str(&env, "Curl Specialist"),
    );

    // Token ID 999 was never minted — must panic
    client.verify_credential(&stylist, &999_u32);
}

// ─── Test 6: Transfer is always rejected ─────────────────────────────────────

#[test]
#[should_panic]
fn test_transfer_is_rejected() {
    let (env, client, issuer) = setup();
    let stylist = Address::generate(&env);
    let other = Address::generate(&env);

    let token_id = client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::ColorSpecialist,
        &String::from_str(&env, "Color Specialist"),
    );

    // Any transfer attempt must be explicitly rejected by the contract.
    client.transfer(&stylist, &other, &token_id);
}

// ─── Test 7: SBT metadata is stored and retrievable correctly ────────────────

#[test]
fn test_metadata_fields_are_correct() {
    let (env, client, issuer) = setup();
    let stylist = Address::generate(&env);
    let name = String::from_str(&env, "Natural Hair Specialist");

    let token_id = client.mint_sbt(
        &issuer,
        &stylist,
        &CredentialType::NaturalHair,
        &name,
    );

    let creds = client.get_credentials(&stylist);
    let token = creds.get(0).unwrap();

    assert_eq!(token.id, token_id);
    assert_eq!(token.owner, stylist);
    assert_eq!(token.metadata.issuer, issuer);
    assert_eq!(token.metadata.credential_name, name);
    // issued_at is a u64 ledger timestamp — just verify it is accessible
    let _ = token.metadata.issued_at;
}

// ─── Test 8: total_minted returns 0 before any mints ─────────────────────────

#[test]
fn test_total_minted_starts_at_zero() {
    let (_env, client, _issuer) = setup();
    assert_eq!(client.total_minted(), 0);
}
