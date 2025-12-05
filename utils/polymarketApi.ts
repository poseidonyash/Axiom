/**
 * Polymarket CLOB API Integration
 * 
 * Fetches live pricing data from the Polymarket CLOB (Central Limit Order Book) API
 * to get real-time market prices for prediction markets.
 * 
 * IMPORTANT: If you encounter CORS errors during development:
 * - The fallback value of 0.65 will be used
 * - This represents the Bitcoin > $100k market price
 * - For production, you'd want to proxy this through your backend
 */

export interface PolymarketPrice {
  price: number;        // Market price as decimal (0.0 to 1.0)
  pricePercent: number; // Market price as percentage (0 to 100)
  lastUpdate: Date;     // When this data was fetched
  market: string;       // Market description
  source: 'live' | 'fallback'; // Whether this is live or fallback data
}

// Bitcoin > $100k market token ID
const BTC_100K_TOKEN_ID = "21742633143463906290569050155826241533067272736897614950488156847949938836455";

// Fallback price if API fails (represents typical BTC > $100k price)
const FALLBACK_PRICE = 0.65;

// Base URL for Polymarket CLOB API
const POLYMARKET_API_BASE = "https://clob.polymarket.com";

/**
 * Fetch market price by market key
 * NOW USING SERVER-SIDE PROXY - NO MORE CORS ERRORS!
 */
async function fetchMarketByKey(marketKey: string, marketName: string, fallbackPrice: number): Promise<PolymarketPrice> {
  try {
    // Use our Next.js API proxy route (server-side fetch, no CORS!)
    const url = `/api/proxy?market=${marketKey}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      // Timeout handled by the proxy
    });
    
    if (!response.ok) {
      console.warn(`Proxy API returned status ${response.status}`);
      return getFallbackPriceCustom(marketName, fallbackPrice);
    }
    
    const data = await response.json();
    
    // Check if proxy returned fallback
    if (data.fallback) {
      console.warn(`Proxy using fallback price for ${marketKey}`);
      return getFallbackPriceCustom(marketName, fallbackPrice);
    }
    
    // The API returns price as a string (e.g., "0.65")
    const price = parseFloat(data.price);
    
    if (isNaN(price) || price < 0 || price > 1) {
      console.warn('Invalid price from proxy:', data.price);
      return getFallbackPriceCustom(marketName, fallbackPrice);
    }
    
    return {
      price,
      pricePercent: price * 100,
      lastUpdate: new Date(),
      market: marketName,
      source: data.source || 'live',
    };
    
  } catch (error) {
    // Network error with our proxy
    console.warn(`Proxy fetch failed for ${marketKey} (using fallback):`, error);
    return getFallbackPriceCustom(marketName, fallbackPrice);
  }
}

/**
 * Fetch the current price for Bitcoin > $100k market
 */
export async function fetchBitcoinMarketPrice(): Promise<PolymarketPrice> {
  return fetchMarketByKey('BTC_100K', 'Bitcoin > $100k', FALLBACK_PRICE);
}

/**
 * Fetch the current price for Ethereum > $4k market
 */
export async function fetchEthereumMarketPrice(): Promise<PolymarketPrice> {
  return fetchMarketByKey('ETH_4K', 'Ethereum > $4k', 0.55);
}

/**
 * Return fallback price when API is unavailable
 * 
 * TROUBLESHOOTING: If the Polymarket API fails due to CORS:
 * - This is normal in browser-based development
 * - The fallback price of 0.65 (65%) is used
 * - This represents a realistic price for "Bitcoin > $100k"
 * - For the hackathon demo, this is perfectly acceptable
 */
function getFallbackPrice(): PolymarketPrice {
  return getFallbackPriceCustom("Bitcoin > $100k", FALLBACK_PRICE);
}

function getFallbackPriceCustom(marketName: string, fallbackPrice: number): PolymarketPrice {
  return {
    price: fallbackPrice,
    pricePercent: fallbackPrice * 100,
    lastUpdate: new Date(),
    market: marketName,
    source: 'fallback',
  };
}

/**
 * Fetch price with caching to avoid rate limits
 */
let cachedBtcPrice: PolymarketPrice | null = null;
let lastBtcFetchTime = 0;
let cachedEthPrice: PolymarketPrice | null = null;
let lastEthFetchTime = 0;
const CACHE_DURATION_MS = 10000; // 10 seconds

export async function fetchBitcoinMarketPriceCached(): Promise<PolymarketPrice> {
  const now = Date.now();
  
  // Return cached price if it's still fresh
  if (cachedBtcPrice && (now - lastBtcFetchTime) < CACHE_DURATION_MS) {
    return cachedBtcPrice;
  }
  
  // Fetch new price
  const price = await fetchBitcoinMarketPrice();
  
  // Update cache
  cachedBtcPrice = price;
  lastBtcFetchTime = now;
  
  return price;
}

export async function fetchEthereumMarketPriceCached(): Promise<PolymarketPrice> {
  const now = Date.now();
  
  // Return cached price if it's still fresh
  if (cachedEthPrice && (now - lastEthFetchTime) < CACHE_DURATION_MS) {
    return cachedEthPrice;
  }
  
  // Fetch new price
  const price = await fetchEthereumMarketPrice();
  
  // Update cache
  cachedEthPrice = price;
  lastEthFetchTime = now;
  
  return price;
}

/**
 * Format price for display
 */
export function formatMarketPrice(price: PolymarketPrice): string {
  return `${price.pricePercent.toFixed(1)}%`;
}

/**
 * Check if price data is stale (older than 1 minute)
 */
export function isPriceStale(price: PolymarketPrice): boolean {
  const ageMs = Date.now() - price.lastUpdate.getTime();
  return ageMs > 60000; // 1 minute
}

/**
 * Get a human-readable status for the price source
 */
export function getPriceSourceStatus(price: PolymarketPrice): {
  text: string;
  color: 'green' | 'yellow' | 'gray';
} {
  if (price.source === 'live') {
    return {
      text: '🟢 Live from Polymarket',
      color: 'green',
    };
  } else {
    return {
      text: '🟡 Using Fallback Price',
      color: 'yellow',
    };
  }
}

/**
 * Parse a custom token ID (for future expansion)
 */
export async function fetchMarketPrice(tokenId: string): Promise<PolymarketPrice> {
  try {
    const url = `${POLYMARKET_API_BASE}/price?token_id=${tokenId}&side=buy`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    const price = parseFloat(data.price);
    
    if (isNaN(price) || price < 0 || price > 1) {
      throw new Error('Invalid price');
    }
    
    return {
      price,
      pricePercent: price * 100,
      lastUpdate: new Date(),
      market: "Custom Market",
      source: 'live',
    };
    
  } catch (error) {
    console.warn('Failed to fetch custom market price:', error);
    throw error;
  }
}


