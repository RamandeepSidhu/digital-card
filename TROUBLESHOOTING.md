# Troubleshooting Guide

## Common Issues

### "Card not found" or "Redis is not connected"

**Solution:** See [REDIS_SETUP.md](./REDIS_SETUP.md) for complete setup instructions.

Quick fix:
1. Get Redis credentials from Vercel Dashboard → Storage
2. Create `.env.local` file with credentials
3. Restart dev server

### "unable to authenticate: token is empty"

**Cause:** `.env.local` file missing or token is empty.

**Solution:**
1. Create `.env.local` file in project root
2. Add `KV_REST_API_TOKEN` with your full token
3. Restart dev server

See [REDIS_SETUP.md](./REDIS_SETUP.md) for detailed steps.

### Cards created but not accessible via URL

**Cause:** Cards saved to in-memory storage (not persistent).

**Solution:** Set up Redis - see [REDIS_SETUP.md](./REDIS_SETUP.md)

### API not being called

**Check:**
1. Open browser DevTools (F12) → Network tab
2. Create a card
3. Look for POST request to `/api/cards`
4. Check browser console for errors

**If API fails:**
- Check server terminal for error messages
- Verify Redis credentials are correct
- Check `.env.local` file format

### E2E Tests Failing

**Run tests:**
```bash
npm run test:e2e
```

**View test results:**
```bash
npm run test:e2e -- --ui
```

**Common test issues:**
- Tests expect Redis to be configured
- Some tests may fail if Redis not set up
- Check `playwright-report/index.html` for detailed results

## Getting Help

1. Check server logs for error messages
2. Visit `/api/debug-redis` to test Redis connection
3. Run `node scripts/check-env.js` to verify environment variables
4. See [REDIS_SETUP.md](./REDIS_SETUP.md) for Redis setup
