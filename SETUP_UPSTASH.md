# Quick Setup Guide: Upstash Redis for Vercel

**Your Project:** `digital-card-red`  
**Project ID:** `prj_92V1JdARlYOxAeM3CFeJtX9gU38M`

## Step-by-Step Instructions

### 1. Go to Vercel Marketplace
Visit: https://vercel.com/integrations/upstash-redis

### 2. Add Upstash Redis
- Click **"Add Integration"**
- Select your project: `digital-card-red` 
- Click **"Add"**

### 3. Create Database
- Click **"Create Database"** or **"Provision Upstash Database"**
- Choose a region (closest to your users)
- Database name: `digital-cards-kv` (or any name)
- Click **"Create"**

### 4. Environment Variables (Automatic!)
✅ Vercel automatically adds these to your project:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

You can verify in: Vercel Dashboard → Your Project → Settings → Environment Variables

### 5. Redeploy
- Push your code OR
- Go to Deployments tab → Click "Redeploy"

### 6. Test It!
1. Create a card on desktop
2. Scan QR code on your phone
3. Card should appear! 🎉

## What This Fixes

- ✅ Cards work across all devices
- ✅ Images stored with cards (base64 in Redis)
- ✅ Persistent storage (cards don't disappear after server restart)
- ✅ Free tier: Upstash has generous free limits

## Troubleshooting

**Cards still not found?**
1. Check Vercel Function Logs for errors
2. Verify environment variables are set
3. Try creating a new card after setup

**Need Help?**
- Check Vercel Dashboard → Storage tab for your Redis instance
- View logs in Vercel Dashboard → Deployments → Functions

---

## Alternative: Manual Setup

If Marketplace doesn't work:

1. Go to https://upstash.com
2. Create account → Create Redis database
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
4. Add to Vercel: Settings → Environment Variables
5. Redeploy

