/**
 * Kelly Criterion Math Engine for Binary Options
 * 
 * The Kelly Criterion determines the optimal bet size to maximize
 * long-term growth when you have an edge in a prediction market.
 * 
 * Formula: f* = (p - C) / (1 - C)
 * Where:
 *   p = Your probability estimate (0.0 to 1.0)
 *   C = Market price/probability (0.0 to 1.0)
 *   f* = Fraction of bankroll to bet
 */

export interface KellyInput {
  userProbability: number; // Your estimate (0.0 to 1.0)
  marketPrice: number;     // Current market price (0.0 to 1.0)
  bankroll: number;        // Total capital available
}

export interface KellyResult {
  optimalFraction: number;  // Kelly fraction (0.0 to 1.0)
  optimalBetSize: number;   // Dollar amount to bet
  expectedValue: number;    // Expected profit per dollar
  hasEdge: boolean;         // Whether you have a positive edge
  edge: number;             // Raw edge (p - C)
  recommendation: string;   // Human-readable advice
}

/**
 * Calculate the Kelly Criterion optimal bet size
 */
export function calculateKelly(input: KellyInput): KellyResult {
  const { userProbability, marketPrice, bankroll } = input;
  
  // Validate inputs
  if (!isValidProbability(userProbability) || !isValidProbability(marketPrice)) {
    return getNoEdgeResult(bankroll);
  }
  
  if (bankroll <= 0) {
    return getNoEdgeResult(bankroll);
  }
  
  // Calculate edge
  const edge = userProbability - marketPrice;
  
  // No edge or negative edge - don't bet
  if (edge <= 0) {
    return {
      optimalFraction: 0,
      optimalBetSize: 0,
      expectedValue: edge,
      hasEdge: false,
      edge,
      recommendation: "No edge detected. Do not bet.",
    };
  }
  
  // Calculate Kelly fraction
  // f* = (p - C) / (1 - C)
  const denominator = 1 - marketPrice;
  
  // Edge case: if market price is 1.0, can't calculate
  if (denominator <= 0) {
    return getNoEdgeResult(bankroll);
  }
  
  let kellyFraction = edge / denominator;
  
  // Cap at 100% (full bankroll)
  if (kellyFraction > 1) {
    kellyFraction = 1;
  }
  
  // If Kelly suggests negative bet, return no edge
  if (kellyFraction < 0) {
    return getNoEdgeResult(bankroll);
  }
  
  // Calculate optimal bet size
  const optimalBetSize = kellyFraction * bankroll;
  
  // Calculate expected value
  // EV = p * (1/C - 1) - (1-p)
  const winMultiplier = (1 / marketPrice) - 1;
  const expectedValue = userProbability * winMultiplier - (1 - userProbability);
  
  // Generate recommendation
  const recommendation = generateRecommendation(kellyFraction, edge);
  
  return {
    optimalFraction: kellyFraction,
    optimalBetSize,
    expectedValue,
    hasEdge: true,
    edge,
    recommendation,
  };
}

/**
 * Convert percentage (0-100) to decimal (0.0-1.0)
 */
export function percentToDecimal(percent: number): number {
  return percent / 100;
}

/**
 * Convert decimal (0.0-1.0) to percentage (0-100)
 */
export function decimalToPercent(decimal: number): number {
  return decimal * 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(decimal: number, decimals: number = 1): string {
  return `${(decimal * 100).toFixed(decimals)}%`;
}

/**
 * Validate that a number is a valid probability (0.0 to 1.0)
 */
function isValidProbability(value: number): boolean {
  return typeof value === 'number' && value >= 0 && value <= 1 && !isNaN(value);
}

/**
 * Return a "no edge" result
 */
function getNoEdgeResult(bankroll: number): KellyResult {
  return {
    optimalFraction: 0,
    optimalBetSize: 0,
    expectedValue: 0,
    hasEdge: false,
    edge: 0,
    recommendation: "No edge detected. Do not bet.",
  };
}

/**
 * Generate a human-readable recommendation
 */
function generateRecommendation(kellyFraction: number, edge: number): string {
  const edgePercent = (edge * 100).toFixed(1);
  
  if (kellyFraction >= 0.5) {
    return `🔥 STRONG EDGE (+${edgePercent}%): Large position recommended. Consider half-Kelly for safety.`;
  } else if (kellyFraction >= 0.25) {
    return `💪 GOOD EDGE (+${edgePercent}%): Moderate position recommended.`;
  } else if (kellyFraction >= 0.10) {
    return `✅ SMALL EDGE (+${edgePercent}%): Small position recommended.`;
  } else if (kellyFraction > 0) {
    return `⚠️ TINY EDGE (+${edgePercent}%): Very small position. Consider skipping.`;
  } else {
    return "No edge detected. Do not bet.";
  }
}

/**
 * Calculate Half-Kelly (more conservative)
 */
export function calculateHalfKelly(input: KellyInput): KellyResult {
  const fullKelly = calculateKelly(input);
  
  return {
    ...fullKelly,
    optimalFraction: fullKelly.optimalFraction / 2,
    optimalBetSize: fullKelly.optimalBetSize / 2,
    recommendation: fullKelly.hasEdge 
      ? `Half-Kelly (Conservative): ${fullKelly.recommendation}`
      : fullKelly.recommendation,
  };
}

/**
 * Calculate Quarter-Kelly (very conservative)
 */
export function calculateQuarterKelly(input: KellyInput): KellyResult {
  const fullKelly = calculateKelly(input);
  
  return {
    ...fullKelly,
    optimalFraction: fullKelly.optimalFraction / 4,
    optimalBetSize: fullKelly.optimalBetSize / 4,
    recommendation: fullKelly.hasEdge 
      ? `Quarter-Kelly (Very Conservative): ${fullKelly.recommendation}`
      : fullKelly.recommendation,
  };
}





