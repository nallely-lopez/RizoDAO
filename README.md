# 🌀 RIZO — Web3 Beauty Platform for the Latin Curly Hair Community
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Stellar](https://img.shields.io/badge/Stellar-Network-7B7BF7?style=flat-square&logo=stellar)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

> Beauty meets Web3. Shop, connect with professionals, and earn 
> on-chain loyalty tokens — powered by Stellar Network, invisibly.

---

## 🌟 What is RIZO?
 
RIZO is a full-stack Web3 platform built exclusively for the **50M+ Latin women with curly, wavy, and afro-textured hair** across Mexico and Latin America.
 
The platform brings together three core pillars:
 
- **Community** — A social feed where users share curl routines, before/after transformations, and product reviews. Every action earns $RIZO tokens.
- **Marketplace** — A curated store with products from Mexican and Latin American brands, specifically selected for curly hair. Pay with USDC on Stellar Network.
- **Professionals** — A directory of certified curl specialists and stylists. Book appointments and pay with $RIZO tokens.
---
 
## ✨ Key Features
 
- 🔐 **Invisible Blockchain** — Users register with email only. A Stellar wallet is created automatically in the background — no crypto knowledge required.
- ⚡ **Real Stellar Payments** — USDC transactions confirmed in ~3 seconds with $0.00001 fees.
- 🪙 **$RIZO Token System** — On-chain loyalty built on Stellar. Earn tokens by participating, shopping, and booking appointments.
- 💇 **Curl Type Matching** — Products and routines filtered by curl pattern (2A–4C), porosity, thickness, and length.
- 👩‍💼 **Curl Specialists Directory** — Certified stylists with on-chain credentials (Soulbound Tokens) proving their expertise.
- 🌐 **Curly Hair Community** — Share transformations, discover routines, and connect with the Latin curly hair community.
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, React 19, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL (Neon) |
| Blockchain | Stellar Network + Soroban Smart Contracts (Rust) |
| Payments | USDC on Stellar Testnet |
| Auth | NextAuth v4, Accesly |
| Deployment | Vercel |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 18+
- npm or pnpm
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- Stellar Testnet account
### Installation
 
1. Clone the repository:
```bash
git clone https://github.com/nallely-lopez/RizoDAO.git
cd RizoDAO
```
 
2. Install dependencies:
```bash
npm install
```
 
3. Set up environment variables:
```bash
cp .env.example .env.local
```
 
4. Fill in your `.env.local` — see `.env.example` for all required variables and descriptions.
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
### Running Soroban Contract Tests
 
```bash
cd contracts/rizo-loyalty
cargo test
```
 
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
Confirmed in ~3 seconds, $0.00001 fees
        ↓
$RIZO tokens credited to user account
        ↓
User sees: "+85 RIZO tokens earned!" 🎉
```
 
**The user never sees wallets, private keys, or blockchain.**
 
---
 
## 🪙 $RIZO Token System
 
| Action | Tokens Earned |
|---|---|
| Sign up | +20 tokens |
| Post in community | +5 tokens |
| Leave a product review | +10 tokens |
| Make a purchase | +60–110 tokens |
| Complete profile | +20 tokens |
 
### Token Benefits
 
| Tokens | Benefit |
|---|---|
| 500 | 10% discount on next purchase |
| 1,000 | Free shipping on all orders |
| 2,000 | Access to exclusive products |
 
> Tokens remain active with a minimum of 2 purchases per month.
 
---
 
## 🗺️ Roadmap
 
### Phase 1 — Testnet (Current) ✅
- User registration with invisible Stellar wallet
- USDC payments on Stellar Testnet
- $RIZO token loyalty system (Soroban contract deployed)
- Community social feed (Muro de Metamorfosis)
- Marketplace with curated curly hair products
- Curl specialists directory
### Phase 2 — Mainnet (Q2 2026)
- Migrate to Stellar Mainnet with real USDC payments
- Curl type quiz + personalized product recommendations
- Curl routine library (2A–4C)
- Soulbound Tokens for verified stylist credentials
- Appointment booking system
- Product review system with curl type tagging
### Phase 3 — Scale (Q4 2026)
- Mobile app (React Native)
- Expand to Colombia and Argentina
- Brand partnership program
- RIZO DAO governance
---
 
## 💰 Business Model
 
- **Transaction fees** — 3–5% per purchase
- **Professional bookings** — 10–15% commission
- **Brand subscriptions** — $299–$1,999 MXN/month
- **Native advertising** — Sponsored content in community feed
- **$RIZO token sales** — Users buy tokens for faster rewards
---
 
## 🌍 Market Opportunity
 
- **50M+** Latin women with curly/wavy/afro-textured hair
- **$15B** Latin American beauty market
- **130M** population in Mexico alone
- **0** competitors combining blockchain loyalty + curly hair community in this niche
---
 
## 🤝 Contributing
 
We welcome contributions from the community, especially through [Drips Wave](https://www.drips.network/wave). Check out our open issues to find tasks labeled `wave`.
 
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.
 
---

## 👥 Team

| Name | Role |
|------|------|
| Valeria Ortiz Montiel | Founder / Product Lead |
| Nallely López García | Lead Developer |
| Yeni Daniela Ojeda Gómez | Frontend Developer |

---

## 🔗 Links

- 🚀 **Live App**: [rizo-dao.vercel.app](https://rizo-dao.vercel.app)
- 🎥 **Demo Video**: [YouTube](https://youtu.be/gOCZK7X_2pg?si=pehD1Y7r5IrufIxL)
- 🌟 **Stellar Explorer**: [View Transactions](https://stellar.expert/explorer/testnet/account/GD6KTSYJYBEJ4IFN42RPTYLHZGZLLA5YTYGOA4VREFSUBRUHX6M2AJ46)
- 🏆 **Drips Wave Issues**: [github.com/nallely-lopez/RizoDAO/issues](https://github.com/nallely-lopez/RizoDAO/issues)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ for the Latin curly hair community
  <br>
  Powered by Stellar Network 🌟
</div>
