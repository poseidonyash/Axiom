# Axiom: Proof of Intelligence Engine

> Find your true edge in prediction markets with mathematical precision

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![OnchainKit](https://img.shields.io/badge/OnchainKit-Integrated-blue)](https://onchainkit.xyz/)
[![Base](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org/)
[![Polymarket](https://img.shields.io/badge/Polymarket-API-purple)](https://polymarket.com/)

## 🎯 What is Axiom?

Axiom is a **Proof of Intelligence** engine that transforms prediction market trading from guesswork into mathematical precision. It combines real-time market data, portfolio optimization, and blockchain verification to help traders find and prove their edge.

### The Problem

Prediction markets like Polymarket have billions in trading volume, but most traders:
- ❌ Guess their position sizes
- ❌ Can't optimize across multiple markets
- ❌ Have no way to prove they predicted correctly *before* the event

### The Solution

Axiom provides:
1. **Live Market Data** - Real-time pricing from Polymarket via server-side proxy
2. **Portfolio Optimization** - Kelly Criterion across multiple uncorrelated markets
3. **Blockchain Proof** - Mint predictions as NFTs on Base with immutable timestamps

---

## ✨ Features

### 🟢 Live Market Integration
- Real-time data from Polymarket's API
- Server-side proxy eliminates CORS issues
- Auto-refreshes every 10 seconds

### 💼 Portfolio Mode
- Calculate optimal allocation across **two markets simultaneously**
- Bitcoin > $100k + Ethereum > $4k
- Automatic scaling if total exceeds 100% of bankroll
- Color-coded edge indicators

### 🧮 Kelly Criterion Math
- Binary option formula: `f* = (p - C) / (1 - C)`
- Real-time calculation as you type
- Shows edge magnitude and bet size
- Handles independent, uncorrelated bets

### 🎨 NFT Minting on Base
- Mint predictions as ERC-721 tokens
- Stores market, bet size, edge, and timestamp
- Gas costs < $0.01 on Base Sepolia
- Verifiable on BaseScan

### ⛓️ On-Chain Oracle Feed
- Real blockchain reads (no mock data!)
- Shows last 10 predictions from all users
- Auto-refreshes from smart contract
- Click to view user profiles

### 💎 OnchainKit Integration
- Seamless wallet connection
- Beautiful `<Identity />` components
- One-click Base network switching
- Optimized for Base ecosystem

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17.0 or higher
- **MetaMask** or Coinbase Wallet
- **Base Sepolia** testnet configured
- **Test ETH** from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd MBC

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Add your OnchainKit API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) 🎉

### Smart Contract Deployment

Before minting NFTs, you need to deploy the contract:

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `AxiomV2.sol`
3. Copy contents from `contracts/AxiomV2.sol`
4. Compile with Solidity 0.8.20+
5. Deploy to **Base Sepolia** (Injected Provider - MetaMask)
6. Copy the deployed contract address
7. Update `CONTRACT_ADDRESS` in:
   - `components/MintCard.tsx` (line 26)
   - `components/OracleFeedV2.tsx` (line 40)
8. Restart dev server

**Detailed instructions:** [contracts/DEPLOYMENT_GUIDE_V2.md](contracts/DEPLOYMENT_GUIDE_V2.md)

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Wallet setup and Base Sepolia configuration
- **[contracts/DEPLOYMENT_GUIDE_V2.md](contracts/DEPLOYMENT_GUIDE_V2.md)** - Contract deployment walkthrough
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + lucide-react icons |
| **Blockchain** | Base Sepolia (Testnet) |
| **Web3** | OnchainKit + wagmi + viem |
| **Data** | React Query + Polymarket API |
| **Smart Contracts** | Solidity 0.8.20+ |

### Project Structure

```
MBC/
├── app/
│   ├── api/proxy/         # Server-side Polymarket proxy
│   ├── layout.tsx         # OnchainKit + wagmi providers
│   ├── page.tsx           # Main dashboard
│   └── providers.tsx      # Web3 configuration
├── components/
│   ├── Navbar.tsx         # Wallet connection (OnchainKit)
│   ├── AxiomCalculatorV2.tsx  # Portfolio optimizer
│   ├── MintCard.tsx       # NFT minting interface
│   └── OracleFeedV2.tsx   # Live blockchain feed
├── utils/
│   ├── kellyMath.ts       # Kelly Criterion formulas
│   └── polymarketApi.ts   # API client with caching
└── contracts/
    ├── AxiomV2.sol        # ERC-721 with prediction storage
    └── deployment.json    # Contract address & ABI
```

### Data Flow

```
Frontend → Next.js API Route → Polymarket API → Frontend
         ↓
    Kelly Calculation
         ↓
    User Confirms
         ↓
    wagmi → AxiomV2 Contract → Base Sepolia
         ↓
    Transaction Hash
         ↓
    Oracle Feed Updates (reads from chain)
```

---

## 🧮 The Math: Kelly Criterion

The Kelly Criterion calculates the optimal bet size to maximize long-term growth:

### Formula (Binary Options)

```
f* = (p - C) / (1 - C)
```

Where:
- **f\*** = Optimal fraction of bankroll to bet
- **p** = Your probability estimate (0.0 to 1.0)
- **C** = Current market price (0.0 to 1.0)

### Example: Bitcoin > $100k

| Variable | Value |
|----------|-------|
| Market Price (C) | 65% (0.65) |
| Your Belief (p) | 70% (0.70) |
| Your Edge | +5% |
| Kelly Fraction | (0.70 - 0.65) / (1 - 0.65) = **14.3%** |

**If your bankroll is $1,000, bet $143.**

### Portfolio Mode

When optimizing across **two independent markets**:

1. Calculate Kelly for each market separately
2. If total > 100%, scale both proportionally (conservative)
3. If total < 100%, use both allocations as-is
4. Display recommendation based on which markets have edge

**Example:**
- Bitcoin Kelly: 14.3% → **$143**
- Ethereum Kelly: 10.0% → **$100**
- **Total allocation: $243 (24.3% of bankroll)**

---

## 📖 How to Use

### 1. Connect Your Wallet
Click **"Connect Wallet"** in the navbar. Approve the connection in MetaMask.

### 2. View Live Market Prices
See real-time prices for:
- **Market 1:** Bitcoin > $100k 🟢
- **Market 2:** Ethereum > $4k 🟢

Both update every 10 seconds from Polymarket's API.

### 3. Enter Your Probabilities
Input what **YOU** believe the probability is for each market.

**Tips:**
- Be honest with yourself
- Consider all available information
- Don't just copy the market price!

### 4. Set Your Bankroll
Enter the total amount you're willing to allocate across both markets.

### 5. Review Portfolio Allocation
Axiom calculates optimal bet sizes for both markets:
- **Green boxes** = Positive edge, allocate funds
- **Gray boxes** = No edge, skip this market
- **Purple total** = Combined portfolio allocation

### 6. Mint Your Prediction
Click **"Mint Prediction NFT"** to create immutable proof:
- Stored on Base Sepolia blockchain
- Includes market, bet size, edge, timestamp
- Costs < $0.01 in gas
- Appears in Oracle Feed instantly

### 7. View the Oracle Feed
See predictions from all users in real-time. Click any prediction to view that user's profile.

---

## 🎨 UI/UX Highlights

- **Glassmorphism** design with dark theme
- **Real-time calculations** as you type
- **Color-coded indicators** (green = edge, red/gray = no edge)
- **Smooth animations** and hover states
- **Responsive layout** for mobile
- **Live badges** with pulse animations
- **Transaction states** with loading spinners
- **BaseScan links** for verification

---

## 🏆 Built For

### MBC 2025 Hackathon

**Base Track:**
- ✅ Onchain Magic: NFT minting with rich metadata
- ✅ Delight: Beautiful UI with real-time updates
- ✅ Utility: Solves real problem for traders
- ✅ Technical: Clean architecture with API proxy
- ✅ Cultural: "Proof of Intelligence" as new paradigm

**Polymarket Bounty:**
- ✅ Direct API integration via server-side proxy
- ✅ Meaningful use: Powers core calculation engine
- ✅ Real market data driving portfolio optimization

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the root directory:

```bash
# Required: Get from https://portal.cdp.coinbase.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

### Network Setup

**Base Sepolia Testnet:**
- **Network Name:** Base Sepolia
- **RPC URL:** https://sepolia.base.org
- **Chain ID:** 84532
- **Currency Symbol:** ETH
- **Block Explorer:** https://sepolia.basescan.org

Get test ETH: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 🐛 Troubleshooting

### Issue: Market prices not loading

**Solution:**
- Check browser console for errors
- Verify `/api/proxy` route exists
- Restart dev server
- Check if Polymarket's API is responding

### Issue: Oracle Feed shows "No predictions yet"

**This is correct!** It means:
- ✅ Contract is deployed
- ✅ Feed is reading from blockchain
- ❌ No one has minted yet

**Action:** Be the first to mint a prediction!

### Issue: Mint button fails

**Checklist:**
- [ ] Wallet connected?
- [ ] On Base Sepolia network?
- [ ] Contract address updated in both files?
- [ ] Have at least 0.01 ETH for gas?
- [ ] Contract actually deployed? (check BaseScan)

**More solutions:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🔮 Future Enhancements

- [ ] Support 5+ markets with auto-discovery
- [ ] Historical tracking with performance analytics
- [ ] Reputation scores based on NFT accuracy
- [ ] Social features: follow top predictors
- [ ] Export portfolio as PDF report
- [ ] Mobile app (PWA)
- [ ] Mainnet deployment (Base L2)
- [ ] Integration with Farcaster for social proof

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs via GitHub Issues
- Submit pull requests
- Suggest new features
- Improve documentation

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Base** for fast, affordable blockchain infrastructure
- **Polymarket** for transparent prediction markets and open API
- **Coinbase OnchainKit** for seamless Web3 integration
- **Ed Thorp** for discovering the Kelly Criterion in 1956
- **The MBC community** for the opportunity to build this

---

## 🔗 Links

- **Base:** https://base.org/
- **OnchainKit:** https://onchainkit.xyz/
- **Polymarket:** https://polymarket.com/
- **Kelly Criterion (Wikipedia):** https://en.wikipedia.org/wiki/Kelly_criterion
- **BaseScan (Sepolia):** https://sepolia.basescan.org/

---

**Built with 💜 for MBC 2025 Hackathon**

*Prove you knew it before it happened.* 🔮

