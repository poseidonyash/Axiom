"use client";

import { useReadContract, useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { User, TrendingUp, Target, ExternalLink, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getCelebProfile, isCeleb, CELEB_PROFILES } from "@/utils/celebProfiles";
import { getAllMockPredictions } from "@/utils/mockPredictions";

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

export default function HomePage() {
  // Get connected wallet address
  const { address: connectedAddress } = useAccount();
  
  // Read all predictions from the blockchain
  const { data: predictions, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AXIOM_V2_READ_ABI,
    functionName: "getRecentPredictions",
    args: [BigInt(100)],
    chainId: baseSepolia.id,
    query: {
      refetchInterval: 15000,
    },
  });

  // Group predictions by user + add mock predictions for celebrities
  const userStats: UserStats[] = (() => {
    const userMap = new Map<string, UserStats>();
    
    // First, initialize all celebrities
    Object.values(CELEB_PROFILES).forEach((celeb) => {
      userMap.set(celeb.address.toLowerCase(), {
        address: celeb.address,
        predictionCount: 0,
        totalEdge: 0,
        avgEdge: 0,
        totalBetSize: 0,
        recentPrediction: {
          market: "No predictions yet",
          betSize: "$0",
          predictor: celeb.address,
          timestamp: BigInt(0),
          edge: BigInt(0),
        },
      });
    });
    
    // Add mock predictions for celebrities
    const mockPredictions = getAllMockPredictions();
    mockPredictions.forEach((pred) => {
      const existing = userMap.get(pred.predictor.toLowerCase());
      const edgePercent = Number(pred.edge) / 100;
      const betSize = parseFloat(pred.betSize.replace(/[^0-9.]/g, '')) || 0;
      
      if (existing) {
        if (existing.predictionCount === 0) {
          // First prediction
          existing.predictionCount = 1;
          existing.totalEdge = edgePercent;
          existing.avgEdge = edgePercent;
          existing.totalBetSize = betSize;
          existing.recentPrediction = pred;
        } else {
          existing.predictionCount++;
          existing.totalEdge += edgePercent;
          existing.totalBetSize += betSize;
          existing.avgEdge = existing.totalEdge / existing.predictionCount;
          if (pred.timestamp > existing.recentPrediction.timestamp) {
            existing.recentPrediction = pred;
          }
        }
      }
    });
    
    // Then add/update with real blockchain predictions
    if (predictions) {
      predictions.forEach((pred: OnchainPrediction) => {
        const existing = userMap.get(pred.predictor.toLowerCase());
        const edgePercent = Number(pred.edge) / 100;
        const betSize = parseFloat(pred.betSize.replace(/[^0-9.]/g, '')) || 0;
        
        if (existing) {
          // Update existing (including celebrities)
          if (existing.predictionCount === 0) {
            // First prediction for this user
            existing.predictionCount = 1;
            existing.totalEdge = edgePercent;
            existing.avgEdge = edgePercent;
            existing.totalBetSize = betSize;
            existing.recentPrediction = pred;
          } else {
            existing.predictionCount++;
            existing.totalEdge += edgePercent;
            existing.totalBetSize += betSize;
            existing.avgEdge = existing.totalEdge / existing.predictionCount;
            if (pred.timestamp > existing.recentPrediction.timestamp) {
              existing.recentPrediction = pred;
            }
          }
        } else {
          // New non-celebrity user
          userMap.set(pred.predictor.toLowerCase(), {
            address: pred.predictor,
            predictionCount: 1,
            totalEdge: edgePercent,
            avgEdge: edgePercent,
            totalBetSize: betSize,
            recentPrediction: pred,
          });
        }
      });
    }
    
    // Sort: Connected user first, then real non-celeb users, then celebrities
    return Array.from(userMap.values()).sort((a, b) => {
      const aIsConnected = connectedAddress && a.address.toLowerCase() === connectedAddress.toLowerCase();
      const bIsConnected = connectedAddress && b.address.toLowerCase() === connectedAddress.toLowerCase();
      
      // Connected user ALWAYS comes first
      if (aIsConnected) return -1;
      if (bIsConnected) return 1;
      
      const aCeleb = isCeleb(a.address);
      const bCeleb = isCeleb(b.address);
      
      // Real non-celebrity users come before celebrities
      if (!aCeleb && bCeleb) return -1;
      if (aCeleb && !bCeleb) return 1;
      
      // Among the same type (both real or both celeb), sort by prediction count
      return b.predictionCount - a.predictionCount;
    });
  })();

  const formatAddress = (address: string): string => {
    if (!address) return "0x...";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatEdge = (edge: number): string => {
    return `+${edge.toFixed(1)}%`;
  };

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
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="gradient-text">Prediction Intelligence</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-6">
              See what the world's top predictors are betting on and trade their predictions
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto mb-8">
              Every prediction verified on-chain. Follow your favorite traders, celebrities, 
              and influencers to learn their strategies.
            </p>
            
            {/* CTA Button */}
            <Link
              href="/calculator"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Make Your Own Prediction
            </Link>
          </div>

          {/* Stats Bar */}
          {userStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="glass-strong rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-1">{userStats.length}</div>
                <div className="text-sm text-gray-400">Top Predictors</div>
              </div>
              <div className="glass-strong rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-400 mb-1">
                  {predictions?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Total Predictions</div>
              </div>
              <div className="glass-strong rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-1">
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
              <div className="text-gray-400">Loading predictors...</div>
            </div>
          )}

          {/* This will never show since we always have celebrities */}

          {/* Predictor Cards Grid - Always show since we have celebrities */}
          {!isLoading && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center">
                🏆 Top Predictors
              </h2>
              <p className="text-center text-gray-400 mb-8">
               Users who minted predictions and featured predictors
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userStats.map((user) => {
                  const celeb = getCelebProfile(user.address);
                  const isVerified = celeb?.verified || false;
                  const isYou = connectedAddress && user.address.toLowerCase() === connectedAddress.toLowerCase();
                  
                  return (
                    <Link
                      key={user.address}
                      href={`/user/${user.address}`}
                      className={`glass-strong rounded-xl overflow-hidden hover:bg-white/10 transition-all transform hover:scale-[1.02] cursor-pointer group ${
                        isYou 
                          ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50' 
                          : celeb 
                          ? 'shadow-xl shadow-yellow-500/40' 
                          : ''
                      }`}
                    >
                      {/* Avatar / Image */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                        {celeb && celeb.imageUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={celeb.imageUrl}
                              alt={celeb.displayName}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to gradient if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            {/* Overlay gradient for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          </div>
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarColor(user.address)}`}>
                            <div className="text-6xl font-bold text-white">
                              {user.address.slice(2, 4).toUpperCase()}
                            </div>
                          </div>
                        )}
                        
                        {/* You Badge */}
                        {isYou && (
                          <div className="absolute top-4 left-4 bg-purple-500 rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                            YOU
                          </div>
                        )}
                        
                        {/* Premium Badge for Celebrities */}
                        {celeb && !isYou && (
                          <div className="absolute top-4 left-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-full px-3 py-1 text-sm font-bold text-yellow-400 shadow-lg flex items-center gap-1">
                            ⭐ FEATURED
                          </div>
                        )}
                        
                        {/* Verified Badge */}
                        {isVerified && (
                          <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2 shadow-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        {/* Prediction Count Badge */}
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                          {user.predictionCount} prediction{user.predictionCount !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl truncate group-hover:text-purple-400 transition-colors">
                              {celeb ? celeb.displayName : formatAddress(user.address)}
                            </h3>
                            {celeb && celeb.bio && (
                              <p className="text-sm text-gray-400 mt-1">{celeb.bio}</p>
                            )}
                            {!celeb && (
                              <p className="text-xs text-gray-500 font-mono mt-1">{formatAddress(user.address)}</p>
                            )}
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors shrink-0 ml-2" />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 glass rounded-lg">
                            <div className="text-xs text-gray-400 mb-1">Avg Edge</div>
                            <div className="font-bold text-green-400">{formatEdge(user.avgEdge)}</div>
                          </div>
                          <div className="text-center p-3 glass rounded-lg">
                            <div className="text-xs text-gray-400 mb-1">Total Staked</div>
                            <div className="font-bold text-purple-400">${user.totalBetSize.toFixed(0)}</div>
                          </div>
                        </div>

                        {/* Recent Prediction Preview with Invest Button */}
                        {user.predictionCount > 0 ? (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs text-gray-500">Latest Bet</div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Save bet to localStorage
                                  const betData = {
                                    market: user.recentPrediction.market,
                                    edge: Number(user.recentPrediction.edge) / 100,
                                    betSize: parseFloat(user.recentPrediction.betSize.replace(/[^0-9.]/g, '')) || 0,
                                    from: celeb?.displayName || formatAddress(user.address),
                                  };
                                  localStorage.setItem('copiedBet', JSON.stringify(betData));
                                  window.location.href = '/calculator?copied=true';
                                }}
                                className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-xs font-semibold text-white flex items-center gap-1 transition-all"
                              >
                                <TrendingUp className="w-3 h-3" />
                                Invest
                              </button>
                            </div>
                            <div className="text-sm font-medium truncate">{user.recentPrediction.market}</div>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="text-xs text-gray-500 text-center italic">No predictions yet</div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Refresh Button */}
          {!isLoading && (
            <div className="text-center mt-12">
              <button
                onClick={() => refetch()}
                className="glass px-8 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
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
