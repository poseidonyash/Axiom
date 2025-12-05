# ⚡ Axiom V2 - Quick Start

## 🎯 What You Need to Do (10 Minutes)

### 1. Deploy AxiomV2 Contract (5 min)

```
1. Go to: https://remix.ethereum.org/
2. Create file: AxiomV2.sol
3. Copy from: contracts/AxiomV2.sol
4. Compile with 0.8.20+
5. Deploy to Base Sepolia
6. Copy contract address
```

### 2. Update Contract Addresses (2 min)

**File 1: `components/MintCard.tsx` (line ~21)**
```typescript
const CONTRACT_ADDRESS = "0xYOUR_ADDRESS_HERE";
```

**File 2: `components/OracleFeedV2.tsx` (line ~38)**
```typescript
const CONTRACT_ADDRESS = "0xYOUR_ADDRESS_HERE";
```

⚠️ **USE THE SAME ADDRESS IN BOTH FILES!**

### 3. Restart Server (1 min)

```bash
# Stop with Ctrl+C
npm run dev
# Open: http://localhost:3001
```

### 4. Test It! (2 min)

- ✅ See "Portfolio Mode" header
- ✅ See green "Live from Polymarket" badge
- ✅ Enter probabilities for both markets
- ✅ Mint a prediction
- ✅ See it appear in Oracle Feed

---

## ✨ V2 Features

### 1. NO MORE CORS! 🎉
**Before:** Yellow badge, fallback price  
**After:** Green badge, real Polymarket data  
**How:** Server-side proxy at `/api/proxy`

### 2. Portfolio Mode 📊
**Before:** Single bet calculation  
**After:** Two markets, optimal allocation across both  
**Math:** Independent Kelly Criterion + proportional scaling

### 3. Real Oracle Feed ⛓️
**Before:** Fake mock data  
**After:** Real blockchain reads via wagmi  
**Source:** AxiomV2 contract `getRecentPredictions()`

---

## 🐛 Quick Troubleshooting

### Still seeing yellow badge?
→ Restart dev server  
→ Check: `curl http://localhost:3001/api/proxy?market=BTC_100K`

### Oracle Feed says "Deploy contract"?
→ Update contract addresses in BOTH files  
→ Restart dev server

### Mint fails?
→ Check you have ETH  
→ Verify contract address is correct  
→ Check you're on Base Sepolia

---

## 🎬 Demo Script (1 Minute)

> "This is Axiom V2. We've made three critical upgrades:
>
> **One:** Server-side API proxy - see the green badge? That's real Polymarket data, no CORS issues.
>
> **Two:** Portfolio Mode - we're not just calculating one bet, we're optimizing allocation across multiple markets using Kelly Criterion.
>
> **Three:** This Oracle Feed? Every prediction is stored on-chain. No database, fully decentralized. Watch..."
>
> **[Mint prediction]**
>
> "...and there it is. Real-time blockchain data. That's production-ready architecture."

---

## 📁 File Locations

**Need to update these 2 files:**
- `components/MintCard.tsx` (line 21)
- `components/OracleFeedV2.tsx` (line 38)

**New contract file:**
- `contracts/AxiomV2.sol` (deploy this)

**API proxy:**
- `app/api/proxy/route.ts` (already working!)

---

## ✅ Success Criteria

You'll know it's working when:
- 🟢 Green badge on market price
- 💼 Two market inputs visible
- 📊 Portfolio allocation shows for both
- ⛓️ Oracle Feed shows "No predictions yet" (not "Deploy contract")
- ✨ After minting, your prediction appears in feed
- 🔄 Refreshing page still shows the prediction

---

## 🏆 Why This Wins

**Judges will notice:**
1. Real API integration (not mocked or blocked)
2. Sophisticated math (portfolio optimization)
3. True decentralization (on-chain feed)
4. Production architecture (API proxy pattern)
5. Polish (green badges, live updates)

---

**Deploy → Update → Test → Win!** 🚀💜

For detailed instructions, see:
- `UPGRADE_GUIDE.md` - Full explanation
- `contracts/DEPLOYMENT_GUIDE_V2.md` - This file (expanded)
- `TROUBLESHOOTING.md` - If stuck


