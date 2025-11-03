# Fix "Card Not Found" Error

## The Problem
Cards are showing "Card Not Found" because **Vercel doesn't have the Redis environment variables configured**.

## ✅ Quick Fix (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project: **`digital-card-red`**

### Step 2: Add Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Click **Add New**

**Add Variable 1:**
- **Name:** `KV_REST_API_URL`
- **Value:** `https://glowing-bluebird-26613.upstash.io`
- **Environment:** ✅ Production ✅ Preview ✅ Development (check all)
- Click **Save**

**Add Variable 2:**
- **Name:** `KV_REST_API_TOKEN`  
- **Value:** `AWf1AAIncDI0ZWVjZmUxOTJiOGM0MWVlYmVkYzE1MDQ0MjBiNWJkMnAyMjY2MTM`
- **Environment:** ✅ Production ✅ Preview ✅ Development (check all)
- Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋯** (three dots menu)
4. Click **Redeploy**
5. Wait for deployment to finish (~1-2 minutes)

### Step 4: Test
1. Create a new card on desktop
2. Scan the QR code on your phone
3. Card should load! 🎉

## Why This Happens

Without Redis configured:
- ✅ Cards work on the **same device** where created (localStorage)
- ❌ Cards **don't work** on other devices (no server storage)

With Redis configured:
- ✅ Cards work **everywhere** (stored on server)
- ✅ Images are saved with cards
- ✅ Cards persist after server restarts

## Verify It's Working

After redeploy, check Vercel Function Logs:
1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. Try accessing a card
4. Look for Redis connection errors (should be none)

## Local Development

For local testing, create `.env.local`:
```bash
KV_REST_API_URL=https://glowing-bluebird-26613.upstash.io
KV_REST_API_TOKEN=AWf1AAIncDI0ZWVjZmUxOTJiOGM0MWVlYmVkYzE1MDQ0MjBiNWJkMnAyMjY2MTM
```

Then restart dev server: `npm run dev`

