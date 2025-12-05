"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, AlertCircle } from "lucide-react";
import {
  fetchBitcoinMarketPriceCached,
  getPriceSourceStatus,
  formatMarketPrice,
  type PolymarketPrice,
} from "@/utils/polymarketApi";
import {
  calculateKelly,
  percentToDecimal,
  formatCurrency,
  formatPercent,
  type KellyResult,
} from "@/utils/kellyMath";
import MintCard from "./MintCard";

export default function AxiomCalculator() {
  // Fetch Polymarket price
  const { data: marketData, isLoading, error } = useQuery<PolymarketPrice>({
    queryKey: ['polymarket-btc'],
    queryFn: fetchBitcoinMarketPriceCached,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // User inputs
  const [userProbabilityPercent, setUserProbabilityPercent] = useState<string>("70");
  const [bankroll, setBankroll] = useState<string>("1000");

  // Kelly calculation result
  const [kellyResult, setKellyResult] = useState<KellyResult | null>(null);

  // Calculate Kelly whenever inputs change
  useEffect(() => {
    if (!marketData) return;

    const userProb = percentToDecimal(parseFloat(userProbabilityPercent) || 0);
    const bankrollNum = parseFloat(bankroll) || 0;

    if (userProb > 0 && bankrollNum > 0) {
      const result = calculateKelly({
        userProbability: userProb,
        marketPrice: marketData.price,
        bankroll: bankrollNum,
      });
      setKellyResult(result);
    } else {
      setKellyResult(null);
    }
  }, [userProbabilityPercent, bankroll, marketData]);

  const priceStatus = marketData ? getPriceSourceStatus(marketData) : null;

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Find Your Edge</h2>
          <p className="text-sm text-gray-400">Calculate optimal position size</p>
        </div>
      </div>

      {/* Market Price Display */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Market Price</label>
          {priceStatus && (
            <span className={`text-xs flex items-center gap-1 ${
              priceStatus.color === 'green' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {priceStatus.text}
              <span className="pulse-ring inline-block w-2 h-2 rounded-full bg-current" />
            </span>
          )}
        </div>
        
        {isLoading && (
          <div className="text-2xl font-bold text-gray-400">Loading...</div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Using fallback price</span>
          </div>
        )}
        
        {marketData && (
          <div>
            <div className="text-3xl font-bold">{formatMarketPrice(marketData)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {marketData.market} · Last update: {marketData.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* User Inputs */}
      <div className="space-y-4">
        {/* My Probability */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            My Probability (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={userProbabilityPercent}
            onChange={(e) => setUserProbabilityPercent(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="70"
          />
          <p className="text-xs text-gray-500 mt-1">
            What's YOUR probability that Bitcoin hits $100k?
          </p>
        </div>

        {/* Bankroll */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Bankroll ($)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={bankroll}
            onChange={(e) => setBankroll(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="1000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total capital you're willing to allocate
          </p>
        </div>
      </div>

      {/* Kelly Result */}
      {kellyResult && (
        <div className="space-y-4">
          {/* Optimal Bet Size */}
          <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
            kellyResult.hasEdge 
              ? 'from-green-500/10 to-emerald-500/10 border-green-500/30' 
              : 'from-red-500/10 to-rose-500/10 border-red-500/30'
          }`}>
            <div className="text-sm text-gray-400 mb-1">Optimal Bet Size</div>
            {kellyResult.hasEdge ? (
              <div className="text-5xl font-bold edge-positive">
                {formatCurrency(kellyResult.optimalBetSize)}
              </div>
            ) : (
              <div className="text-4xl font-bold edge-negative">
                Don't Bet
              </div>
            )}
            
            {kellyResult.hasEdge && (
              <div className="mt-2 text-sm text-gray-300">
                {formatPercent(kellyResult.optimalFraction)} of bankroll · 
                +{formatPercent(kellyResult.edge)} edge
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Recommendation</div>
            <div className="text-white">{kellyResult.recommendation}</div>
          </div>

          {/* Expected Value */}
          {kellyResult.hasEdge && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-gray-400">Expected Value</div>
                <div className="text-lg font-semibold text-green-400">
                  {formatPercent(kellyResult.expectedValue, 2)}
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-gray-400">Kelly Fraction</div>
                <div className="text-lg font-semibold text-purple-400">
                  {formatPercent(kellyResult.optimalFraction)}
                </div>
              </div>
            </div>
          )}

          {/* Mint Card - Only show if there's an edge */}
          {kellyResult.hasEdge && (
            <MintCard
              prediction={{
                market: marketData?.market || "Bitcoin > $100k",
                userProbability: parseFloat(userProbabilityPercent),
                marketPrice: (marketData?.pricePercent || 65),
                optimalBetSize: kellyResult.optimalBetSize,
                edge: kellyResult.edge * 100,
              }}
            />
          )}
        </div>
      )}

      {/* Help Text */}
      {!kellyResult && (
        <div className="text-center text-gray-500 text-sm py-8">
          Enter your probability and bankroll to calculate your optimal bet size
        </div>
      )}
    </div>
  );
}



