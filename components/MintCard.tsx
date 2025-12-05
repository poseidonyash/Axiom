"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Sparkles, CheckCircle, ExternalLink, AlertCircle } from "lucide-react";
import { baseSepolia } from "wagmi/chains";

// Contract ABI - AxiomV2 mintPrediction function
const AXIOM_V2_ABI = [
  {
    inputs: [
      { name: "tokenURI", type: "string" },
      { name: "market", type: "string" },
      { name: "betSize", type: "string" },
      { name: "edgeBasisPoints", type: "uint256" }
    ],
    name: "mintPrediction",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// IMPORTANT: Replace this with your AxiomV2 contract address after deployment
// See contracts/DEPLOYMENT_GUIDE.md for instructions
const CONTRACT_ADDRESS = "0xd6115D69BffFB2A919d39d3BaE12C131c5A738B4"; // REPLACE WITH AXIOM V2 ADDRESS!

interface Prediction {
  market: string;
  userProbability: number;
  marketPrice: number;
  optimalBetSize: number;
  edge: number;
}

interface MintCardProps {
  prediction: Prediction;
}

export default function MintCard({ prediction }: MintCardProps) {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  // Contract write hook
  const { 
    data: hash, 
    writeContract,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();

  // Log errors to console
  if (writeError) {
    console.error("❌ Contract write error:", writeError);
  }

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle mint button click
  const handleMint = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setIsMinting(true);

    try {
      // Create token URI metadata
      const metadata = {
        market: prediction.market,
        userProbability: prediction.userProbability,
        marketPrice: prediction.marketPrice,
        optimalBetSize: prediction.optimalBetSize,
        edge: prediction.edge,
        timestamp: new Date().toISOString(),
        minter: address,
      };

      // For hackathon: using a simple IPFS-style URI
      // In production, you'd upload metadata to IPFS
      const tokenURI = `ipfs://axiom-prediction-v2/${JSON.stringify(metadata)}`;
      
      // Format bet size for display
      const betSizeFormatted = `$${prediction.optimalBetSize.toFixed(2)}`;
      
      // Convert edge to basis points (12.5% = 1250 basis points)
      const edgeBasisPoints = Math.round(prediction.edge * 100);

      // Call the AxiomV2 contract with all parameters
      console.log("🔍 Attempting to mint with:", {
        address: CONTRACT_ADDRESS,
        chainId: baseSepolia.id,
        market: prediction.market,
        betSize: betSizeFormatted,
        edge: edgeBasisPoints
      });

      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AXIOM_V2_ABI,
        functionName: "mintPrediction",
        args: [
          tokenURI,
          prediction.market,
          betSizeFormatted,
          BigInt(edgeBasisPoints)
        ],
        chainId: baseSepolia.id,
      });
    } catch (error) {
      console.error("❌ Minting error:", error);
      setIsMinting(false);
    }
  };

  // Reset minting state when confirmed
  if (isConfirmed && isMinting) {
    setIsMinting(false);
  }

  // Get transaction status
  const getStatus = () => {
    if (isConfirmed) return "success";
    if (isConfirming) return "confirming";
    if (isWritePending) return "pending";
    if (writeError) return "error";
    return "idle";
  };

  const status = getStatus();

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-purple-500/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/30">
          <Sparkles className="w-6 h-6 text-purple-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Proof of Intelligence</h3>
          <p className="text-sm text-gray-300">Mint your prediction as an NFT</p>
        </div>
      </div>

      {/* Prediction Summary */}
      <div className="bg-black/30 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Market:</span>
          <span className="font-medium">{prediction.market}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Your Edge:</span>
          <span className="font-medium text-green-400">+{prediction.edge.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Position Size:</span>
          <span className="font-medium">${prediction.optimalBetSize.toFixed(2)}</span>
        </div>
      </div>

      {/* Mint Button / Status */}
      {status === "idle" && (
        <button
          onClick={handleMint}
          disabled={!isConnected || isMinting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Mint Prediction NFT
        </button>
      )}

      {status === "pending" && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent" />
            <div>
              <div className="font-medium text-yellow-400">Waiting for signature...</div>
              <div className="text-sm text-gray-300">Check MetaMask</div>
            </div>
          </div>
        </div>
      )}

      {status === "confirming" && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent" />
            <div>
              <div className="font-medium text-blue-400">Minting on Base Sepolia...</div>
              <div className="text-sm text-gray-300">Transaction submitted</div>
              {hash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-300 hover:underline flex items-center gap-1 mt-1"
                >
                  View on BaseScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div className="flex-1">
              <div className="font-medium text-green-400">Prediction Minted! 🎉</div>
              <div className="text-sm text-gray-300">Your proof is on the blockchain</div>
              {hash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-300 hover:underline flex items-center gap-1 mt-1"
                >
                  View on BaseScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-red-400">Transaction Failed</div>
              <div className="text-sm text-gray-300 mt-1">
                {writeError?.message?.includes("User rejected") 
                  ? "You rejected the transaction"
                  : "Something went wrong. Try again?"}
              </div>
              <button
                onClick={handleMint}
                className="mt-3 text-sm text-red-300 hover:text-red-200 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Text */}
      {status === "idle" && (
        <p className="text-xs text-gray-400 text-center mt-3">
          This mints an NFT on Base Sepolia proving your prediction and edge calculation
        </p>
      )}
    </div>
  );
}


