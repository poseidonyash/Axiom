"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import AxiomCalculatorV2 from "@/components/AxiomCalculatorV2";
import OracleFeedV2 from "@/components/OracleFeedV2";
import { Brain, Target, Zap } from "lucide-react";

// Wrapper component to handle Suspense
function CalculatorContent() {
  // Removed useSearchParams - not needed for static generation

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Find Your{" "}
              <span className="gradient-text">True Edge</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 mb-6">
              Mathematical precision meets prediction markets
            </p>
            
            {/* Description */}
            <p className="text-gray-500 max-w-2xl mx-auto mb-8">
              Axiom calculates your optimal position size using the Kelly Criterion,
              fetches live Polymarket data, and lets you mint your predictions as NFTs
              on Base to prove you knew it before it happened.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">Kelly Criterion Math</span>
              </div>
              
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Live Polymarket Data</span>
              </div>
              
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Mint on Base</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calculator - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <AxiomCalculatorV2 />
            </div>

            {/* Oracle Feed - Takes up 1 column */}
            <div className="lg:col-span-1">
              <OracleFeedV2 />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-16 glass-strong rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Analyze the Market</h3>
                <p className="text-gray-400 text-sm">
                  We fetch live prices from Polymarket's CLOB API to get real-time market data for Bitcoin predictions.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Calculate Your Edge</h3>
                <p className="text-gray-400 text-sm">
                  Enter your probability estimate and bankroll. The Kelly Criterion calculates your optimal bet size mathematically.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-400">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Mint Your Proof</h3>
                <p className="text-gray-400 text-sm">
                  Mint your prediction as an NFT on Base Sepolia. Immutable proof that you calculated the edge before it played out.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 mb-3">Built with</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="glass px-3 py-1 rounded">Next.js 14</span>
              <span className="glass px-3 py-1 rounded">OnchainKit</span>
              <span className="glass px-3 py-1 rounded">Base Sepolia</span>
              <span className="glass px-3 py-1 rounded">Polymarket CLOB</span>
              <span className="glass px-3 py-1 rounded">wagmi + viem</span>
              <span className="glass px-3 py-1 rounded">Kelly Criterion</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Axiom: Proof of Intelligence Engine
            </p>
            <p className="text-gray-600 text-xs mt-2">
              MBC 2025 Hackathon · Base Track + Polymarket Bounty
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-400">Loading Axiom...</p>
        </div>
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}


