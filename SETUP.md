# Axiom Setup Guide

Welcome to Axiom! This guide will help you set up your wallet and testnet environment for the hackathon.

## Prerequisites

- A modern web browser (Chrome, Firefox, or Brave recommended)
- Internet connection

---

## Step 1: Install MetaMask Wallet

1. **Download MetaMask:**
   - Go to [https://metamask.io/download/](https://metamask.io/download/)
   - Click "Install MetaMask for Chrome" (or your browser)
   - Add the extension to your browser

2. **Create Your Wallet:**
   - Open MetaMask extension
   - Click "Create a new wallet"
   - Create a strong password
   - **IMPORTANT:** Write down your Secret Recovery Phrase on paper
   - Store it in a safe place (never share it with anyone!)
   - Confirm your recovery phrase
   - Your wallet is ready! 🎉

---

## Step 2: Add Base Sepolia Testnet

Base Sepolia is the testnet where we'll deploy Axiom. Let's add it to MetaMask:

1. **Open MetaMask:**
   - Click the MetaMask extension icon
   - Click the network dropdown at the top (it probably says "Ethereum Mainnet")

2. **Add Network Manually:**
   - Scroll down and click "Add network"
   - Click "Add a network manually"

3. **Enter Base Sepolia Details:**
   ```
   Network Name: Base Sepolia
   New RPC URL: https://sepolia.base.org
   Chain ID: 84532
   Currency Symbol: ETH
   Block Explorer URL: https://sepolia.basescan.org
   ```

4. **Save:**
   - Click "Save"
   - Switch to "Base Sepolia" network
   - You should see "Base Sepolia" at the top of MetaMask now ✅

---

## Step 3: Get Test ETH

You need test ETH to deploy contracts and mint NFTs. Here's how to get it:

### Option 1: Coinbase Faucet (Recommended)

1. **Visit the Faucet:**
   - Go to [https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

2. **Connect Your Wallet:**
   - Click "Connect Wallet"
   - Select MetaMask
   - Approve the connection

3. **Request Test ETH:**
   - Click "Send me ETH"
   - Wait 10-30 seconds
   - Check your MetaMask - you should see 0.05 ETH! 💰

### Option 2: Alternative Faucets

If the Coinbase faucet is busy, try these:

- **Alchemy Faucet:** [https://www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)
- **QuickNode Faucet:** [https://faucet.quicknode.com/base/sepolia](https://faucet.quicknode.com/base/sepolia)

---

## Step 4: Get Your OnchainKit API Key

OnchainKit powers Axiom's wallet connection and identity features.

1. **Create Coinbase Developer Account:**
   - Go to [https://portal.cdp.coinbase.com/](https://portal.cdp.coinbase.com/)
   - Click "Sign up" or "Sign in"
   - Use your email or GitHub to sign up

2. **Create a Project:**
   - Click "Create Project"
   - Name it "Axiom" (or anything you like)
   - Select "Base" as the blockchain

3. **Get Your API Key:**
   - In your project dashboard, find "API Keys"
   - Click "Create API Key"
   - Copy the key (it starts with something like `pk_...`)

4. **Add to Axiom:**
   - Open the `.env.local` file in the Axiom project
   - Paste your API key after `NEXT_PUBLIC_ONCHAINKIT_API_KEY=`
   - Save the file
   - Example:
     ```
     NEXT_PUBLIC_ONCHAINKIT_API_KEY=pk_test_abc123xyz789
     ```

---

## Step 5: Verify Your Setup

Let's make sure everything works:

1. **Check MetaMask:**
   - ✅ Network is set to "Base Sepolia"
   - ✅ You have at least 0.01 ETH in your balance

2. **Check Environment:**
   - ✅ `.env.local` file has your API key
   - ✅ No spaces or quotes around the key

3. **Start Axiom:**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000)
   - Click "Connect Wallet"
   - If MetaMask pops up, you're ready! 🚀

---

## Troubleshooting

### "MetaMask is locked"
- Click the MetaMask icon and enter your password

### "Wrong network detected"
- Click the network dropdown in MetaMask
- Select "Base Sepolia"

### "Insufficient funds"
- Get more test ETH from the faucets above
- Each faucet has a cooldown period (usually 24 hours)

### "API Key not found"
- Make sure `.env.local` is in the root folder (same level as `package.json`)
- Restart the dev server: Stop with Ctrl+C, then run `npm run dev` again

---

## Ready to Build!

You're all set! Now you can:
- ✨ Fetch live Polymarket data
- 🧮 Calculate optimal bet sizes with Kelly Criterion
- 🎨 Mint your predictions as NFTs on Base

Need help? Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file or ask for assistance!

---

**Pro Tips for the Hackathon:**
- Keep your test ETH safe - you need it for transactions
- Always double-check you're on Base Sepolia (not mainnet!)
- Back up your MetaMask recovery phrase
- Have fun and build something amazing! 🏆





