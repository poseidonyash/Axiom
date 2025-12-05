# Smart Contract Deployment Guide

Follow these step-by-step instructions to deploy the AxiomV1 contract to Base Sepolia using Remix IDE.

---

## Prerequisites

Before starting, make sure you have:
- ✅ MetaMask installed and set up
- ✅ Base Sepolia network added to MetaMask
- ✅ At least 0.01 ETH in your Base Sepolia wallet
- ✅ Read the [SETUP.md](../SETUP.md) guide if you haven't

---

## Step 1: Open Remix IDE

1. **Go to Remix:**
   - Open your browser
   - Navigate to [https://remix.ethereum.org/](https://remix.ethereum.org/)
   - You should see the Remix IDE interface

2. **Create a New File:**
   - In the left sidebar, look for the "File Explorer" icon (looks like a folder)
   - Click the "Create new file" icon (looks like a page with a +)
   - Name it: `AxiomV1.sol`

---

## Step 2: Copy the Contract Code

1. **Open the Contract:**
   - In your local project, open `contracts/AxiomV1.sol`
   - Select ALL the code (Ctrl+A or Cmd+A)
   - Copy it (Ctrl+C or Cmd+C)

2. **Paste into Remix:**
   - Click on `AxiomV1.sol` in Remix
   - Paste the code (Ctrl+V or Cmd+V)
   - Save (Ctrl+S or Cmd+S)

---

## Step 3: Compile the Contract

1. **Open Compiler:**
   - Click the "Solidity Compiler" icon in the left sidebar (looks like an "S")

2. **Set Compiler Version:**
   - In the "Compiler" dropdown, select version `0.8.20` or higher
   - Check "Auto compile" for convenience

3. **Compile:**
   - Click the big blue "Compile AxiomV1.sol" button
   - Wait for the green checkmark ✅
   - If you see a green checkmark, you're ready to deploy!

**Troubleshooting:**
- ❌ Red errors? Make sure you copied the full contract code
- ⚠️ Yellow warnings? Those are okay, you can proceed

---

## Step 4: Deploy to Base Sepolia

1. **Open Deploy Panel:**
   - Click the "Deploy & Run Transactions" icon (looks like an Ethereum logo with an arrow)

2. **Set Environment:**
   - In the "Environment" dropdown, select **"Injected Provider - MetaMask"**
   - MetaMask should pop up asking to connect
   - Click "Connect" and select your account
   - ⚠️ **IMPORTANT:** Check that MetaMask shows "Base Sepolia" at the top
   - If it shows "Ethereum Mainnet" or another network, switch to Base Sepolia!

3. **Select Contract:**
   - In the "Contract" dropdown, select **"AxiomV1"**
   - You should see the contract name with a checkmark

4. **Deploy:**
   - Click the big orange **"Deploy"** button
   - MetaMask will pop up asking you to confirm the transaction
   - Review the gas fee (should be less than $0.01)
   - Click **"Confirm"** in MetaMask

5. **Wait for Confirmation:**
   - You'll see a spinner in Remix
   - Wait 5-15 seconds
   - Look for a green checkmark in the console at the bottom
   - Success! 🎉

---

## Step 5: Copy Contract Address and ABI

### Get the Contract Address

1. **Find Deployed Contract:**
   - In the "Deploy & Run" panel, scroll down to "Deployed Contracts"
   - You should see "AXIOMV1 at 0x..." with a dropdown arrow
   - Click the copy icon next to the address
   - It looks like: `0x1234...5678`

2. **Save the Address:**
   - Open `contracts/deployment.json` in your local project
   - Paste the address (we'll create this file next)

### Get the ABI

1. **Copy ABI from Remix:**
   - Still in the "Deploy & Run" panel
   - Below the contract address, click the contract name dropdown
   - You'll see all the functions (mintPrediction, ownerOf, etc.)
   - Go back to the "Solidity Compiler" icon in the left sidebar
   - Scroll down to the bottom
   - Click "ABI" to copy the ABI to clipboard

2. **Alternative - Copy from Compiler:**
   - Click "Solidity Compiler" in the left sidebar
   - Below the compile button, find "Compilation Details"
   - Click "ABI" - it will copy to your clipboard

---

## Step 6: Save Deployment Info

Create a file called `contracts/deployment.json` with this content:

```json
{
  "contractAddress": "YOUR_CONTRACT_ADDRESS_HERE",
  "chainId": 84532,
  "chainName": "Base Sepolia",
  "abi": [YOUR_ABI_HERE]
}
```

**Full Example:**

```json
{
  "contractAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  "chainId": 84532,
  "chainName": "Base Sepolia",
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "name": "minter", "type": "address"},
        {"indexed": true, "name": "tokenId", "type": "uint256"},
        {"indexed": false, "name": "tokenURI", "type": "string"},
        {"indexed": false, "name": "timestamp", "type": "uint256"}
      ],
      "name": "PredictionMinted",
      "type": "event"
    },
    {
      "inputs": [{"name": "tokenURI", "type": "string"}],
      "name": "mintPrediction",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"name": "tokenId", "type": "uint256"}],
      "name": "ownerOf",
      "outputs": [{"name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"name": "owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"name": "tokenId", "type": "uint256"}],
      "name": "tokenURI",
      "outputs": [{"name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
```

---

## Step 7: Verify Deployment

1. **Check on BaseScan:**
   - Go to [https://sepolia.basescan.org/](https://sepolia.basescan.org/)
   - Paste your contract address in the search bar
   - You should see your contract with:
     - ✅ Contract creation transaction
     - ✅ Your wallet address as the deployer
     - ✅ Contract name: "AxiomV1"

2. **Test in Remix (Optional):**
   - In the deployed contract dropdown in Remix
   - Try calling `totalSupply` (it should return 0)
   - Try calling `name` (it should return "Axiom Predictions")
   - These don't cost gas because they're read-only

---

## Step 8: Update Your App

Now that your contract is deployed, update the app:

1. **Edit MintCard.tsx:**
   - Look for the line with `contractAddress`
   - Replace with your actual contract address

2. **Restart the Dev Server:**
   ```bash
   npm run dev
   ```

3. **Test Minting:**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Connect your wallet
   - Enter probabilities and bankroll
   - Click "Mint Prediction"
   - Confirm in MetaMask
   - Success! Check your NFT on BaseScan 🎨

---

## Troubleshooting

### "Transaction failed"
- **Check ETH Balance:** Make sure you have at least 0.01 ETH
- **Check Network:** Ensure MetaMask is on Base Sepolia
- **Gas Issues:** Try increasing gas limit in MetaMask advanced settings

### "Contract not found"
- **Wait 30 seconds:** Base Sepolia needs time to index the contract
- **Check Address:** Make sure you copied the full address (starts with 0x)
- **Verify on BaseScan:** Search for your address there

### "Wrong network"
- **Switch Network:** Click the network dropdown in MetaMask
- **Select "Base Sepolia"**
- **Refresh the page**

### "Can't copy ABI"
- Use the full ABI from the compiler tab, not the deployed contracts section
- Make sure the contract compiled successfully first

---

## Next Steps

✅ Contract deployed!  
✅ Address saved to deployment.json  
✅ Ready to mint predictions!

Now you can:
1. Update your app to use the real contract address
2. Test minting predictions
3. Prepare for your hackathon demo
4. Show off your Proof of Intelligence! 🏆

---

**Pro Tips:**
- Save your contract address somewhere safe
- Take a screenshot of the BaseScan page for your demo
- The first mint costs more gas (it's initializing storage)
- Keep 0.02 ETH in your wallet for multiple test mints



