"use client";

import { Radio, TrendingUp, Clock, User } from "lucide-react";
import { useReadContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { formatDistanceToNow } from "date-fns";

// AxiomV2 Contract ABI for reading predictions
const AXIOM_V2_READ_ABI = [
  {
    inputs: [{ name: "count", type: "uint256" }],
    name: "getRecentPredictions",
    outputs: [
      {
        components: [
          { name: "market", type: "string" },
          { name: "betSize", type: "string" },
          { name: "predictor", type: "address" },
          { name: "timestamp", type: "uint256" },
          { name: "edge", type: "uint256" }
        ],
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPredictionCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

// IMPORTANT: Replace with your deployed AxiomV2 contract address
const CONTRACT_ADDRESS = "0xd6115D69BffFB2A919d39d3BaE12C131c5A738B4"; // REPLACE ME!

interface OnchainPrediction {
  market: string;
  betSize: string;
  predictor: string;
  timestamp: bigint;
  edge: bigint;
}

export default function OracleFeedV2() {
  // Read recent predictions from the blockchain
  const { data: predictions, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AXIOM_V2_READ_ABI,
    functionName: "getRecentPredictions",
    args: [BigInt(10)], // Get 10 most recent
    chainId: baseSepolia.id,
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Read total prediction count
  const { data: totalCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AXIOM_V2_READ_ABI,
    functionName: "getPredictionCount",
    chainId: baseSepolia.id,
    query: {
      refetchInterval: 10000,
    },
  });

  // Helper to format address
  const formatAddress = (address: string): string => {
    if (!address) return "0x...";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Helper to format edge
  const formatEdge = (edgeBasisPoints: bigint): string => {
    const edgePercent = Number(edgeBasisPoints) / 100;
    return `+${edgePercent.toFixed(1)}%`;
  };

  // Helper to format timestamp
  const formatTimestamp = (timestamp: bigint): string => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  // Generate avatar color from address
  const getAvatarColor = (address: string): string => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    if (!address) return colors[0];
    const index = parseInt(address.slice(2, 4), 16) % colors.length;
    return colors[index];
  };

  return (
    <div className="glass-strong rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20 relative">
            <Radio className="w-5 h-5 text-green-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Oracle Feed</h3>
            <p className="text-xs text-gray-400">Live on-chain predictions</p>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full pulse-ring" />
            LIVE
          </div>
          {totalCount !== undefined && (
            <div className="text-xs text-gray-500">
              {totalCount.toString()} total
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-2" />
            <div className="text-sm text-gray-400">Loading predictions...</div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-8">
            <div className="text-yellow-400 mb-2">⚠️</div>
            <div className="text-sm text-gray-400 mb-3">
              Failed to load predictions
            </div>
            <button
              onClick={() => refetch()}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!predictions || predictions.length === 0) && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-400 mb-1">No predictions yet</div>
            <div className="text-xs text-gray-500">Be the first to mint a prediction!</div>
          </div>
        )}

        {/* Predictions List */}
        {predictions && predictions.length > 0 && predictions.map((pred: OnchainPrediction, idx: number) => (
          <div
            key={idx}
            className="glass rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
          >
            {/* User info */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${getAvatarColor(pred.predictor)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {pred.predictor ? pred.predictor.slice(2, 4).toUpperCase() : "??"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate font-mono">
                  {formatAddress(pred.predictor)}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(pred.timestamp)}
                </div>
              </div>
            </div>

            {/* Prediction details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Market</span>
                <span className="font-medium">{pred.market}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Edge</span>
                <span className="font-bold text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {formatEdge(pred.edge)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Position</span>
                <span className="font-medium text-purple-400">{pred.betSize}</span>
              </div>
            </div>

            {/* Mint badge */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                Minted on Base
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-gray-500">
          All predictions are stored immutably on Base Sepolia
        </p>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

