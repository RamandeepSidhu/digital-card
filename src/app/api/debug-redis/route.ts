import { NextResponse } from 'next/server';
import { initRedis } from '@/lib/cardStorageKV';

/**
 * Debug endpoint to check Redis connection
 * Visit: /api/debug-redis
 */
export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    serverSide: typeof window === 'undefined',
    envVars: {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? '✅ Set' : '❌ Missing',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? '✅ Set' : '❌ Missing',
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? '✅ Set' : '❌ Missing',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Set' : '❌ Missing',
    },
  };

  try {
    // Try to initialize Redis
    if (typeof window === 'undefined') {
      const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

      if (redisUrl && redisToken) {
        debug.redisStatus = 'Attempting connection...';
        
        try {
          const { Redis } = await import('@upstash/redis');
          const redis = new Redis({
            url: redisUrl,
            token: redisToken,
          });
          
          // Test connection
          await redis.ping();
          debug.redisStatus = '✅ Connected successfully!';
          debug.connectionTest = '✅ PING successful';
          
          // Try a simple set/get
          const testKey = 'test-connection';
          await redis.set(testKey, 'test-value');
          const testValue = await redis.get(testKey);
          await redis.del(testKey);
          
          debug.testSetGet = testValue === 'test-value' ? '✅ Set/Get works!' : '❌ Set/Get failed';
        } catch (redisError: any) {
          debug.redisStatus = '❌ Connection failed';
          debug.redisError = redisError.message || String(redisError);
        }
      } else {
        debug.redisStatus = '❌ Missing URL or Token';
      }
    } else {
      debug.redisStatus = '❌ Client-side (Redis only works server-side)';
    }
  } catch (error: any) {
    debug.error = error.message || String(error);
  }

  return NextResponse.json(debug, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

