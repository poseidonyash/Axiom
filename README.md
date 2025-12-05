# Axiom: Proof of Intelligence Engine

> Find your true edge in prediction markets with mathematical precision

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![OnchainKit](https://img.shields.io/badge/OnchainKit-Integrated-blue)](https://onchainkit.xyz/)
[![Base](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org/)
[![Polymarket](https://img.shields.io/badge/Polymarket-CLOB_API-purple)](https://polymarket.com/)

## 🎯 What is Axiom?

Axiom is a "Proof of Intelligence" engine that helps prediction market traders find their true edge. It:

1. **Fetches live market data** from Polymarket's CLOB API
2. **Calculates optimal bet sizes** using the Kelly Criterion
3. **Mints predictions as NFTs** on Base to prove you knew it before it happened

### Why It Matters

Prediction markets like Polymarket have billions in trading volume, but most traders just guess their position sizes. Axiom applies mathematical rigor to bet sizing - the same techniques used by quantitative hedge funds - and makes it accessible to everyone.

## ✨ Features (V2 - Upgraded!)

- 🟢 **Live Market Data**: Real-time Polymarket data via server-side proxy (NO CORS!)
- 💼 **Portfolio Mode**: Optimize allocation across multiple markets simultaneously
- 🧮 **Kelly Criterion Math**: Mathematically optimal bet sizing for multi-market portfolios
- 🎨 **Mint NFTs on Base**: Immutable proof of your predictions
- ⛓️ **Real Oracle Feed**: Live blockchain reads - no mock data, fully decentralized
- 💎 **OnchainKit Integration**: Seamless wallet connection and identity
- 🌙 **Beautiful UI**: Dark mode with modern design

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- MetaMask or Coinbase Wallet
- Base Sepolia testnet configured
- Test ETH from Base Sepolia faucet

### Installation

```bash
# Install dependencies (already done!)
npm install --legacy-peer-deps

# Set up environment variables
# .env.local with your OnchainKit API key
# See ENV_SETUP_INSTRUCTIONS.md for details

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) and start calculating!

### V2 Deployment

**After initial setup, deploy AxiomV2:**

1. Deploy `contracts/AxiomV2.sol` via Remix IDE
2. Update contract address in `components/MintCard.tsx`
3. Update contract address in `components/OracleFeedV2.tsx`
4. Restart dev server

See **[V2_QUICKSTART.md](V2_QUICKSTART.md)** for detailed instructions!

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete wallet and testnet setup guide
- **[contracts/DEPLOYMENT_GUIDE.md](contracts/DEPLOYMENT_GUIDE.md)** - Deploy the smart contract
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[DEMO.md](DEMO.md)** - 3-minute presentation script for judges

## 🏗️ Architecture

```
MBC/
├── app/
│   ├── layout.tsx          # OnchainKit + wagmi providers
│   ├── page.tsx            # Main dashboard
│   ├── providers.tsx       # Web3 configuration
│   └── globals.css         # Dark theme + glassmorphism
├── components/
│   ├── Navbar.tsx          # Wallet connection (OnchainKit)
│   ├── AxiomCalculator.tsx # Core logic: API + Kelly math
│   ├── MintCard.tsx        # NFT minting button
│   └── OracleFeed.tsx      # Social feed of predictions
├── utils/
│   ├── kellyMath.ts        # Kelly Criterion calculations
│   └── polymarketApi.ts    # Polymarket CLOB API client
└── contracts/
    ├── AxiomV1.sol         # ERC-721 prediction NFTs
    └── deployment.json     # Contract address & ABI
```

## 🧮 The Math: Kelly Criterion

The Kelly Criterion is the mathematically optimal bet sizing formula:

```
f* = (p - C) / (1 - C)
```

Where:
- **p** = Your probability estimate (0.0 to 1.0)
- **C** = Market price/probability (0.0 to 1.0)  
- **f\*** = Optimal fraction of bankroll to bet

### Example

- Market prices BTC > $100k at 65% (C = 0.65)
- You think it's 70% (p = 0.70)
- Your edge: +5%
- Kelly says bet: `(0.70 - 0.65) / (1 - 0.65) = 14.3%` of bankroll

If your bankroll is $1,000, you should bet $143.

## 🎨 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Blockchain** | Base Sepolia |
| **Web3 SDK** | @coinbase/onchainkit |
| **Web3 Hooks** | wagmi + viem |
| **Data Fetching** | @tanstack/react-query |
| **API** | Polymarket CLOB API |
| **Icons** | lucide-react |

## 🏆 Hackathon Tracks

### Base Track

**Criteria:**
- ✅ **Onchain Magic (30%)**: NFT minting with immutable prediction proof
- ✅ **Delight (25%)**: Beautiful UI, real-time calculations, smooth UX
- ✅ **Utility (20%)**: Solves real problem for prediction market traders
- ✅ **Technical (15%)**: Clean code, efficient contract, proper integration
- ✅ **Cultural Resonance (10%)**: "Proof of Intelligence" as a new category

### Polymarket Bounty

**Requirements:**
- ✅ **Direct Integration**: CLOB API for live market prices
- ✅ **Real Market Data**: Bitcoin > $100k market (token_id: 217426...)
- ✅ **Meaningful Use**: Core feature driving bet size calculations

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

Get your API key from [Coinbase Developer Portal](https://portal.cdp.coinbase.com/).

### Smart Contract

After deploying `contracts/AxiomV1.sol` to Base Sepolia:

1. Copy the contract address
2. Update `CONTRACT_ADDRESS` in `components/MintCard.tsx`
3. Copy the ABI to `contracts/deployment.json`

See [contracts/DEPLOYMENT_GUIDE.md](contracts/DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## 🐛 Troubleshooting

### Polymarket API CORS Error

This is expected in development! The code automatically uses a fallback price (0.65 for BTC > $100k). For production, proxy through a Next.js API route.

### Wallet Button Blank

Ensure `import "@coinbase/onchainkit/styles.css";` is in `app/layout.tsx` before your custom CSS.

### Transaction Fails

- Check you're on Base Sepolia network
- Ensure you have at least 0.01 ETH
- Verify contract address is correct in `MintCard.tsx`

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more solutions.

## 📖 How to Use

1. **Connect Wallet**: Click "Connect Wallet" in the navbar
2. **View Market Price**: See live Bitcoin > $100k price from Polymarket
3. **Enter Your Probability**: What do YOU think the probability is?
4. **Set Bankroll**: How much capital are you willing to allocate?
5. **Calculate Edge**: Axiom instantly computes your optimal bet size
6. **Mint Prediction**: Create an NFT proof on Base Sepolia

## 🎬 Demo Day

Preparing for your presentation? See [DEMO.md](DEMO.md) for:

- 3-minute script aligned with judging criteria
- Technical talking points
- Q&A preparation
- Backup plans if something breaks
- Body language tips

## 🔮 Future Enhancements

- [ ] Support for multiple Polymarket markets
- [ ] Portfolio tracking across predictions
- [ ] Reputation scores based on NFT history
- [ ] Social features: follow top predictors
- [ ] Analytics dashboard with historical performance
- [ ] Mobile app (PWA)
- [ ] Integration with other prediction markets (Augur, Gnosis)

## 📄 License

MIT License - feel free to fork and build upon Axiom!

## 🙏 Acknowledgments

- **Base** for making blockchain accessible and affordable
- **Polymarket** for transparent prediction markets and open API
- **OnchainKit** for seamless Web3 integration
- **Ed Thorp** for inventing the Kelly Criterion

## 🔗 Links

- **Base:** https://base.org/
- **OnchainKit:** https://onchainkit.xyz/
- **Polymarket:** https://polymarket.com/
- **Kelly Criterion:** https://en.wikipedia.org/wiki/Kelly_criterion

---

**Built with 💜 for MBC 2025 Hackathon**

*Prove you knew it before it happened.* 🔮


