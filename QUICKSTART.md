# ⚡ Quick Start Guide

Get Axiom running in 5 minutes!

## Step 1: Install Dependencies ✅

You've already done this! The packages are installed.

## Step 2: Get Your OnchainKit API Key 🔑

1. Go to: https://portal.cdp.coinbase.com/
2. Sign up / Log in
3. Create a project called "Axiom"
4. Copy your API key (starts with `pk_`)
5. Create a file called `.env.local` in the root folder
6. Add this line:
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=pk_your_key_here
   ```

## Step 3: Start the Dev Server 🚀

```bash
npm run dev
```

Open http://localhost:3000 - you should see Axiom!

## Step 4: Set Up Your Wallet 💰

### Install MetaMask
1. Go to: https://metamask.io/download/
2. Install the browser extension
3. Create a new wallet (save your recovery phrase!)

### Add Base Sepolia Network
1. Open MetaMask
2. Click the network dropdown (top center)
3. Click "Add network" → "Add a network manually"
4. Enter these details:
   - **Network Name:** Base Sepolia
   - **RPC URL:** https://sepolia.base.org
   - **Chain ID:** 84532
   - **Currency Symbol:** ETH
   - **Block Explorer:** https://sepolia.basescan.org
5. Click "Save"
6. Switch to Base Sepolia

### Get Test ETH
1. Go to: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Connect your wallet
3. Click "Send me ETH"
4. Wait 30 seconds - you should see 0.05 ETH in your wallet!

## Step 5: Connect Your Wallet 🔗

1. Go back to http://localhost:3000
2. Click "Connect Wallet" in the top right
3. Select MetaMask
4. Approve the connection

You're connected! 🎉

## Step 6: Deploy the Smart Contract 📝

This is the most technical part, but we've made it easy:

1. Open **contracts/DEPLOYMENT_GUIDE.md**
2. Follow the step-by-step instructions (takes ~5 minutes)
3. You'll use Remix IDE (no local setup needed)
4. After deployment, copy your contract address
5. Update `CONTRACT_ADDRESS` in **components/MintCard.tsx**

## Step 7: Test It Out! 🧪

1. The calculator should show a market price (live or fallback)
2. Enter a probability (e.g., 70)
3. Enter a bankroll (e.g., 1000)
4. See your optimal bet size calculated instantly!
5. Click "Mint Prediction" to create an NFT
6. Check your transaction on BaseScan

## What If Something Breaks? 🔧

Check **TROUBLESHOOTING.md** for common issues and solutions.

Most common issues:
- **Wallet button blank?** → Add API key to `.env.local` and restart server
- **Polymarket shows yellow?** → That's fine! It's using the fallback price
- **Mint fails?** → Check you have ETH and are on Base Sepolia network

## Next Steps 🎯

- Read **DEMO.md** for your 3-minute presentation script
- Explore the code in `components/` and `utils/`
- Customize the UI to make it your own!
- Practice your demo 3-5 times

## File Structure Overview

```
Important Files:
├── app/page.tsx              ← Main page UI
├── components/
│   ├── AxiomCalculator.tsx   ← Core logic
│   ├── MintCard.tsx          ← NFT minting (UPDATE CONTRACT_ADDRESS HERE!)
│   └── Navbar.tsx            ← Wallet connection
├── utils/
│   ├── kellyMath.ts          ← Kelly Criterion math
│   └── polymarketApi.ts      ← Polymarket integration
└── contracts/
    ├── AxiomV1.sol           ← Smart contract
    └── DEPLOYMENT_GUIDE.md   ← Deploy instructions

Configuration:
├── .env.local                ← API key (CREATE THIS!)
├── package.json              ← Dependencies
└── tailwind.config.ts        ← Styling
```

## Time Estimate

- ⏱️ API Key: 2 minutes
- ⏱️ Wallet Setup: 5 minutes  
- ⏱️ Getting Test ETH: 1 minute
- ⏱️ Contract Deployment: 5 minutes
- ⏱️ Testing: 2 minutes

**Total: ~15 minutes to fully functional dApp!**

## Need Help?

1. Check **TROUBLESHOOTING.md**
2. Check **SETUP.md** for detailed wallet instructions
3. Re-read the error message carefully
4. Make sure you completed ALL steps above

## You're Ready! 🏆

Now you have a fully functional "Proof of Intelligence" dApp!

- ✅ Live Polymarket integration
- ✅ Kelly Criterion calculations  
- ✅ NFT minting on Base
- ✅ Beautiful UI

Go build something amazing! 🚀



