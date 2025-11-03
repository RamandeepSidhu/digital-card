# Vercel KV Setup Guide

To enable persistent card storage across devices (so cards work when scanned from phones), you need to set up Vercel KV.

## Steps to Enable Vercel KV:

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Create a KV Database**
   - Go to the **Storage** tab
   - Click **Create Database**
   - Select **KV** (Redis)
   - Name it (e.g., "digital-cards-kv")
   - Choose a region close to your users

3. **Link KV to Your Project**
   - After creating, click **Link to Project**
   - Select your digital-card-app project

4. **Environment Variables**
   - Vercel automatically adds these environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
   - They are automatically available in your deployed app

5. **Redeploy**
   - Push your code or trigger a new deployment
   - Cards will now be stored persistently!

## How It Works:

- **Without KV**: Cards only work on the device where they were created (localStorage)
- **With KV**: Cards work everywhere! Anyone can scan your QR code on any device

## Fallback Behavior:

If KV is not configured, the app automatically falls back to in-memory storage (which only works on the same server instance). This means:
- Local development: Works with in-memory storage
- Production without KV: Cards only accessible on creator's device
- Production with KV: Cards accessible from any device! ✅

## Testing Locally:

You can test locally by adding these to your `.env.local`:
```
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

Get these values from your Vercel dashboard → Storage → KV Database → Settings

