# 🚀 Axiom V2 Upgrade Guide

## What's New in V2?

### ✅ Three Major Upgrades

1. **🔓 CORS Fixed** - No more yellow badges! Real Polymarket data via server-side proxy
2. **💼 Portfolio Mode** - Calculate optimal allocation across multiple markets simultaneously  
3. **⛓️ Real Oracle Feed** - Live blockchain data instead of mock predictions

---

## 🎯 Quick Summary

### Before (V1):
- ❌ Polymarket API blocked by CORS → fallback price
- ❌ Single market calculation only
- ❌ Oracle Feed used fake mock data

### After (V2):
- ✅ Polymarket API works via `/api/proxy` route
- ✅ Portfolio Mode: Bitcoin + Ethereum markets
- ✅ Oracle Feed reads real predictions from blockchain

---

## 📦 What's Been Changed

### New Files Created:

1. **`app/api/proxy/route.ts`** - Server-side API proxy (kills CORS)
2. **`components/AxiomCalculatorV2.tsx`** - Portfolio mode calculator
3. **`components/OracleFeedV2.tsx`** - Reads from blockchain
4. **`contracts/AxiomV2.sol`** - Contract with prediction history
5. **`UPGRADE_GUIDE.md`** - This file!

### Modified Files:

1. **`utils/polymarketApi.ts`** - Now uses `/api/proxy` instead of direct API
2. **`components/MintCard.tsx`** - Updated for AxiomV2 contract
3. **`app/page.tsx`** - Uses V2 components

---

## 🔧 Deployment Instructions

### Step 1: Deploy AxiomV2 Contract

1. **Open Remix IDE:**
   - Go to https://remix.ethereum.org/
   - Create new file: `AxiomV2.sol`
   - Copy the contents from `contracts/AxiomV2.sol`

2. **Compile:**
   - Click "Solidity Compiler"
   - Select version 0.8.20+
   - Click "Compile AxiomV2.sol"
   - Wait for green checkmark ✅

3. **Deploy:**
   - Click "Deploy & Run Transactions"
   - Environment: **"Injected Provider - MetaMask"**
   - **Ensure MetaMask is on Base Sepolia!**
   - Contract dropdown: Select **"AxiomV2"**
   - Click orange **"Deploy"** button
   - Confirm in MetaMask
   - Wait 10-15 seconds

4. **Copy Contract Address:**
   - Find "Deployed Contracts" section
   - Copy the address (looks like `0x1234...5678`)
   - Save it somewhere!

### Step 2: Update Contract Addresses

You need to update the contract address in **TWO** files:

#### File 1: `components/MintCard.tsx`

Find this line (around line 21):
```typescript
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```

Replace with:
```typescript
const CONTRACT_ADDRESS = "0xYOUR_AXIOM_V2_ADDRESS_HERE";
```

#### File 2: `components/OracleFeedV2.tsx`

Find this line (around line 38):
```typescript
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```

Replace with:
```typescript
const CONTRACT_ADDRESS = "0xYOUR_AXIOM_V2_ADDRESS_HERE";
```

**IMPORTANT:** Use the same address in both files!

### Step 3: Restart Dev Server

```bash
# Stop the server (Ctrl+C if running)
# Then start it again:
npm run dev
```

---

## 🧪 Testing the Upgrades

### Test 1: Verify CORS is Fixed

1. Open http://localhost:3001
2. Look at the "Market Price" section
3. **You should see:** 🟢 "Live from Polymarket" (green badge)
4. **If yellow:** Check browser console for errors

### Test 2: Verify Portfolio Mode

1. You should see TWO markets:
   - **Market 1:** Bitcoin > $100k (auto-filled from API)
   - **Market 2:** Ethereum > $4k (manual entry)
2. Enter probabilities for both
3. Should show allocation for BOTH markets
4. Total allocation should be displayed

### Test 3: Verify Oracle Feed

