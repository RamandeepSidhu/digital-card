# Redis Setup Guide

## Quick Fix for "token is empty" or "Card not found" Errors

**Supports both:**
- ✅ Redis Cloud (connection string format)
- ✅ Upstash Redis (REST API format)

### Problem
- Cards created but not accessible via URL
- Error: `"unable to authenticate: token is empty"`
- Error: `"Card not found. Redis is not connected"`

### Solution: Add Redis Credentials

#### Step 1: Get Credentials

**Option A: Using Upstash Redis (REST API) - Recommended for Vercel**

1. Go to https://vercel.com/dashboard
2. Select project: `digital-card-red`
3. Click **Storage** tab
4. Click on your Redis database (e.g., `digital-cards-kv`)
5. Click **Quickstart** or **Getting Started** tab
6. Copy:
   - `KV_REST_API_URL` (starts with `https://`)
   - `KV_REST_API_TOKEN` (long string, copy ENTIRE token)

**Option B: Using Redis Cloud (Connection String)**

If you have a Redis Cloud connection string:
1. Get your connection string (format: `redis://default:password@host:port`)
2. Use environment variable: `REDIS_URL` or `DIGITAL_CARD_REDIS_URL`

#### Step 2: Create `.env.local` File

Create a file named `.env.local` in the project root:

**Windows PowerShell:**
```powershell
New-Item -Path .env.local -ItemType File -Force
```

**Or create manually** in your editor.

#### Step 3: Add Credentials

Open `.env.local` and add credentials based on your Redis provider:

**Option A: Upstash Redis (REST API)**
```env
KV_REST_API_URL=https://your-redis-url.upstash.io
KV_REST_API_TOKEN=your-full-token-here
```

**Option B: Redis Cloud (Connection String)**
```env
REDIS_URL=redis://default:password@host:port
```

**Important:**
- ✅ No quotes around values
- ✅ No spaces before/after `=`
- ✅ Copy the ENTIRE token/connection string
- ✅ Upstash URL must start with `https://`
- ✅ Redis Cloud URL must start with `redis://`

**Examples:**
```env
# Upstash Redis
KV_REST_API_URL=https://glowing-bluebird-26613.upstash.io
KV_REST_API_TOKEN=AWf1AAIncDI0ZWVjZmUxOTJiOGM0MWVlYmVkYzE1MDQ0MjBiNWJkMnAyMjY2MTM

# Redis Cloud
REDIS_URL=redis://default:EjSjnulJ8JQfQQzHGqv1sjG6cy55Zrle@redis-16281.c74.us-east-1-4.ec2.redns.redis-cloud.com:16281
```

#### Step 4: Restart Dev Server

**Must restart** after creating/editing `.env.local`:

```bash
# Stop server (Ctrl+C)
npm run dev
```

#### Step 5: Verify

1. **Check environment:**
   ```bash
   node scripts/check-env.js
   ```
   Should show: `✅ Redis/KV is configured!`

2. **Test connection:**
   Visit: http://localhost:3000/api/debug-redis
   
   Should return:
   ```json
   {
     "redisStatus": "✅ Connected successfully!",
     "connectionTest": "✅ PING successful"
   }
   ```

3. **Create a test card:**
   - Cards should now save to Redis
   - Cards accessible via URL
   - Works across devices

## Troubleshooting

### Still getting "token is empty"?

1. **Verify file exists:**
   ```powershell
   Test-Path .env.local
   ```

2. **Check file contents:**
   ```powershell
   Get-Content .env.local
   ```

3. **Common mistakes:**
   - ❌ File named `.env.local.txt` (should be `.env.local`)
   - ❌ Empty token value
   - ❌ Spaces around `=`
   - ❌ Quotes around values
   - ❌ Forgot to restart dev server

### Still getting "WRONGPASS"?

- Token is invalid or expired
- Get fresh credentials from Vercel Storage tab
- Make sure you're using Redis credentials (not QStash)

### Cards still not found?

- Create a NEW card after setting up Redis
- Old cards (created before Redis) won't work
- Check server logs for Redis connection errors

## For Production (Vercel)

Environment variables are automatically set when you:
1. Add Upstash Redis via Vercel Marketplace, OR
2. Manually add in: Vercel Dashboard → Settings → Environment Variables

No `.env.local` needed for production!

