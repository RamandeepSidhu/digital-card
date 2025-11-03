# Vercel KV Setup for Digital Card App

## Quick Setup Guide

Your Project ID: `prj_92V1JdARlYOxAeM3CFeJtX9gU38M`

### Option 1: Using Vercel Marketplace (Recommended)

1. **Go to Vercel Marketplace**
   - Visit: https://vercel.com/integrations
   - Search for "Upstash KV" or "Redis"
   - Click on "Upstash Redis"

2. **Add Integration**
   - Click "Add Integration"
   - Select your project: `digital-card-red` (or search by Project ID: `prj_92V1JdARlYOxAeM3CFeJtX9gU38M`)
   - Click "Add"

3. **Create Database**
   - Follow the prompts to create a new Upstash database
   - Choose a region close to your users
   - Name it (e.g., "digital-cards-kv")

4. **Environment Variables**
   - Vercel will automatically add:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - These are automatically available in your deployment

5. **Update Code for Upstash**
   - The code needs a small update to use Upstash instead of Vercel KV
   - See below for the update

### Option 2: Direct Setup via Vercel Dashboard

1. **Go to Your Project**
   - Visit: https://vercel.com/dashboard
   - Select project: `digital-card-red`
   - Or use direct link: https://vercel.com/[your-team]/digital-card-red

2. **Storage Tab**
   - Click on "Storage" in the sidebar
   - Click "Create Database"
   - Select "KV" (if available) or use Marketplace option above

3. **Link Database**
   - After creation, click "Link to Project"
   - Select your project
   - Environment variables will be added automatically

### Update Code for Upstash (if using Marketplace option)

Since Vercel KV is now via Upstash, update the storage file:

```typescript
// Install: npm install @upstash/redis
// Then update src/lib/cardStorageKV.ts to use Upstash
```

Would you like me to update the code for Upstash compatibility?

## After Setup

1. **Redeploy**
   - Push any code changes or trigger a redeploy
   - Cards will now persist across devices!

2. **Test**
   - Create a card on desktop
   - Scan QR code on phone
   - Card should appear!

## Troubleshooting

- **Cards still not found?** Check that environment variables are set in Vercel Dashboard → Settings → Environment Variables
- **Error in logs?** Check Vercel Function Logs for any KV connection errors

