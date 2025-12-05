# Axiom Demo Script

## 3-Minute Presentation for MBC 2025 Hackathon

**Target:** Base Track Winner + Polymarket Bounty  
**Time:** 3 minutes max  
**Focus:** Innovation, Delight, Utility

---

## Pre-Demo Setup (Do This First!)

### ✅ Technical Checklist
- [ ] Dev server running: `npm run dev`
- [ ] Browser open to: `http://localhost:3000`
- [ ] MetaMask connected to Base Sepolia
- [ ] Wallet has 0.02+ ETH
- [ ] Contract deployed and address updated in code
- [ ] API key set in `.env.local`
- [ ] Calculator showing price (live or fallback)
- [ ] BaseScan tab open to your contract address

### ✅ Demo Props
- [ ] Calculator showing 70% probability, $1000 bankroll
- [ ] Have ready-to-mint prediction prepared
- [ ] Screenshots of previous successful mints (backup)
- [ ] This script open for reference

---

## The 3-Minute Script

### Opening Hook (15 seconds)

**[Show the homepage]**

> "Imagine you think Bitcoin will hit $100k with 70% certainty, but the market only prices it at 65%. You have an edge - but how much should you bet? Too little and you miss profits. Too much and you risk ruin. That's where Axiom comes in."

**Key phrase:** "Proof of Intelligence Engine"

---

### Problem & Solution (30 seconds)

**[Gesture to the calculator interface]**

> "Prediction markets like Polymarket have billions in volume, but most traders just guess their position sizes. Axiom solves this by:
> 
> 1. **Fetching live market prices** from Polymarket's CLOB API in real-time
> 2. **Applying the Kelly Criterion** - the mathematically optimal bet sizing formula used by quantitative traders
> 3. **Minting predictions as NFTs** on Base - creating immutable proof you calculated the edge before the event"

**Key phrase:** "Mathematical precision meets prediction markets"

---

### Live Demo: The Magic (90 seconds)

**[Start with the calculator visible]**

#### Step 1: Show Live Data (15 sec)
> "First, watch this - we're pulling live Bitcoin market prices from Polymarket right now."

**[Point to the green 'Live from Polymarket' badge]**

> "The market thinks Bitcoin hitting $100k is a 65% chance. That's our baseline."

#### Step 2: Calculate the Edge (30 sec)
> "Now, I input MY probability - let's say I think it's 70%."

**[Type 70 in the probability field]**

> "And my bankroll - say $1,000."

**[Type 1000 in the bankroll field]**

> "Instantly, Axiom calculates using the Kelly Criterion..."

**[Show the result appearing in real-time]**

> "...and tells me my optimal bet size is [X dollars]. I have a +5% edge, and the algorithm recommends this exact position size to maximize long-term growth while managing risk."

**Point to the recommendation text:**
> "See how it explains the reasoning? That's the 'intelligence' in Proof of Intelligence."

#### Step 3: Mint the Prediction (30 sec)
> "Now here's where it gets interesting. To prove I made this calculation BEFORE the outcome, I mint it as an NFT on Base."

**[Scroll to the Mint Card]**

> "Click 'Mint Prediction'..."

**[Click the button, wait for MetaMask]**

> "MetaMask pops up... transactions on Base are instant and cost less than a cent..."

**[Confirm in MetaMask]**

> "And boom - my prediction is permanently on-chain."

**[Show the success message with BaseScan link]**

> "This NFT proves I calculated a 5% edge at this exact moment. No retroactive cherry-picking. No trust required. Pure math, timestamped forever."

#### Step 4: Show the Oracle Feed (15 sec)
**[Gesture to the right sidebar]**

> "And here's the social layer - the Oracle Feed shows other users' predictions and their calculated edges. It's like Twitter, but every post is backed by math and minted on-chain."

---

### Technical Highlights for Judges (30 seconds)

**[Switch to code view OR keep on homepage]**

> "Technically, Axiom demonstrates:
> 
> **For Base Track:**
> - OnchainKit integration for seamless wallet connection and identity
> - Smart contracts deployed on Base Sepolia
> - Gas-efficient NFT minting (we wrote our own minimal ERC-721)
> - Beautiful, delightful UX with glassmorphism and real-time updates
> 
> **For Polymarket Bounty:**
> - Direct integration with Polymarket CLOB API
> - Live price fetching with fallback handling
> - Real market data driving actual financial calculations
> 
> The entire app is Next.js 14, TypeScript, and uses wagmi + viem for Web3 interactions."

---

### Closing: The Vision (15 seconds)

**[Return to homepage, show the hero section]**

> "Axiom isn't just a calculator - it's a new category. We're calling it 'Proof of Intelligence.' 
> 
> In a world of noise and guesswork, Axiom lets smart traders prove they knew it first. Mathematical certainty, on-chain forever."

**[Pause]**

> "That's Axiom. Thank you!"

---

## Scoring Alignment

### Base Track Criteria

| Criterion | How We Score | Script Emphasis |
|-----------|-------------|----------------|
| **Onchain Magic (30%)** | NFT minting proves predictions permanently; OnchainKit makes wallet connection seamless | "Immutable proof", "OnchainKit integration" |
| **Delight (25%)** | Beautiful glassmorphism UI, real-time calculations, smooth animations, Oracle Feed | "Instant", "seamless", gesture to UI |
| **Utility (20%)** | Solves real problem for prediction market traders; Kelly Criterion is industry-standard | "Billions in volume", "mathematically optimal" |
| **Technical (15%)** | Clean architecture, efficient contract, proper Web3 integration | "Gas-efficient", "Next.js 14", "minimal ERC-721" |
| **Cultural Resonance (10%)** | "Proof of Intelligence" as a meme; Oracle Feed social layer | "New category", "prove they knew it first" |

