# AxiomV2 Smart Contract Deployment Guide

> 🚀 This is the UPGRADED contract with prediction history for the Oracle Feed!

---

## ⚡ Quick Start

**What's different from V1:**
- ✅ Stores prediction history on-chain
- ✅ Public feed accessible via `getRecentPredictions()`
- ✅ More function parameters (market, betSize, edge)
- ✅ Gas-optimized array management

---

## 📋 Prerequisites

Same as V1:
- ✅ MetaMask with Base Sepolia network
- ✅ At least 0.01 ETH on Base Sepolia
- ✅ Remix IDE open

---

## 🎯 Step-by-Step Deployment

### Step 1: Open Remix IDE

1. Go to: https://remix.ethereum.org/
2. Create new file: `AxiomV2.sol`
3. Copy ALL the code from `contracts/AxiomV2.sol` in your project
4. Paste into Remix
5. Save (Ctrl+S)

### Step 2: Compile

1. Click **"Solidity Compiler"** icon (left sidebar)
2. Select compiler: **0.8.20** or higher
3. Click **"Compile AxiomV2.sol"**
4. Wait for green checkmark ✅

**Troubleshooting:**
- Red error? Copy the code again, make sure you got everything
- Yellow warning? Ignore it, proceed

### Step 3: Deploy to Base Sepolia

1. Click **"Deploy & Run Transactions"** icon (left sidebar)
2. Environment dropdown: Select **"Injected Provider - MetaMask"**
3. **MetaMask should pop up** - Click "Connect"
4. **CHECK:** MetaMask shows "Base Sepolia" at the top
   - ⚠️ If it shows "Ethereum Mainnet" → SWITCH TO BASE SEPOLIA!
5. Contract dropdown: Select **"AxiomV2"**
6. Click orange **"Deploy"** button
7. **MetaMask pops up** - Review gas (< $0.01)
8. Click **"Confirm"**
9. Wait 10-15 seconds
10. Look for green checkmark in Remix console ✅

**Success!** Your AxiomV2 contract is deployed! 🎉

### Step 4: Copy Contract Address

1. In "Deployed Contracts" section (bottom of Deploy panel)
2. You'll see: `AXIOMV2 at 0x1234...5678`
3. Click the **copy icon** next to the address
4. **Save this address!** You need it for the next step

Example address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`

### Step 5: Update Your App

You need to update **TWO files**:

#### File 1: Update `components/MintCard.tsx`

1. Open `components/MintCard.tsx`
2. Find line ~21:
   ```typescript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```
3. Replace with your actual address:
   ```typescript
   const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"; // Your address
   ```

#### File 2: Update `components/OracleFeedV2.tsx`

1. Open `components/OracleFeedV2.tsx`
2. Find line ~38:
   ```typescript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```
3. Replace with your actual address (SAME as MintCard):
   ```typescript
   const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"; // Same address
   ```

### Step 6: Restart Dev Server

```bash
# Stop the server: Ctrl+C
# Start it again:
npm run dev
```

### Step 7: Test Everything!

1. **Open app:** http://localhost:3001
2. **Check Portfolio Mode:** Two markets visible
3. **Check Oracle Feed:** Should say "No predictions yet" (not "Deploy contract")
4. **Connect Wallet**
5. **Enter probabilities** for both markets
6. **Click "Mint Prediction"**
7. **Confirm in MetaMask**
8. **Wait 10 seconds**
9. **Check Oracle Feed** - Your prediction should appear! 🎉

---

## 🔍 Verify on BaseScan

1. Go to: https://sepolia.basescan.org/
2. Paste your contract address
3. You should see:
   - ✅ Contract name: AxiomV2
   - ✅ Your wallet as deployer
   - ✅ "Read Contract" tab (try calling `getPredictionCount`)
   - ✅ "Write Contract" tab (try calling functions)

**Test Read Functions:**
- Click "Read Contract"
- Try `getPredictionCount` - should return 0 initially
- Try `name` - should return "Axiom Predictions V2"
- Try `symbol` - should return "AXIOM2"

---

## 🆚 V1 vs V2 Contract

### AxiomV1 (Old):
```solidity
function mintPrediction(string memory tokenURI)
```
- Simple
- No history
- No public feed

### AxiomV2 (New):
```solidity
function mintPrediction(
    string memory tokenURI,
    string memory market,
    string memory betSize,
    uint256 edgeBasisPoints
)
```
- Rich metadata
- Public predictions array
- Oracle Feed compatible
- Still gas-efficient

---

## 💰 Gas Costs

Approximate costs on Base Sepolia:

| Action | Gas | Cost |
|--------|-----|------|
| Deploy AxiomV2 | ~800k | ~$0.01 |
| First mint | ~150k | ~$0.002 |
| Subsequent mints | ~120k | ~$0.0015 |
| Read predictions | 0 | FREE |

**Total to demo:** < $0.02 USD ✅

---

## 🧪 Testing Checklist

After deployment:

- [ ] Contract appears on BaseScan
- [ ] Address updated in MintCard.tsx
- [ ] Address updated in OracleFeedV2.tsx
- [ ] Dev server restarted
- [ ] App loads without errors
- [ ] Portfolio mode shows two markets
- [ ] Oracle Feed says "No predictions yet" (not "Deploy contract")
- [ ] Minting works
- [ ] Prediction appears in Oracle Feed after mint
- [ ] Refreshing page still shows prediction (persistent!)

---

## 🎬 For the Demo

### Opening Line:
> "We've upgraded Axiom to V2. Now we have Portfolio Mode for multi-market optimization, a server-side API proxy for real Polymarket data, and a fully on-chain Oracle Feed. Let me show you..."

### Show the Oracle Feed:
> "See this feed on the right? Every prediction here is stored on Base Sepolia. No database, no centralization. Just pure blockchain. Watch what happens when I mint..."

**[Mint a prediction]**

> "...and there it is. Real-time on-chain data. That's the power of Base."

---

## 🔗 Important Links

- **Your Contract:** https://sepolia.basescan.org/address/YOUR_ADDRESS
- **Remix IDE:** https://remix.ethereum.org/
- **Base Faucet:** https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **BaseScan:** https://sepolia.basescan.org/

---

## 🚨 Critical Reminders

1. **Update BOTH files** with contract address (MintCard + OracleFeed)
2. **Same address in both** - they read/write the same contract
3. **Restart dev server** after updating addresses
4. **Test mint once** before demo to verify everything works
5. **Screenshot your contract on BaseScan** for backup

---

## 📞 Need Help?

Check these docs:
- `UPGRADE_GUIDE.md` - Overview of V2 changes
- `TROUBLESHOOTING.md` - Common issues
- `DEMO.md` - Updated presentation script

---

**You're deploying cutting-edge technology. This is production-grade architecture.** 💜

**Good luck! You've got this!** 🚀🏆




