# Vercel Environment Variables Setup

## Your Upstash Redis Credentials

Based on your Upstash dashboard, add these to Vercel:

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project: `digital-card-red`
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables

Add these 4 environment variables:

```bash
KV_REST_API_URL=https://glowing-bluebird-26613.upstash.io
KV_REST_API_TOKEN=AWf1AAIncDI0ZWVjZmUxOTJiOGM0MWVlYmVkYzE1MDQ0MjBiNWJkMnAyMjY2MTM
```

**OR** use the Upstash naming convention (both work):

```bash
UPSTASH_REDIS_REST_URL=https://glowing-bluebird-26613.upstash.io
UPSTASH_REDIS_REST_TOKEN=AWf1AAIncDI0ZWVjZmUxOTJiOGM0MWVlYmVkYzE1MDQ0MjBiNWJkMnAyMjY2MTM
```

### Step 3: Set Environment

For each variable, set:
- **Environment**: Production, Preview, Development (check all 3)

### Step 4: Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger auto-deploy

### Step 5: Verify

1. Create a test card
2. Check Vercel Function Logs for any errors
3. Try accessing card from different device

## Important Notes

- ✅ The code supports both `KV_REST_API_*` and `UPSTASH_REDIS_REST_*` variable names
- ✅ Images are stored as base64 in Redis (free storage included)
- ✅ Cards will now work across all devices!

## Troubleshooting

If cards still not found:
1. Check Vercel Function Logs → Look for Redis connection errors
2. Verify environment variables are set correctly
3. Make sure variables are available in **Production** environment
4. Wait a few minutes after redeploy for changes to propagate