### Polymarket Bounty Criteria

| Requirement | How We Meet It | Script Emphasis |
|-------------|---------------|----------------|
| **Direct Integration** | CLOB API fetching live prices | "Live from Polymarket", show green badge |
| **Real Market Data** | Bitcoin > $100k market | Show actual price, explain token ID in code |
| **Meaningful Use** | Core feature, not just displaying data | "Real market data driving financial calculations" |

---

## Backup Plans

### If Wallet Connection Fails
> "For the demo, let me show you the code that handles wallet auth... [switch to app/providers.tsx] ...we're using OnchainKit's enterprise-grade infrastructure here."

Then show screenshots of successful connection.

### If Polymarket API is Down
> "We're seeing the fallback price here - the system is designed with resilience. In production, we'd proxy through our backend, but the math engine works identically with live or fallback data. Let me show you the Kelly Criterion calculation..."

Point to the code in `utils/kellyMath.ts`.

### If Minting Transaction Fails
> "The contract is deployed at [address] on Base Sepolia. Let me show you a previous successful mint..."

Switch to BaseScan tab showing your contract and past transactions.

### If Everything Breaks
> "Let me walk you through the architecture and innovation instead..."

Show the code structure, explain the Kelly Criterion, show the smart contract.

**Remember:** Judges care about the IDEA and INNOVATION more than perfect live demo execution.

---

## Q&A Prep

### Expected Questions & Answers

**Q: "How do you handle if someone's probability is wrong?"**  
A: "Great question! The Kelly Criterion assumes your probability estimates are correct. Garbage in, garbage out. But that's actually the POINT - this tool doesn't make you smarter, it just makes sure you bet the right SIZE when you DO have an edge. Think of it like a calculator: it doesn't solve the math problem for you, but it makes sure your arithmetic is perfect."

**Q: "Why NFTs instead of just storing in a database?"**  
A: "Two reasons: First, it's trustless proof. A database could be edited, but blockchain timestamps are immutable. Second, it creates a tradeable asset. In the future, users could build reputation scores based on their prediction NFT history and potentially monetize their track record."

**Q: "What if I want to predict something other than Bitcoin?"**  
A: "The architecture is modular! We focused on Bitcoin for the hackathon, but the same Kelly Criterion math and API structure works for any binary prediction market on Polymarket. We'd just need to pass in a different token_id. I can show you the code - it's in `utils/polymarketApi.ts`, the `fetchMarketPrice` function."

**Q: "Why Base instead of Ethereum mainnet?"**  
A: "Cost and speed. Minting on Base costs less than a cent and confirms in seconds. On Ethereum mainnet, the same transaction could cost $20-50 in gas. For a prediction app where users might mint multiple times a day, Base is the obvious choice. Plus, Base's focus on consumer apps and OnchainKit made integration incredibly smooth."

**Q: "How accurate is the Kelly Criterion in practice?"**  
A: "Kelly is the gold standard for bet sizing in quantitative trading, used by everyone from Renaissance Technologies to professional poker players. The key is that it maximizes long-term growth while avoiding ruin. In practice, many traders use 'Half Kelly' (50% of the full Kelly bet) to be more conservative, and we actually provide that as a feature in our math utilities."

---

## Body Language & Presentation Tips

### Do:
- ✅ Smile and make eye contact with judges
- ✅ Use hand gestures to emphasize "live data", "instant calculation", "on-chain proof"
- ✅ Speak with confidence - you built something cool!
- ✅ Point to specific UI elements as you explain them
- ✅ Have fun with it - let your enthusiasm show

### Don't:
- ❌ Apologize for anything unless critically broken
- ❌ Say "um" or "like" - pause instead
- ❌ Rush - 3 minutes is plenty of time
- ❌ Read from the script - just use as a guide
- ❌ Panic if something breaks - pivot to your backup plan

---

## Time Markers (Practice This)

**0:00 - 0:15** → Opening hook  
**0:15 - 0:45** → Problem & solution overview  
**0:45 - 2:15** → Live demo (the core)  
**2:15 - 2:45** → Technical highlights  
**2:45 - 3:00** → Closing vision

**Practice this flow 3-5 times before the actual demo!**

---

## Post-Demo Follow-Up

After your presentation:

1. **Thank the judges**
2. **Stay available** for questions
3. **Network** with other teams
4. **Tweet about it** - tag @base and @Polymarket
5. **Document your journey** - win or lose, you built something impressive

---

## Final Pep Talk

You built a complete, functional dApp that:
- ✅ Solves a real problem
- ✅ Uses cutting-edge technology
- ✅ Demonstrates mathematical rigor
- ✅ Has a beautiful UX
- ✅ Integrates with two major ecosystems (Base + Polymarket)

**You should be proud.**

The judges are looking for:
1. **Innovation** ← You have it (Proof of Intelligence is novel)
2. **Execution** ← You built a working product
3. **Potential** ← This could actually be used by real traders

**You've got this.** 

Go win that hackathon! 🚀🏆

---

## Emergency Contact Info

If you need to reach someone during the event:

- **Technical Issues:** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Base Support:** https://discord.gg/base
- **Polymarket Docs:** https://docs.polymarket.com/

---

**Good luck! You're ready. Trust your work.** 💜



