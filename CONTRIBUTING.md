# Contributing to RIZO

Thanks for your interest in contributing! RIZO is a Web3 beauty platform for the Latin curly hair community, built on Next.js and the Stellar Network. This guide covers everything you need to get started.

---

## Table of Contents

1. [Local Setup](#1-local-setup)
2. [Branch Naming Conventions](#2-branch-naming-conventions)
3. [Submitting a Pull Request](#3-submitting-a-pull-request)
4. [Running Soroban Contract Tests](#4-running-soroban-contract-tests)
5. [Code Style Guidelines](#5-code-style-guidelines)
6. [Wave Bounty System](#6-wave-bounty-system)

---

## 1. Local Setup

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm | 9+ | Comes with Node.js |
| Rust | stable | Required only for Soroban contract work |
| Stellar CLI | latest | Required only for contract deployment |
| Docker | any | Optional — for local PostgreSQL |

### Step-by-step

**1. Fork and clone the repo**

```bash
git clone https://github.com/<your-username>/rizo-app.git
cd rizo-app
```

**2. Install dependencies**

```bash
npm install
```

`prisma generate` runs automatically via the `postinstall` hook.

**3. Set up environment variables**

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every variable. The comments in `.env.example` explain what each one is and where to get it. At minimum you need:

- `DATABASE_URL` — a Neon PostgreSQL URL or a local Docker connection string
- `NEXTAUTH_SECRET` — any 32+ character random string (run `openssl rand -base64 32`)
- `STELLAR_ISSUER_PUBLIC_KEY` / `STELLAR_ISSUER_SECRET_KEY` — a Stellar Testnet keypair
- `STELLAR_ENCRYPTION_KEY` — exactly 32 characters

**4. Start a local database (optional — skip if using Neon)**

```bash
docker compose up -d
```

Update `DATABASE_URL` in `.env.local` to point at the local instance:

```
DATABASE_URL="postgresql://rizo:your-password@localhost:5432/rizodb"
```

**5. Run database migrations**

```bash
npx prisma migrate dev
```

**6. Seed the database**

```bash
npm run seed
```

This inserts the initial product catalog and any required reference data.

**7. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses Turbopack for fast refresh.

### Stellar Testnet setup

If you're working on anything that touches payments or loyalty tokens, you also need a funded Testnet account:

1. Generate a keypair at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).
2. Fund it with [Friendbot](https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY).
3. Put the keypair in `STELLAR_ISSUER_PUBLIC_KEY` and `STELLAR_ISSUER_SECRET_KEY`.
4. Use the same public key for `NEXT_PUBLIC_RIZO_WALLET_ADDRESS` (or create a second account for the store wallet).

---

## 2. Branch Naming Conventions

All branches must follow this pattern:

```
<type>/<short-description>
```

| Type | When to use |
|------|------------|
| `feature/` | New user-facing functionality |
| `fix/` | Bug fixes (non-breaking) |
| `chore/` | Dependency updates, config changes, refactors with no behavior change |
| `docs/` | Documentation-only changes |
| `contract/` | Changes to the Soroban smart contract in `contracts/rizo-loyalty/` |

**Examples:**

```
feature/token-expiry-notification
fix/payment-error-handling
chore/upgrade-stellar-sdk-14
docs/add-contract-deployment-guide
contract/add-transfer-function
```

Use lowercase letters and hyphens only. Keep descriptions under 40 characters.

---

## 3. Submitting a Pull Request

**Before opening a PR, confirm:**

- [ ] `npm run build` succeeds locally (this runs migrations and the Next.js build)
- [ ] `npm run lint` reports no errors
- [ ] New Stellar/Soroban code includes unit tests (see section 4)
- [ ] You haven't committed `.env.local`, `.env`, or any file containing secrets
- [ ] Your branch is up to date with `main`

**PR process:**

1. Push your branch and open a PR against `main`.
2. Fill in the PR description: what changed, why, and how to test it.
3. Assign the PR to yourself and request review from at least one maintainer.
4. Address review comments with new commits (do not force-push after review starts).
5. A maintainer will merge once approved.

**Commit message format:**

```
<type>: <short description in imperative mood>
```

Examples:
```
feat: add token expiry notification banner
fix: handle missing trustline on USDC payment
chore: upgrade stellar-sdk to 14.6.1
```

---

## 4. Running Soroban Contract Tests

The RizoLoyalty smart contract lives in `contracts/rizo-loyalty/` and is written in Rust using the Soroban SDK.

### Requirements

Install Rust and the Stellar CLI if you haven't already:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add the WebAssembly target
rustup target add wasm32-unknown-unknown

# Install the Stellar CLI
cargo install --locked stellar-cli --features opt
```

### Running tests

```bash
cd contracts/rizo-loyalty
cargo test
```

This runs all 6 unit tests covering:

- Token balance tracking
- Discount tier calculation (0%, 10%, 15%)
- Purchase registration
- 30-day token expiry logic
- Edge cases (zero balance, first purchase)

### Building the contract

```bash
cargo build --target wasm32-unknown-unknown --release
```

The compiled `.wasm` file will be at `target/wasm32-unknown-unknown/release/rizo_loyalty.wasm`.

### Deploying to Testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/rizo_loyalty.wasm \
  --source <YOUR_STELLAR_SECRET_KEY> \
  --network testnet
```

Copy the returned contract ID and update `LOYALTY_CONTRACT_ID` and `NEXT_PUBLIC_LOYALTY_CONTRACT_ID` in your `.env.local`.

### Contract interface summary

| Function | Description |
|----------|-------------|
| `register_purchase(user, amount)` | Records a purchase and grants tokens (1 token per 10 units) |
| `get_balance(user)` | Returns the user's current token balance |
| `check_discount(user)` | Returns the applicable discount (0, 10, or 15) |
| `expire_tokens(user)` | Expires tokens if fewer than 2 purchases in the last 30 days |
| `get_purchase_count(user)` | Returns the number of purchases in the last 30 days |

---

## 5. Code Style Guidelines

### General

- TypeScript everywhere — no `any` types without an explicit comment explaining why.
- Prefer named exports over default exports for components and utilities.
- File names: `kebab-case.ts` for utilities, `PascalCase.tsx` for React components.
- Keep components small and focused. If a component exceeds ~150 lines, split it.

### Environment variables

- Server-only secrets go in plain `process.env.VAR_NAME`. Never prefix secrets with `NEXT_PUBLIC_`.
- Client-accessible values must use the `NEXT_PUBLIC_` prefix.
- Always read env vars at the module level or inside server-only functions, never inside client components.

### Stellar / blockchain code

- All Stellar transactions must be built and signed server-side (in API routes or server actions). Never sign transactions in the browser with the issuer key.
- Encrypt user secret keys with `encryptSecret()` from `lib/encryption.ts` before storing them. Never store plaintext keys.
- Use the testnet Horizon URL (`https://horizon-testnet.stellar.org`) in development. The `STELLAR_HORIZON_URL` env var must be the source of truth — don't hardcode URLs.

### Styling

- Tailwind CSS utility classes only. No custom CSS files unless absolutely necessary.
- Follow the existing color tokens and component patterns in `components/ui/`.
- Mobile-first responsive design.

### Comments

- Write comments to explain *why*, not *what*. Obvious code doesn't need a comment.
- Soroban contract code is an exception — document each public function's expected inputs, outputs, and auth requirements.

---

## 6. Wave Bounty System

RIZO uses **Wave** to reward open-source contributors with RIZO tokens.

### How it works

1. Issues tagged `wave-bounty` have an attached token reward listed in the issue description.
2. Comment on the issue to claim it before you start working.
3. A maintainer will assign the issue to you.
4. Submit your PR referencing the issue number (`Closes #123`).
5. Once the PR is merged and reviewed, the bounty tokens are sent to your Stellar address.

### Claiming your bounty

When your PR is merged, open a comment on the issue with:

```
Wave claim: <your Stellar public key>
```

A maintainer will trigger the on-chain transfer via the RizoLoyalty contract.

### Bounty tiers

| Label | Token Reward | Typical Scope |
|-------|-------------|---------------|
| `wave-xs` | 50 RIZO | Typo fix, minor UI tweak |
| `wave-sm` | 150 RIZO | Small bug fix, translation |
| `wave-md` | 400 RIZO | Feature addition, significant bug fix |
| `wave-lg` | 1000 RIZO | Major feature, contract upgrade |

Token discounts apply at 500 and 1000 RIZO (10% and 15% off purchases). Tokens remain active as long as you make at least 2 contributions per month.

### Rules

- One contributor per issue at a time.
- Bounty tokens are only issued for PRs merged into `main`.
- Maintainers may adjust the reward up or down based on final scope.
- If you abandon an issue after 7 days without activity, the maintainer may reassign it.

---

## Questions?

Open a [GitHub Discussion](https://github.com/tu-usuario/rizo-app/discussions) or reach out in the community. We're happy to help you get started.
