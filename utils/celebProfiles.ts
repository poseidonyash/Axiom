/**
 * Celebrity/Influencer Profile Mapping
 * Maps wallet addresses to celebrity profiles with images
 */

export interface CelebProfile {
  address: string;
  name: string;
  displayName: string;
  bio: string;
  imageUrl: string;
  verified: boolean;
  twitter?: string;
}

// Celebrity profiles - add images later
// Export this so we can show celebrities even with 0 predictions
export const CELEB_PROFILES: Record<string, CelebProfile> = {
  // LeBron James
  "0x1111111111111111111111111111111111111111": {
    address: "0x1111111111111111111111111111111111111111",
    name: "lebron",
    displayName: "LeBron James",
    bio: "NBA Legend · Betting on the future 🏀",
    imageUrl: "/celebs/lebron.jpg",
    verified: true,
    twitter: "@KingJames",
  },
  
  // Donald Trump
  "0x2222222222222222222222222222222222222222": {
    address: "0x2222222222222222222222222222222222222222",
    name: "trump",
    displayName: "Donald Trump",
    bio: "45th President · Making predictions great again 🇺🇸",
    imageUrl: "/celebs/trump.jpg",
    verified: true,
    twitter: "@realDonaldTrump",
  },
  
  // Michael Burry
  "0x3333333333333333333333333333333333333333": {
    address: "0x3333333333333333333333333333333333333333",
    name: "burry",
    displayName: "Michael Burry",
    bio: "The Big Short · Hedge Fund Manager 📊",
    imageUrl: "/celebs/burry.jpg",
    verified: true,
    twitter: "@michaeljburry",
  },
  
  // Elon Musk
  "0x4444444444444444444444444444444444444444": {
    address: "0x4444444444444444444444444444444444444444",
    name: "elon",
    displayName: "Elon Musk",
    bio: "Tesla, SpaceX · Chief Twit 🚀",
    imageUrl: "/celebs/elon.jpg",
    verified: true,
    twitter: "@elonmusk",
  },

  // Vitalik Buterin
  "0x5555555555555555555555555555555555555555": {
    address: "0x5555555555555555555555555555555555555555",
    name: "vitalik",
    displayName: "Vitalik Buterin",
    bio: "Ethereum Co-founder · Crypto OG 🔷",
    imageUrl: "/celebs/vitalik.jpg",
    verified: true,
    twitter: "@VitalikButerin",
  },

  // Warren Buffett
  "0x6666666666666666666666666666666666666666": {
    address: "0x6666666666666666666666666666666666666666",
    name: "buffett",
    displayName: "Warren Buffett",
    bio: "Oracle of Omaha · Value Investor 💰",
    imageUrl: "/celebs/buffett.jpg",
    verified: true,
  },
};

/**
 * Get celebrity profile by address
 */
export function getCelebProfile(address: string): CelebProfile | null {
  return CELEB_PROFILES[address.toLowerCase()] || null;
}

/**
 * Check if address is a celebrity
 */
export function isCeleb(address: string): boolean {
  return !!CELEB_PROFILES[address.toLowerCase()];
}

/**
 * Get display name for address (celeb name or formatted address)
 */
export function getDisplayName(address: string): string {
  const celeb = getCelebProfile(address);
  if (celeb) return celeb.displayName;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get all celebrity addresses
 */
export function getAllCelebAddresses(): string[] {
  return Object.keys(CELEB_PROFILES);
}