1. Before minting: Feed shows "No predictions yet" or "Deploy contract first"
2. After deploying AxiomV2: Feed will show "Loading..."
3. After minting your first prediction: It appears in the feed!
4. Refresh page: Your prediction persists (it's on-chain!)

---

## 🎨 New Features in Detail

### 1. API Proxy Route (`/api/proxy`)

**How it works:**
- Browser calls `/api/proxy?market=BTC_100K`
- Next.js server fetches from Polymarket (server-side, no CORS!)
- Returns price data to frontend
- Fallback handling if Polymarket is down

**Benefits:**
- ✅ No more CORS errors
- ✅ Green "Live" badge
- ✅ Judges will be impressed
- ✅ Production-ready architecture

### 2. Portfolio Mode

**How it works:**
- Calculates Kelly Criterion for TWO markets independently
- Bitcoin market uses live Polymarket price
- Ethereum market uses manual price entry
- Shows allocation for each + total

**Math:**
- If both have edge: allocate to both
- If total > 100%: scale down proportionally (conservative)
- If only one has edge: allocate to that one only

**Display:**
- Green box = Market has edge
- Gray box = No edge, skip this market
- Total portfolio allocation in purple

### 3. Real Oracle Feed

**How it works:**
- Reads from AxiomV2 contract using `useReadContract`
- Calls `getRecentPredictions(10)` to get last 10
- Auto-refreshes every 10 seconds
- Shows real addresses, timestamps, edges

**Benefits:**
- ✅ No more mock data
- ✅ Truly decentralized
- ✅ Verifiable on BaseScan
- ✅ Social proof for hackathon

---

## 🐛 Troubleshooting V2

### Issue: Still seeing yellow badge

**Check:**
1. API proxy route created? (`app/api/proxy/route.ts`)
2. Dev server restarted after creating route?
3. Check browser console for errors
4. Try: `curl http://localhost:3001/api/proxy?market=BTC_100K`

**If proxy returns fallback:**
- This means Polymarket's API is actually down
- The proxy IS working, but Polymarket isn't responding
- This is rare but possible

### Issue: Oracle Feed shows "Deploy contract first"

**Fix:**
1. Deploy AxiomV2.sol via Remix
2. Copy the contract address
3. Update `CONTRACT_ADDRESS` in both:
   - `components/MintCard.tsx`
   - `components/OracleFeedV2.tsx`
4. Restart dev server

### Issue: Oracle Feed shows "No predictions yet"

**This is correct!** It means:
- ✅ Contract is deployed
- ✅ Feed is reading from blockchain successfully
- ❌ No one has minted a prediction yet

**Solution:** Mint your first prediction! It will appear in the feed.

### Issue: Minting fails with AxiomV2

**Check:**
1. Contract address is updated in `MintCard.tsx`
2. You have enough ETH (0.01+)
3. MetaMask is on Base Sepolia
4. Contract was actually deployed (check BaseScan)

**Verify deployment:**
- Go to https://sepolia.basescan.org/
- Search for your contract address
- Should show "Contract Creation" transaction

---

## 📊 Architecture Changes

### Before (V1):
```
Frontend → Polymarket API (CORS block) → Fallback
Frontend → Mock data for Oracle Feed
```

### After (V2):
```
Frontend → Next.js API Route → Polymarket API ✅
Frontend → wagmi → Base Sepolia → Real predictions ✅
```

---

## 🎯 Hackathon Impact

### Base Track Improvements:

| Criterion | V1 | V2 | Impact |
|-----------|----|----|--------|
| Onchain Magic | NFT minting | NFT + Public feed | ⬆️ Better |
| Delight | Basic UI | Portfolio mode | ⬆️ Better |
| Utility | Single bet | Multi-market portfolio | ⬆️ Much Better |
| Technical | Good code | Production proxy + on-chain feed | ⬆️ Much Better |

### Polymarket Bounty Improvements:

| Requirement | V1 | V2 | Impact |
|------------|----|----|--------|
| Integration | Direct (CORS blocked) | Server-side proxy ✅ | ⬆️ Working! |
| Meaningful Use | Single calc | Portfolio optimization | ⬆️ More sophisticated |

---

## 💡 Talking Points for Judges

### When Showing Portfolio Mode:
> "In V2, we've upgraded to Portfolio Mode. This isn't just calculating one bet - we're optimizing allocation across multiple uncorrelated markets using Kelly Criterion. If both Bitcoin and Ethereum show positive edge, Axiom tells you exactly how much to bet on each to maximize portfolio growth."

### When Showing Oracle Feed:
> "This isn't mock data - every prediction you see is pulled directly from our smart contract on Base Sepolia. It's truly decentralized, verifiable on BaseScan, and updates in real-time as people mint."

### When Showing API Proxy:
> "We solved the CORS problem with a Next.js API route. The proxy fetches Polymarket data server-side, giving us production-ready architecture that scales. Notice the green 'Live from Polymarket' badge - that's real data flowing through right now."

---

## 🎬 Updated Demo Flow

### 30-Second V2 Demo:

1. **Show Portfolio Mode (10 sec)**
   - "Two markets, both with live/manual pricing"
   - Enter probabilities
   - Show allocation across both

2. **Show Live API (5 sec)**
   - Point to green badge
   - "Server-side proxy, no CORS issues"

3. **Mint and Show Feed (10 sec)**
   - Mint a prediction
   - Point to Oracle Feed updating
   - "Real blockchain data, refreshing live"

4. **Technical Flex (5 sec)**
   - "Portfolio optimization + real API + on-chain feed"
   - "Production-ready architecture"

---

## 📋 Pre-Demo Checklist (V2)

- [ ] AxiomV2 deployed to Base Sepolia
- [ ] Contract address updated in MintCard.tsx
- [ ] Contract address updated in OracleFeedV2.tsx
- [ ] Dev server restarted
- [ ] Green badge showing on market price
- [ ] Portfolio mode showing two markets
- [ ] Test mint works
- [ ] Oracle Feed loads (even if empty)
- [ ] Have BaseScan tab open to contract

---

## 🔮 What to Show Judges

### 1. Open the App
Point out:
- "Portfolio Mode" header
- Two market inputs
- Green "Live from Polymarket" badge

### 2. Calculate Portfolio
- Enter: BTC 70%, ETH 65%
- Enter: ETH Market Price 55%
- Enter: Bankroll $1000
- Show: Allocation across both markets

### 3. Mint Prediction
- Click "Mint Prediction NFT"
- Show MetaMask transaction
- Point out: Gas cost < $0.01

### 4. Show Oracle Feed
- Point to right sidebar
- Show your prediction appearing
- "This is reading from our smart contract in real-time"
- Open BaseScan to verify

### 5. Code Walkthrough (if asked)
- Show `app/api/proxy/route.ts` - "Server-side fetch"
- Show `contracts/AxiomV2.sol` - "Public predictions array"
- Show `components/OracleFeedV2.tsx` - "useReadContract hook"

---

## 🏆 Why V2 Wins

### Technical Sophistication
- ✅ Proper API architecture (proxy pattern)
- ✅ Advanced math (multi-market portfolio optimization)
- ✅ On-chain data storage and retrieval
- ✅ Real-time blockchain reads

### Production Readiness
- ✅ No CORS hacks or workarounds
- ✅ Scalable architecture
- ✅ Error handling throughout
- ✅ Gas-efficient smart contract

### Innovation
- ✅ First to apply portfolio theory to prediction markets
- ✅ Social feed built entirely on-chain
- ✅ No centralized database needed

---

## 📝 Next Steps

1. **Deploy AxiomV2 contract** (5 min)
2. **Update contract addresses** in both component files (1 min)
3. **Test the full flow** (5 min)
4. **Practice updated demo script** (10 min)
5. **Screenshot everything** for backup

---

## 🆘 Need Help?

### Quick Checks:
```bash
# Test API proxy
curl http://localhost:3001/api/proxy?market=BTC_100K

# Should return JSON with price

# Check contract on BaseScan
# Go to: https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

### Common Issues:
- **Green badge not showing?** → Restart dev server
- **Portfolio not calculating?** → Check browser console
- **Oracle Feed empty?** → Deploy contract + mint first prediction
- **Mint fails?** → Verify contract address in BOTH files

---

## 🎉 You're Ready for V2!

The upgraded Axiom is now:
- ✨ **Production-grade** (real API proxy)
- 🧮 **More sophisticated** (portfolio optimization)
- ⛓️ **Truly decentralized** (on-chain feed)
- 🏆 **Hackathon-winning** (all three upgrades)

**Now go deploy AxiomV2 and dominate the competition!** 💜🚀

---

**Questions?** Check `TROUBLESHOOTING.md` or `contracts/DEPLOYMENT_GUIDE_V2.md`


