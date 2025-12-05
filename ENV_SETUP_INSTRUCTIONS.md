# Environment Setup Instructions

## Quick Start

Create a file called `.env.local` in the root of the project with the following content:

```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

## Getting Your OnchainKit API Key

1. Go to https://portal.cdp.coinbase.com/
2. Sign up or log in
3. Create a new project called "Axiom"
4. Navigate to API Keys section
5. Copy your API key (starts with `pk_`)
6. Paste it in `.env.local`

**Note:** The `.env.local` file is ignored by git for security. Never commit API keys!



