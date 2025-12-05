# 🌟 Community Feature

## Overview

The Community feature transforms Axiom into a **social prediction platform** where users can follow and learn from other predictors. Every prediction is verified on-chain.

## Features

### 1. Community Feed (`/community`)
- **View All Predictors**: See every user who has made predictions
- **User Cards**: Each predictor displayed as a card with:
  - Avatar with gradient color (unique per address)
  - Number of predictions
  - Average edge percentage
  - Total amount staked
  - Preview of latest prediction
  - ⭐ Badge for users with 5+ predictions
- **Community Stats**: 
  - Total number of predictors
  - Total predictions made
  - Average community edge
- **Sorting**: Users ranked by prediction count

### 2. User Profiles (`/user/[address]`)
- **Detailed User View**:
  - Large avatar with gradient
  - Full wallet address with copy button
  - Share profile button
  - Link to BaseScan
- **User Statistics**:
  - Total predictions
  - Average edge
  - Best edge
  - Total amount staked
- **All Predictions**: Complete history of user's predictions with:
  - Market name
  - Edge percentage
  - Position size
  - Timestamp
  - On-chain verification badge

### 3. Oracle Feed Integration
- **Clickable Predictions**: Click any prediction to view the user's profile
- **Hover Effects**: Visual feedback on user interactions
- **External Link Icon**: Appears on hover to indicate clickability

### 4. Navigation
- **Community Link**: Added to navbar
- **Active States**: Highlights current page
- **Responsive**: Works on mobile and desktop

## Use Cases

### For Predictors
- **Build Reputation**: Show your track record
- **Share Success**: Share profile links on social media
- **Prove Expertise**: On-chain verified predictions

### For Followers
- **Learn from Experts**: See what top predictors are betting on
- **Track Strategies**: Follow specific users
- **Discover Trends**: See what the community is predicting

### For Influencers/Celebrities
- **Share Predictions**: Post predictions and let fans follow
- **Build Trust**: On-chain proof of predictions
- **Engage Community**: Fans can see your edge and strategy

## Technical Implementation

### Data Source
- All data fetched from AxiomV2 smart contract on Base Sepolia
- `getRecentPredictions()` function returns up to 100 predictions
- Real-time updates every 15 seconds

### On-Chain Data Structure
```solidity
struct Prediction {
    string market;          // Market name
    string betSize;         // Position size
    address predictor;      // User wallet address
    uint256 timestamp;      // When prediction was made
    uint256 edge;          // Edge in basis points
}
```

### Pages Created
1. `app/community/page.tsx` - Community feed
2. `app/user/[address]/page.tsx` - User profiles (dynamic route)

### Components Updated
1. `components/Navbar.tsx` - Added Community nav link
2. `components/OracleFeedV2.tsx` - Made predictions clickable

## Future Enhancements

### Potential Features
- **Following System**: Follow specific users
- **Leaderboard**: Top predictors by edge/accuracy
- **Filters**: Filter by market, edge range, timeframe
- **Search**: Search for users by address or ENS
- **Notifications**: Get notified when followed users make predictions
- **Comments**: Let users comment on predictions
- **Badges**: Achievement badges (10 predictions, 20%+ edge, etc.)
- **Analytics**: Charts and graphs of user performance over time
- **Bet Copying**: Copy bet sizes from successful predictors

### Social Features
- **Share to Twitter**: "I just predicted X with Y% edge on Axiom"
- **Profile Customization**: Bio, avatar, display name
- **Following Feed**: See only predictions from followed users
- **Trending**: Show trending predictors

### Monetization Ideas
- **Premium Profiles**: Paid subscriptions to see certain users' predictions
- **Tip Jar**: Tip successful predictors
- **Prediction Markets**: Bet on predictor success rates

## Demo Flow

1. **Make a Prediction**: Use calculator → mint prediction
2. **Visit Community**: Click "Community" in navbar
3. **Browse Users**: See all predictors as cards
4. **Click User**: View detailed profile
5. **Share**: Share interesting user profiles

## Social Impact

This feature enables:
- **Transparency**: All predictions verifiable on-chain
- **Education**: Learn from successful predictors
- **Community**: Build a network of predictors
- **Trust**: Immutable proof of predictions and track record

---

Built with ❤️ for MBC 2025 Hackathon 🚀

