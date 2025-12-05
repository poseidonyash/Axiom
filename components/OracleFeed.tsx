"use client";

import { Radio, TrendingUp, Clock } from "lucide-react";

// Mock data for the "Oracle Feed" - showing other users' predictions
const mockPredictions = [
  {
    id: 1,
    ens: "vitalik.base.eth",
    avatar: "bg-purple-500",
    market: "BTC > $100k",
    edge: "+12.3%",
    betSize: "$2,500",
    timestamp: "2m ago",
  },
  {
    id: 2,
    ens: "whale.base.eth",
    avatar: "bg-blue-500",
    market: "ETH > $4k",
    edge: "+8.7%",
    betSize: "$5,000",
    timestamp: "5m ago",
  },
  {
    id: 3,
    ens: "degen.base.eth",
    avatar: "bg-green-500",
    market: "BTC > $100k",
    edge: "+15.2%",
    betSize: "$1,200",
    timestamp: "12m ago",
  },
  {
    id: 4,
    ens: "builder.base.eth",
    avatar: "bg-orange-500",
    market: "SOL > $200",
    edge: "+6.4%",
    betSize: "$800",
    timestamp: "18m ago",
  },
  {
    id: 5,
    ens: "analyst.base.eth",
    avatar: "bg-pink-500",
    market: "BTC > $100k",
    edge: "+9.1%",
    betSize: "$3,500",
    timestamp: "25m ago",
  },
  {
    id: 6,
    ens: "trader.base.eth",
    avatar: "bg-indigo-500",
    market: "ETH > $4k",
    edge: "+11.8%",
    betSize: "$1,800",
    timestamp: "32m ago",
  },
];

export default function OracleFeed() {
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
            <p className="text-xs text-gray-400">Live predictions</p>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center gap-1 text-xs text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full pulse-ring" />
          LIVE
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {mockPredictions.map((pred) => (
          <div
            key={pred.id}
            className="glass rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
          >
            {/* User info */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${pred.avatar} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {pred.ens.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{pred.ens}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pred.timestamp}
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
                  {pred.edge}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Position</span>
                <span className="font-medium text-purple-400">{pred.betSize}</span>
              </div>
            </div>

            {/* Mint badge (if they minted) */}
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
          Join the oracle network by minting your predictions
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



