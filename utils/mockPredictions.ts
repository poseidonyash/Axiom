/**
 * Mock Predictions for Celebrity Profiles
 * Used for demo purposes to show realistic prediction data
 */

interface MockPrediction {
  market: string;
  betSize: string;
  predictor: string;
  timestamp: bigint;
  edge: bigint;
}

// Generate realistic mock predictions for each celebrity
export const MOCK_PREDICTIONS: MockPrediction[] = [
  // LeBron James predictions
  {
    market: "Lakers to win Championship 2025",
    betSize: "$25,000",
    predictor: "0x1111111111111111111111111111111111111111",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2),
    edge: BigInt(1850), // 18.5%
  },
  {
    market: "NBA Finals MVP goes to Lakers",
    betSize: "$15,000",
    predictor: "0x1111111111111111111111111111111111111111",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 5),
    edge: BigInt(1420),
  },
  {
    market: "Bitcoin > $100k by Q1 2025",
    betSize: "$50,000",
    predictor: "0x1111111111111111111111111111111111111111",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 10),
    edge: BigInt(950),
  },

  // Donald Trump predictions
  {
    market: "Trump wins 2024 Election",
    betSize: "$100,000",
    predictor: "0x2222222222222222222222222222222222222222",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 1),
    edge: BigInt(2250),
  },
  {
    market: "Republicans win House majority",
    betSize: "$75,000",
    predictor: "0x2222222222222222222222222222222222222222",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 3),
    edge: BigInt(1680),
  },
  {
    market: "Bitcoin > $150k by 2025",
    betSize: "$200,000",
    predictor: "0x2222222222222222222222222222222222222222",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 7),
    edge: BigInt(1150),
  },
  {
    market: "Stock Market hits new ATH",
    betSize: "$150,000",
    predictor: "0x2222222222222222222222222222222222222222",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 15),
    edge: BigInt(875),
  },

  // Michael Burry predictions
  {
    market: "S&P 500 drops below 4000",
    betSize: "$500,000",
    predictor: "0x3333333333333333333333333333333333333333",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 1),
    edge: BigInt(2750),
  },
  {
    market: "Housing market crashes 2025",
    betSize: "$750,000",
    predictor: "0x3333333333333333333333333333333333333333",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 4),
    edge: BigInt(3200),
  },
  {
    market: "Bank failures increase 2025",
    betSize: "$300,000",
    predictor: "0x3333333333333333333333333333333333333333",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 6),
    edge: BigInt(2450),
  },
  {
    market: "Gold surpasses $3000/oz",
    betSize: "$400,000",
    predictor: "0x3333333333333333333333333333333333333333",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 12),
    edge: BigInt(1890),
  },
  {
    market: "Tesla stock below $100",
    betSize: "$250,000",
    predictor: "0x3333333333333333333333333333333333333333",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 20),
    edge: BigInt(2100),
  },

  // Elon Musk predictions
  {
    market: "Tesla FSD achieves Level 5",
    betSize: "$1,000,000",
    predictor: "0x4444444444444444444444444444444444444444",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2),
    edge: BigInt(1580),
  },
  {
    market: "Starship lands on Mars 2026",
    betSize: "$500,000",
    predictor: "0x4444444444444444444444444444444444444444",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 5),
    edge: BigInt(2950),
  },
  {
    market: "Dogecoin reaches $1",
    betSize: "$250,000",
    predictor: "0x4444444444444444444444444444444444444444",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 8),
    edge: BigInt(1250),
  },
  {
    market: "Twitter rebrands to X successful",
    betSize: "$100,000",
    predictor: "0x4444444444444444444444444444444444444444",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 14),
    edge: BigInt(950),
  },

  // Vitalik Buterin predictions
  {
    market: "Ethereum > $5000 by 2025",
    betSize: "$800,000",
    predictor: "0x5555555555555555555555555555555555555555",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 1),
    edge: BigInt(1950),
  },
  {
    market: "ETH 2.0 staking reaches 50M ETH",
    betSize: "$500,000",
    predictor: "0x5555555555555555555555555555555555555555",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 3),
    edge: BigInt(1450),
  },
  {
    market: "Layer 2 TVL exceeds mainnet",
    betSize: "$300,000",
    predictor: "0x5555555555555555555555555555555555555555",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 9),
    edge: BigInt(2150),
  },
  {
    market: "zkEVM adoption accelerates",
    betSize: "$400,000",
    predictor: "0x5555555555555555555555555555555555555555",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 11),
    edge: BigInt(1750),
  },

  // Warren Buffett predictions
  {
    market: "Berkshire Hathaway outperforms S&P",
    betSize: "$2,000,000",
    predictor: "0x6666666666666666666666666666666666666666",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2),
    edge: BigInt(850),
  },
  {
    market: "Apple stock undervalued",
    betSize: "$1,500,000",
    predictor: "0x6666666666666666666666666666666666666666",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 6),
    edge: BigInt(1120),
  },
  {
    market: "Banking sector recovers 2025",
    betSize: "$1,000,000",
    predictor: "0x6666666666666666666666666666666666666666",
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400 * 13),
    edge: BigInt(975),
  },
];

/**
 * Get mock predictions for a specific address
 */
export function getMockPredictionsForAddress(address: string): MockPrediction[] {
  return MOCK_PREDICTIONS.filter(
    (pred) => pred.predictor.toLowerCase() === address.toLowerCase()
  );
}

/**
 * Get all mock predictions
 */
export function getAllMockPredictions(): MockPrediction[] {
  return MOCK_PREDICTIONS;
}

/**
 * Check if an address has mock predictions
 */
export function hasMockPredictions(address: string): boolean {
  return MOCK_PREDICTIONS.some(
    (pred) => pred.predictor.toLowerCase() === address.toLowerCase()
  );
}



