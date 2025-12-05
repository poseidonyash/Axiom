"use client";

import { useReadContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { User, TrendingUp, Target, ExternalLink } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
] as const;

const CONTRACT_ADDRESS = "0xd6115D69BffFB2A919d39d3BaE12C131c5A738B4";

interface OnchainPrediction {
  market: string;
  betSize: string;
  predictor: string;
  timestamp: bigint;
  edge: bigint;
}

interface UserStats {
  address: string;
  predictionCount: number;
  totalEdge: number;
  avgEdge: number;
  totalBetSize: number;
  recentPrediction: OnchainPrediction;
}

export default function CommunityPage() {
  // Read all predictions from the blockchain
  const { data: predictions, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AXIOM_V2_READ_ABI,
    functionName: "getRecentPredictions",
    args: [BigInt(100)], // Get up to 100 predictions
    chainId: baseSepolia.id,
    query: {
      refetchInterval: 15000, // Refetch every 15 seconds
    },
  });

  // Group predictions by user
  const userStats: UserStats[] = predictions ? (() => {
    const userMap = new Map<string, UserStats>();
    
    predictions.forEach((pred: OnchainPrediction) => {
      const existing = userMap.get(pred.predictor);
      const edgePercent = Number(pred.edge) / 100;
      const betSize = parseFloat(pred.betSize.replace(/[^0-9.]/g, '')) || 0;
      
      if (existing) {
        existing.predictionCount++;
        existing.totalEdge += edgePercent;
        existing.totalBetSize += betSize;
        existing.avgEdge = existing.totalEdge / existing.predictionCount;
        // Keep most recent prediction
        if (pred.timestamp > existing.recentPrediction.timestamp) {
          existing.recentPrediction = pred;
        }
      } else {
        userMap.set(pred.predictor, {
          address: pred.predictor,
          predictionCount: 1,
          totalEdge: edgePercent,
          avgEdge: edgePercent,
          totalBetSize: betSize,
          recentPrediction: pred,
        });
      }
    });
    
    // Convert to array and sort by prediction count
    return Array.from(userMap.values()).sort((a, b) => b.predictionCount - a.predictionCount);
  })() : [];

  // Helper to format address
  const formatAddress = (address: string): string => {
    if (!address) return "0x...";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Helper to format edge
  const formatEdge = (edge: number): string => {
    return `+${edge.toFixed(1)}%`;
  };

  // Generate avatar color from address
  const getAvatarColor = (address: string): string => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-yellow-500 to-orange-500',
    ];
    if (!address) return colors[0];
    const index = parseInt(address.slice(2, 4), 16) % colors.length;
    return colors[index];
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Community Feed</span>
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              See what other predictors are betting on
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Follow top predictors, analyze their strategies, and learn from the best.
              Every prediction is verified on-chain.
            </p>
          </div>

          {/* Stats Bar */}
          {userStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-strong rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{userStats.length}</div>
                <div className="text-sm text-gray-400">Total Predictors</div>
              </div>
              <div className="glass-strong rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {predictions?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Total Predictions</div>
              </div>
              <div className="glass-strong rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {formatEdge(userStats.reduce((sum, u) => sum + u.avgEdge, 0) / userStats.length)}
                </div>
                <div className="text-sm text-gray-400">Avg Community Edge</div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent mx-auto mb-4" />
              <div className="text-gray-400">Loading community...</div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && userStats.length === 0 && (
            <div className="text-center py-16 glass-strong rounded-2xl">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Predictions Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to mint a prediction!</p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Make Your First Prediction
              </Link>
            </div>
          )}

          {/* User Cards Grid */}
          {userStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userStats.map((user) => (
                <Link
                  key={user.address}
                  href={`/user/${user.address}`}
                  className="glass-strong rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-[1.02] cursor-pointer group"
                >
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(user.address)} flex items-center justify-center text-white font-bold text-xl relative`}>
                      {user.address.slice(2, 4).toUpperCase()}
                      {user.predictionCount > 5 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs">
                          ⭐
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate font-mono group-hover:text-purple-400 transition-colors">
                        {formatAddress(user.address)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {user.predictionCount} prediction{user.predictionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Avg Edge
                      </span>
                      <span className="font-bold text-green-400">
                        {formatEdge(user.avgEdge)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Total Staked
                      </span>
                      <span className="font-bold text-purple-400">
                        ${user.totalBetSize.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Recent Prediction Preview */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-500 mb-1">Latest Prediction</div>
                    <div className="text-sm font-medium truncate">
                      {user.recentPrediction.market}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          {!isLoading && userStats.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => refetch()}
                className="glass px-6 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                Refresh Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

