"use client";

import { useReadContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { ArrowLeft, TrendingUp, Clock, Target, ExternalLink, Share2, Copy, Check, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";
import { getCelebProfile } from "@/utils/celebProfiles";
import { getMockPredictionsForAddress } from "@/utils/mockPredictions";

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

export default function UserProfilePage({ params }: { params: { address: string } }) {
  const userAddress = params.address;
  const [copied, setCopied] = useState(false);
  const [copiedBet, setCopiedBet] = useState<string | null>(null);
  const celeb = getCelebProfile(userAddress);
  const router = useRouter();

  // Read all predictions from the blockchain
  const { data: allPredictions, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AXIOM_V2_READ_ABI,
    functionName: "getRecentPredictions",
    args: [BigInt(100)],
    chainId: baseSepolia.id,
  });

  // Get mock predictions for this user (if celebrity)
  const mockPredictions = getMockPredictionsForAddress(userAddress);
  
  // Filter real predictions for this user
  const realPredictions = allPredictions?.filter(
    (pred: OnchainPrediction) => pred.predictor.toLowerCase() === userAddress.toLowerCase()
  ) || [];
  
  // Combine real and mock predictions
  const userPredictions = [...mockPredictions, ...realPredictions].sort((a, b) => {
    // Sort by timestamp, newest first
    return Number(b.timestamp) - Number(a.timestamp);
  });

  // Calculate user stats
  const stats = userPredictions.length > 0 ? {
    totalPredictions: userPredictions.length,
    totalEdge: userPredictions.reduce((sum, p) => sum + Number(p.edge) / 100, 0),
    avgEdge: userPredictions.reduce((sum, p) => sum + Number(p.edge) / 100, 0) / userPredictions.length,
    totalStaked: userPredictions.reduce((sum, p) => {
      const amount = parseFloat(p.betSize.replace(/[^0-9.]/g, '')) || 0;
      return sum + amount;
    }, 0),
    bestEdge: Math.max(...userPredictions.map(p => Number(p.edge) / 100)),
  } : null;

  // Helper functions
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatEdge = (edgeBasisPoints: bigint): string => {
    const edgePercent = Number(edgeBasisPoints) / 100;
    return `+${edgePercent.toFixed(1)}%`;
  };

  const formatTimestamp = (timestamp: bigint): string => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "recently";
    }
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
    const index = parseInt(address.slice(2, 4), 16) % colors.length;
    return colors[index];
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Profile link copied to clipboard!");
  };

  const copyBet = (pred: OnchainPrediction, index: number) => {
    // Save prediction data to localStorage
    const betData = {
      market: pred.market,
      edge: Number(pred.edge) / 100, // Convert basis points to percentage
      betSize: parseFloat(pred.betSize.replace(/[^0-9.]/g, '')) || 0,
      from: celeb?.displayName || formatAddress(userAddress),
    };
    
    localStorage.setItem('copiedBet', JSON.stringify(betData));
    
    // Show copied feedback
    setCopiedBet(`bet-${index}`);
    setTimeout(() => setCopiedBet(null), 2000);
    
    // Navigate to calculator after short delay
    setTimeout(() => {
      router.push('/calculator?copied=true');
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent mx-auto mb-4" />
              <div className="text-gray-400">Loading user profile...</div>
            </div>
          )}

          {!isLoading && (
            <>
              {/* User Header */}
              <div className="glass-strong rounded-2xl p-8 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar / Image */}
                  {celeb && celeb.imageUrl ? (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden relative shrink-0 border-2 border-purple-500/30">
                      <Image
                        src={celeb.imageUrl}
                        alt={celeb.displayName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {celeb.verified && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${getAvatarColor(userAddress)} flex items-center justify-center text-white font-bold text-4xl relative shrink-0`}>
                      {userAddress.slice(2, 4).toUpperCase()}
                      {userPredictions.length > 5 && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm">
                          ⭐
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <h1 className="text-3xl font-bold">
                        {celeb ? celeb.displayName : formatAddress(userAddress)}
                      </h1>
                      {celeb?.verified && (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    {celeb && celeb.bio && (
                      <p className="text-gray-400 mb-3">{celeb.bio}</p>
                    )}
                    {celeb && celeb.twitter && (
                      <a
                        href={`https://twitter.com/${celeb.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 mb-3 inline-block"
                      >
                        {celeb.twitter}
                      </a>
                    )}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                      <button
                        onClick={copyAddress}
                        className="glass px-3 py-1 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Address"}
                      </button>
                      <button
                        onClick={shareProfile}
                        className="glass px-3 py-1 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Profile
                      </button>
                      <a
                        href={`https://sepolia.basescan.org/address/${userAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass px-3 py-1 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on BaseScan
                      </a>
                    </div>
                    
                    {stats && (
                      <div className="text-sm text-gray-400">
                        Predictor on Axiom · {stats.totalPredictions} prediction{stats.totalPredictions !== 1 ? 's' : ''} minted
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stats.totalPredictions}</div>
                      <div className="text-xs text-gray-400">Predictions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">+{stats.avgEdge.toFixed(1)}%</div>
                      <div className="text-xs text-gray-400">Avg Edge</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">+{stats.bestEdge.toFixed(1)}%</div>
                      <div className="text-xs text-gray-400">Best Edge</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">${stats.totalStaked.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Total Staked</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Predictions Section */}
              <div className="glass-strong rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  All Predictions
                </h2>

                {userPredictions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No predictions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPredictions.map((pred: OnchainPrediction, idx: number) => (
                      <div
                        key={idx}
                        className="glass rounded-xl p-5 hover:bg-white/10 transition-all group"
                      >
                        {/* Market Name & Invest Button */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="font-semibold text-lg flex-1">
                            {pred.market}
                          </div>
                          <button
                            onClick={() => copyBet(pred, idx)}
                            className={`shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                              copiedBet === `bet-${idx}`
                                ? 'bg-green-600 text-white'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                            }`}
                          >
                            {copiedBet === `bet-${idx}` ? (
                              <>
                                <Check className="w-4 h-4" />
                                Invested!
                              </>
                            ) : (
                              <>
                                <TrendingUp className="w-4 h-4" />
                                Invest
                              </>
                            )}
                          </button>
                        </div>

                        {/* Prediction Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center justify-between md:justify-start gap-2">
                            <span className="text-sm text-gray-400">Edge:</span>
                            <span className="font-bold text-green-400 flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {formatEdge(pred.edge)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-start gap-2">
                            <span className="text-sm text-gray-400">Position:</span>
                            <span className="font-medium text-purple-400">{pred.betSize}</span>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-start gap-2">
                            <span className="text-sm text-gray-400">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {formatTimestamp(pred.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* On-chain Badge */}
                        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          Verified on Base Sepolia
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

