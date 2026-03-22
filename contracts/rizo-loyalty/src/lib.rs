#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Vec,
};

/// 1 token por cada 10 unidades de monto (ej. 10 pesos → 1 token RIZO)
const TOKENS_PER_UNIT: i128 = 10;

/// 30 días en segundos
const SECONDS_30_DAYS: u64 = 2_592_000;

// ─── Storage keys ─────────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    /// Balance de tokens RIZO del usuario
    Balance(Address),
    /// Vec<u64> con timestamps (Unix) de compras recientes
    Purchases(Address),
}

// ─── Contrato ─────────────────────────────────────────────────────────────────

#[contract]
pub struct RizoLoyalty;

#[contractimpl]
impl RizoLoyalty {
    /// Agrega tokens RIZO al usuario.
    /// Requiere que el usuario autorice la operación.
    /// Emite evento: tok_add
    pub fn add_tokens(env: Env, user: Address, amount: i128) {
        user.require_auth();

        let key = DataKey::Balance(user.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        env.storage().persistent().set(&key, &(balance + amount));

        env.events().publish((symbol_short!("tok_add"), user), amount);
    }

    /// Retorna el balance de tokens RIZO del usuario.
    pub fn get_balance(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(user))
            .unwrap_or(0)
    }

    /// Registra una compra, actualiza historial y otorga tokens.
    /// Tokens ganados = amount / TOKENS_PER_UNIT (1 token cada 10 MXN).
    /// Emite evento: purchase
    pub fn register_purchase(env: Env, user: Address, amount: i128) {
        user.require_auth();

        let now = env.ledger().timestamp();

        // ── Actualizar historial de compras ──────────────────────────────────
        let purchases_key = DataKey::Purchases(user.clone());
        let mut purchases: Vec<u64> = env
            .storage()
            .persistent()
            .get(&purchases_key)
            .unwrap_or_else(|| Vec::new(&env));

        // Agregar la compra actual
        purchases.push_back(now);

        // Conservar solo las de los últimos 30 días
        let cutoff = now.saturating_sub(SECONDS_30_DAYS);
        let mut recent: Vec<u64> = Vec::new(&env);
        for ts in purchases.iter() {
            if ts >= cutoff {
                recent.push_back(ts);
            }
        }
        env.storage().persistent().set(&purchases_key, &recent);

        // ── Calcular y acreditar tokens ──────────────────────────────────────
        let tokens_earned = amount / TOKENS_PER_UNIT;
        if tokens_earned > 0 {
            let balance_key = DataKey::Balance(user.clone());
            let balance: i128 = env.storage().persistent().get(&balance_key).unwrap_or(0);
            env.storage()
                .persistent()
                .set(&balance_key, &(balance + tokens_earned));
        }

        env.events().publish(
            (symbol_short!("purchase"), user),
            (amount, tokens_earned),
        );
    }

    /// Retorna el % de descuento aplicable al usuario:
    ///   >= 1000 tokens → 15%
    ///   >= 500 tokens  → 10%
    ///   < 500 tokens   → 0%
    pub fn check_discount(env: Env, user: Address) -> u32 {
        let balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(user))
            .unwrap_or(0);

        if balance >= 1000 {
            15
        } else if balance >= 500 {
            10
        } else {
            0
        }
    }

    /// Expira todos los tokens si el usuario tiene < 2 compras en los últimos 30 días.
    /// Emite evento: tok_exp
    pub fn expire_tokens(env: Env, user: Address) {
        let count = Self::get_purchase_count(env.clone(), user.clone());
        if count < 2 {
            env.storage()
                .persistent()
                .set(&DataKey::Balance(user.clone()), &0_i128);
            env.events().publish((symbol_short!("tok_exp"), user), ());
        }
    }

    /// Retorna cuántas compras hizo el usuario en los últimos 30 días.
    pub fn get_purchase_count(env: Env, user: Address) -> u32 {
        let now = env.ledger().timestamp();
        let cutoff = now.saturating_sub(SECONDS_30_DAYS);

        let purchases: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::Purchases(user))
            .unwrap_or_else(|| Vec::new(&env));

        let mut count: u32 = 0;
        for ts in purchases.iter() {
            if ts >= cutoff {
                count += 1;
            }
        }
        count
    }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    fn setup() -> (Env, RizoLoyaltyClient<'static>) {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, RizoLoyalty);
        let client = RizoLoyaltyClient::new(&env, &id);
        // SAFETY: lifetime is tied to env which lives for the test
        let client = unsafe {
            core::mem::transmute::<RizoLoyaltyClient<'_>, RizoLoyaltyClient<'static>>(client)
        };
        (env, client)
    }

    #[test]
    fn test_add_and_get_balance() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, RizoLoyalty);
        let client = RizoLoyaltyClient::new(&env, &id);
        let user = Address::generate(&env);

        assert_eq!(client.get_balance(&user), 0);
        client.add_tokens(&user, &500);
        assert_eq!(client.get_balance(&user), 500);
        client.add_tokens(&user, &300);
        assert_eq!(client.get_balance(&user), 800);
    }

    #[test]
    fn test_check_discount() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, RizoLoyalty);
        let client = RizoLoyaltyClient::new(&env, &id);
        let user = Address::generate(&env);

        // Sin tokens → sin descuento
        assert_eq!(client.check_discount(&user), 0);

        // 500 tokens → 10%
        client.add_tokens(&user, &500);
        assert_eq!(client.check_discount(&user), 10);

        // 1000 tokens → 15%
        client.add_tokens(&user, &500);
        assert_eq!(client.check_discount(&user), 15);
    }

    #[test]
    fn test_register_purchase_grants_tokens() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, RizoLoyalty);
        let client = RizoLoyaltyClient::new(&env, &id);
        let user = Address::generate(&env);

        // 990 MXN → 99 tokens (990 / 10)
        client.register_purchase(&user, &990);
        assert_eq!(client.get_balance(&user), 99);
        assert_eq!(client.get_purchase_count(&user), 1);
    }

    #[test]
    fn test_expire_tokens_with_less_than_2_purchases() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, RizoLoyalty);
        let client = RizoLoyaltyClient::new(&env, &id);
        let user = Address::generate(&env);

        client.add_tokens(&user, &500);
        client.register_purchase(&user, &50); // solo 1 compra

        client.expire_tokens(&user);
        assert_eq!(client.get_balance(&user), 0); // tokens expirados
    }

    #[test]
    fn test_no_expire_with_2_purchases() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, RizoLoyalty);
        let client = RizoLoyaltyClient::new(&env, &id);
        let user = Address::generate(&env);

        client.add_tokens(&user, &500);
        client.register_purchase(&user, &100); // compra 1
        client.register_purchase(&user, &100); // compra 2

        client.expire_tokens(&user);
        // 500 + (100/10) + (100/10) = 520 — no expirado
        assert_eq!(client.get_balance(&user), 520);
    }
}
