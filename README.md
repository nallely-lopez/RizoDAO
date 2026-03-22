# 🌀 RIZO — Web3 Beauty Platform for the Latin Curly Hair Community

> Beauty meets Web3. Shop, connect with professionals, and earn 
> on-chain loyalty tokens — powered by Stellar Network, invisibly.

---

## 🌟 What is RIZO?

RIZO is a full-stack Web3 beauty platform built for the 50M+ Latin 
women with curly, wavy, and afro hair across Mexico and Latin America.

The platform combines three core features:

- **Community** — Social feed where users share routines, tips, 
  and product reviews. Every action earns RIZO tokens.
- **Marketplace** — Curated store with real products from Mexican 
  and Latin American brands. Pay with USDC on Stellar Network.
- **Professionals** — Directory of certified beauty specialists. 
  Book appointments and pay with RIZO tokens.

---

## ✨ Key Features

- 🔐 **Invisible Blockchain** — Users register with email. 
  Stellar wallet created automatically in the background.
- ⚡ **Real Stellar Payments** — USDC transactions confirmed 
  in ~3 seconds with $0.00 fees.
- 🪙 **RIZO Tokens** — On-chain loyalty system built on Stellar. 
  Earn tokens by participating, shopping, and booking.
- 👩‍💼 **Professionals Directory** — Certified specialists in hair, 
  makeup, skincare, nails, and more.
- 🌐 **Social Community** — Share, discover, and connect with 
  the curly hair community.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL (Neon) |
| Blockchain | Stellar Network, Stellar SDK |
| Payments | USDC on Stellar Testnet |
| Auth | NextAuth v4, Accesly |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database (Neon recommended)
- Stellar Testnet account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tu-usuario/rizo-app.git
cd rizo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your `.env.local`:
```env
# Database
DATABASE_URL=your_neon_postgresql_url

# NextAuth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Stellar
NEXT_PUBLIC_RIZO_WALLET_ADDRESS=your_stellar_public_key
STELLAR_ENCRYPTION_KEY=your_32_char_encryption_key

# Accesly
NEXT_PUBLIC_ACCESLY_APP_ID=your_accesly_app_id
```

5. Run database migrations:
```bash
npx prisma migrate dev
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 How Stellar Integration Works
```
User registers with email
        ↓
RIZO creates Stellar wallet automatically (server-side)
        ↓
Wallet funded with Friendbot (Testnet)
        ↓
User shops and clicks "Confirm Purchase"
        ↓
RIZO signs transaction server-side with Stellar SDK
        ↓
Transaction sent to Stellar Testnet via Horizon API
        ↓
Confirmed in ~3 seconds, $0.00 fees
        ↓
RIZO tokens credited to user account
        ↓
User sees: "+85 RIZO tokens earned!" 🎉
```

**The user never sees wallets, private keys, or blockchain.**

---

## 🪙 RIZO Token System

| Action | Tokens Earned |
|--------|--------------|
| Sign up | +20 tokens |
| Post in community | +5 tokens |
| Leave a review | +10 tokens |
| Make a purchase | +60-110 tokens |
| Complete profile | +20 tokens |

### Token Benefits

| Tokens | Benefit |
|--------|---------|
| 500 | 10% discount on next purchase |
| 1,000 | Free shipping on all orders |
| 2,000 | Access to exclusive products |

> Tokens remain active with a minimum of 2 purchases per month.

---

## 💰 Business Model

- **Transaction fees** — 3-5% per purchase
- **Professional bookings** — 10-15% commission
- **Brand subscriptions** — $299-$1,999 MXN/month
- **Native advertising** — Sponsored content in community feed
- **RIZO token sales** — Users buy tokens for faster rewards

---

## 🗺️ Roadmap

### Phase 1 — Testnet (Current) ✅
- [x] User registration with invisible Stellar wallet
- [x] USDC payments on Stellar Testnet
- [x] RIZO token loyalty system
- [x] Community social feed
- [x] Marketplace with real Mexican brands
- [x] Professionals directory

### Phase 2 — Mainnet (Q2 2026)
- [ ] Migrate to Stellar Mainnet
- [ ] Real USDC payments
- [ ] RIZO token on Stellar Mainnet
- [ ] Mobile app (React Native)
- [ ] Expand to Colombia and Argentina

### Phase 3 — Scale (Q4 2026)
- [ ] Brand partnership program
- [ ] AI product recommendations
- [ ] Video consultations with professionals
- [ ] RIZO DAO governance

---

## 🌍 Market Opportunity

- **50M+** Latin women with curly/wavy/afro hair
- **$15B** Latin American beauty market
- **130M** population in Mexico alone
- **0** competitors with blockchain loyalty in this niche

---

## 👥 Team

| Name | Role |
|------|------|
| Nallely López García | Lead Developer / Co-founder |
| [Nombre] | Frontend Developer / Co-founder |
| [Nombre] | Business Development / Pitcher |

---

## 🔗 Links

- 🎥 **Demo Video**: [YouTube](https://youtu.be/gOCZK7X_2pg?si=pehD1Y7r5IrufIxL)
- 📊 **DoraHacks**: [BUIDL Page](https://dorahacks.io)
- 🌟 **Stellar Expert**: [View Transactions](https://stellar.expert/explorer/testnet/account/GD6KTSYJYBEJ4IFN42RPTYLHZGZLLA5YTYGOA4VREFSUBRUHX6M2AJ46)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ for the Latin curly hair community
  <br>
  Powered by Stellar Network 🌟
</div>
