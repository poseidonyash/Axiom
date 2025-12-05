# 🚀 Deploying Axiom to Vercel

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your OnchainKit API key

---

## Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: Axiom V2 - Production ready"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Connect to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub account
4. Find your **Axiom repository**
5. Click **"Import"**

### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

---

## Step 3: Configure Environment Variables

**CRITICAL:** Add your environment variables in Vercel:

1. In your Vercel project, go to **"Settings"** → **"Environment Variables"**
2. Add the following:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | `your_api_key_here` | Production, Preview, Development |

**To get your API key:**
- Go to https://portal.cdp.coinbase.com/
- Create/login to your account
- Copy your API key
- Paste it in Vercel

---

## Step 4: Configure Build Settings

Vercel should auto-detect Next.js, but verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install --legacy-peer-deps` |
| **Node Version** | 18.x or 20.x |

**Important:** Make sure to set the install command to `npm install --legacy-peer-deps` due to OnchainKit dependencies.

---

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://your-project.vercel.app`

---

## Step 6: Test Your Deployment

Visit your Vercel URL and verify:

- [ ] Page loads without errors
- [ ] Wallet connection works
- [ ] Both market prices load (green indicators)
- [ ] Portfolio calculator works
- [ ] Oracle Feed loads
- [ ] Can mint NFTs (requires wallet with Base Sepolia ETH)

---

## 🐛 Common Deployment Issues

### Issue 1: Build Fails - Dependency Resolution

**Error:** `npm ERR! ERESOLVE unable to resolve dependency tree`

**Solution:**
1. Go to **Settings** → **General**
2. Override install command: `npm install --legacy-peer-deps`
3. Redeploy

### Issue 2: Environment Variable Not Working

**Error:** OnchainKit API key not found

**Solution:**
1. Double-check variable name: `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
2. Make sure it's set for **Production** environment
3. Redeploy (environment variables only apply on redeploy)

### Issue 3: Build Succeeds but App Shows Errors

**Error:** Runtime errors in browser

**Solution:**
1. Check browser console for specific errors
2. Make sure contract addresses are correct in:
   - `components/MintCard.tsx`
   - `components/OracleFeedV2.tsx`
3. Verify Base Sepolia network is accessible

### Issue 4: Static Export Error

**Error:** `Error: Page "/user/[address]" is missing "generateStaticParams()"`

**Solution:**
The dynamic routes are fine for Vercel (it supports SSR). If you see this error:
1. Make sure `output: 'standalone'` is NOT in `next.config.js`
2. Remove any `export` configuration if present

---

## 📊 Expected Build Output

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         120 kB
├ ○ /calculator                          3.1 kB         118 kB
└ ○ /user/[address]                      2.8 kB         117 kB

○ (Static)  automatically rendered as static HTML
```

---

## 🎯 Post-Deployment Checklist

- [ ] Site loads on Vercel URL
- [ ] Wallet connects via OnchainKit
- [ ] Both markets show green live indicators
- [ ] Portfolio calculations work
- [ ] Oracle Feed reads from blockchain
- [ ] Can mint NFTs successfully
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)

---

## 🔄 Updating Your Deployment

Every time you push to GitHub, Vercel will automatically:
1. Build your new code
2. Deploy to a preview URL
3. After you verify, promote to production

To manually redeploy:
```bash
# From project root
vercel --prod
```

---

## 🌐 Custom Domain (Optional)

To use your own domain:

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `axiom.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

---

## 📈 Performance Monitoring

Vercel provides built-in analytics:

1. Go to **Analytics** tab in your project
2. View:
   - Page views
   - Load times
   - Core Web Vitals
   - Geographic distribution

---

## 🚨 Emergency Rollback

If something breaks after deployment:

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

## 💡 Pro Tips

### Tip 1: Preview Deployments
Every branch/PR gets its own preview URL. Great for testing!

### Tip 2: Environment Variables Per Branch
You can set different variables for Production vs Preview environments.

### Tip 3: Deploy Hooks
Set up webhooks to redeploy when external data changes.

### Tip 4: Speed Insights
Enable Speed Insights in project settings for real user monitoring.

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs
- **Environment Variables:** https://vercel.com/docs/environment-variables

---

## ✅ Success!

Once deployed, your Axiom dApp will be:
- ⚡ Globally distributed (fast everywhere)
- 🔒 HTTPS by default
- 📱 Mobile optimized
- 🔄 Auto-deploys on git push
- 📊 Analytics included
- 🌐 Production-ready!

**Your live URL:** `https://your-project.vercel.app`

Share it with judges, investors, and users! 🚀

---

**Need help?** Check the Troubleshooting section above or Vercel's excellent documentation.

**Good luck with your deployment!** 💜

