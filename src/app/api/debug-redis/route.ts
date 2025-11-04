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
      REDIS_URL: process.env.REDIS_URL ? '✅ Set' : '❌ Missing',
      KV_REST_API_URL: process.env.KV_REST_API_URL ? '✅ Set' : '❌ Missing',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? '✅ Set' : '❌ Missing',
    },
  };

  try {
    // Try to initialize Redis
    if (typeof window === 'undefined') {
      // Check for Redis Cloud connection string first
      const redisConnectionString = process.env.REDIS_URL;
      
      if (redisConnectionString && redisConnectionString.startsWith('redis://')) {
        debug.redisStatus = 'Attempting Redis Cloud connection...';
        debug.connectionType = 'Redis Cloud (Connection String)';
        
        try {
          const { createClient } = await import('redis');
          const client = createClient({
            url: redisConnectionString.trim(),
          });
          
          await client.connect();
          await client.ping();
          debug.redisStatus = '✅ Connected successfully!';
          debug.connectionTest = '✅ PING successful';
          
          // Test set/get
          const testKey = 'test-connection';
          await client.set(testKey, 'test-value');
          const testValue = await client.get(testKey);
          await client.del(testKey);
          
          debug.testSetGet = testValue === 'test-value' ? '✅ Set/Get works!' : '❌ Set/Get failed';
          await client.quit();
        } catch (redisError: any) {
          debug.redisStatus = '❌ Connection failed';
          debug.redisError = redisError.message || String(redisError);
        }
      } else {
        // Try Upstash Redis (REST API)
        const redisUrl = process.env.KV_REST_API_URL;
        const redisToken = process.env.KV_REST_API_TOKEN;

        if (redisUrl && redisToken) {
          debug.redisStatus = 'Attempting Upstash Redis connection...';
          debug.connectionType = 'Upstash Redis (REST API)';
          
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
          debug.redisStatus = '❌ Missing credentials';
          debug.message = 'Set either REDIS_URL (connection string) or KV_REST_API_URL + KV_REST_API_TOKEN (Upstash)';
        }
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

