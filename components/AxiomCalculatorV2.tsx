"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, AlertCircle, PieChart } from "lucide-react";
import {
  fetchBitcoinMarketPriceCached,
  fetchEthereumMarketPriceCached,
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

interface PortfolioResult {
  market1: KellyResult;
  market2: KellyResult;
  totalAllocation: number;
  recommendation: string;
}

export default function AxiomCalculatorV2() {
  // Fetch BOTH market prices from Polymarket
  const { data: btcMarketData, isLoading: btcLoading } = useQuery<PolymarketPrice>({
    queryKey: ['polymarket-btc'],
    queryFn: fetchBitcoinMarketPriceCached,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: ethMarketData, isLoading: ethLoading } = useQuery<PolymarketPrice>({
    queryKey: ['polymarket-eth'],
    queryFn: fetchEthereumMarketPriceCached,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Market 1: Bitcoin > $100k (Live from Polymarket)
  const [market1Probability, setMarket1Probability] = useState<string>("70");
  
  // Market 2: Ethereum > $4k (Now ALSO live from Polymarket!)
  const [market2Probability, setMarket2Probability] = useState<string>("65");
  
  // Shared bankroll
  const [bankroll, setBankroll] = useState<string>("1000");

  // Portfolio calculation result
  const [portfolioResult, setPortfolioResult] = useState<PortfolioResult | null>(null);

  // Calculate portfolio allocation
  useEffect(() => {
    if (!btcMarketData || !ethMarketData) return;

    const market1Prob = percentToDecimal(parseFloat(market1Probability) || 0);
    const market2Prob = percentToDecimal(parseFloat(market2Probability) || 0);
    const bankrollNum = parseFloat(bankroll) || 0;

    if (bankrollNum > 0) {
      // Calculate Kelly for Market 1 (Bitcoin)
      const kelly1 = calculateKelly({
        userProbability: market1Prob,
        marketPrice: btcMarketData.price,
        bankroll: bankrollNum,
      });

      // Calculate Kelly for Market 2 (Ethereum)
      const kelly2 = calculateKelly({
        userProbability: market2Prob,
        marketPrice: ethMarketData.price,
        bankroll: bankrollNum,
      });

      // Portfolio math: if both have edge, allocate proportionally
      // Kelly allows independent bets since they're uncorrelated events
      const totalFraction = kelly1.optimalFraction + kelly2.optimalFraction;
      
      let adjustedKelly1 = kelly1;
      let adjustedKelly2 = kelly2;
      let recommendation = "";

      if (totalFraction > 1) {
        // Scale down if total exceeds 100% (conservative approach)
        const scaleFactor = 1 / totalFraction;
        adjustedKelly1 = {
          ...kelly1,
          optimalFraction: kelly1.optimalFraction * scaleFactor,
          optimalBetSize: kelly1.optimalBetSize * scaleFactor,
        };
        adjustedKelly2 = {
          ...kelly2,
          optimalFraction: kelly2.optimalFraction * scaleFactor,
          optimalBetSize: kelly2.optimalBetSize * scaleFactor,
        };
        recommendation = "🔥 STRONG PORTFOLIO: Both bets have edge! Scaled to 100% allocation for safety.";
      } else if (kelly1.hasEdge && kelly2.hasEdge) {
        recommendation = `💪 DUAL EDGE: Allocate ${formatPercent(kelly1.optimalFraction)} to BTC and ${formatPercent(kelly2.optimalFraction)} to ETH.`;
      } else if (kelly1.hasEdge) {
        recommendation = "✅ BTC ONLY: Only Bitcoin shows positive edge. Skip Ethereum.";
      } else if (kelly2.hasEdge) {
        recommendation = "✅ ETH ONLY: Only Ethereum shows positive edge. Skip Bitcoin.";
      } else {
        recommendation = "⚠️ NO EDGE: Neither market shows positive edge. Do not bet.";
      }

      setPortfolioResult({
        market1: adjustedKelly1,
        market2: adjustedKelly2,
        totalAllocation: adjustedKelly1.optimalBetSize + adjustedKelly2.optimalBetSize,
        recommendation,
      });
    } else {
      setPortfolioResult(null);
    }
  }, [market1Probability, market2Probability, bankroll, btcMarketData, ethMarketData]);

  const btcPriceStatus = btcMarketData ? getPriceSourceStatus(btcMarketData) : null;
  const ethPriceStatus = ethMarketData ? getPriceSourceStatus(ethMarketData) : null;

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <PieChart className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Portfolio Mode</h2>
          <p className="text-sm text-gray-400">Optimize allocation across multiple markets</p>
        </div>
      </div>

      {/* Bankroll Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Total Bankroll ($)
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
      </div>

      {/* Two Markets Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Market 1: Bitcoin (Live) */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Market 1: BTC {">"} $100k</h3>
            <span className="text-xs text-green-400">🟢</span>
          </div>

          {btcLoading && <div className="text-sm text-gray-400">Loading...</div>}
          {btcMarketData && (
            <div className="mb-3">
              <div className="text-sm text-gray-400">Market Price (%)</div>
              <div className="text-2xl font-bold">{formatMarketPrice(btcMarketData)}</div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              My Probability (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={market1Probability}
              onChange={(e) => setMarket1Probability(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="70"
            />
          </div>
        </div>

        {/* Market 2: Ethereum (Live) */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Market 2: ETH {">"} $4k</h3>
            <span className="text-xs text-green-400">🟢</span>
          </div>

          {ethLoading && <div className="text-sm text-gray-400">Loading...</div>}
          {ethMarketData && (
            <div className="mb-3">
              <div className="text-sm text-gray-400">Market Price (%)</div>
              <div className="text-2xl font-bold">{formatMarketPrice(ethMarketData)}</div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              My Probability (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={market2Probability}
              onChange={(e) => setMarket2Probability(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="65"
            />
          </div>
        </div>
      </div>

      {/* Portfolio Results */}
      {portfolioResult && (
        <div className="space-y-4">
          {/* Total Allocation */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border-2 border-purple-500/30">
            <div className="text-sm text-gray-400 mb-1">Total Portfolio Allocation</div>
            <div className="text-5xl font-bold text-purple-400">
              {formatCurrency(portfolioResult.totalAllocation)}
            </div>
            <div className="mt-2 text-sm text-gray-300">
              {formatPercent((portfolioResult.market1.optimalFraction + portfolioResult.market2.optimalFraction))} of bankroll
            </div>
          </div>

          {/* Individual Allocations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* BTC Allocation */}
            <div className={`rounded-lg p-4 border-2 ${
              portfolioResult.market1.hasEdge
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-gray-500/10 border-gray-500/30'
            }`}>
              <div className="text-xs text-gray-400">Bitcoin Allocation</div>
              <div className={`text-2xl font-bold ${
                portfolioResult.market1.hasEdge ? 'text-green-400' : 'text-gray-500'
              }`}>
                {portfolioResult.market1.hasEdge ? formatCurrency(portfolioResult.market1.optimalBetSize) : "$0"}
              </div>
              {portfolioResult.market1.hasEdge && (
                <div className="text-xs text-gray-300 mt-1">
                  Edge: +{formatPercent(portfolioResult.market1.edge)}
                </div>
              )}
            </div>

            {/* ETH Allocation */}
            <div className={`rounded-lg p-4 border-2 ${
              portfolioResult.market2.hasEdge
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-gray-500/10 border-gray-500/30'
            }`}>
              <div className="text-xs text-gray-400">Ethereum Allocation</div>
              <div className={`text-2xl font-bold ${
                portfolioResult.market2.hasEdge ? 'text-blue-400' : 'text-gray-500'
              }`}>
                {portfolioResult.market2.hasEdge ? formatCurrency(portfolioResult.market2.optimalBetSize) : "$0"}
              </div>
              {portfolioResult.market2.hasEdge && (
                <div className="text-xs text-gray-300 mt-1">
                  Edge: +{formatPercent(portfolioResult.market2.edge)}
                </div>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Portfolio Recommendation</div>
            <div className="text-white">{portfolioResult.recommendation}</div>
          </div>

          {/* Mint Card - Only show if at least one bet has edge */}
          {(portfolioResult.market1.hasEdge || portfolioResult.market2.hasEdge) && (
            <MintCard
              prediction={{
                market: `Portfolio: BTC ${portfolioResult.market1.hasEdge ? '✓' : '✗'} + ETH ${portfolioResult.market2.hasEdge ? '✓' : '✗'}`,
                userProbability: parseFloat(market1Probability),
                marketPrice: btcMarketData?.pricePercent || 65,
                optimalBetSize: portfolioResult.totalAllocation,
                edge: ((portfolioResult.market1.edge + portfolioResult.market2.edge) / 2) * 100,
              }}
            />
          )}
        </div>
      )}

      {/* Help Text */}
      {!portfolioResult && (
        <div className="text-center text-gray-500 text-sm py-8">
          Enter your probabilities and bankroll to optimize your portfolio allocation
        </div>
      )}
    </div>
  );
}

