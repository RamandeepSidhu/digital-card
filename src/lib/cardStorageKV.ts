import { Card } from '@/types/card';

/**
 * Persistent storage using Upstash Redis (via Vercel Marketplace)
 * Falls back to in-memory storage if Redis is not available
 */

let redis: any = null;
let fallbackStore: Card[] = [];

// Try to initialize Upstash Redis
export async function initRedis() {
  if (redis !== null) return redis; // Already initialized
  
  try {
    // Only try to import if we're on the server and Redis is configured
    if (typeof window === 'undefined') {
      // Try Upstash Redis (support multiple env var naming conventions)
      // Priority: Check KV_REST_API_* first (Vercel's naming), then UPSTASH_*
      const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
      
      if (redisUrl && redisToken) {
        console.log('🔗 Connecting to Upstash Redis...', { url: redisUrl, hasToken: !!redisToken });
        // Dynamic import to avoid bundling issues
        const { Redis } = await import('@upstash/redis');
        redis = new Redis({
          url: redisUrl,
          token: redisToken,
        });
        console.log('✅ Redis connection initialized');
        return redis;
      } else {
        console.warn('⚠️ Redis env vars not found:', { 
          hasUrl: !!redisUrl, 
          hasToken: !!redisToken,
          envKeys: Object.keys(process.env).filter(k => k.includes('KV') || k.includes('REDIS') || k.includes('UPSTASH'))
        });
      }
      
      // Fallback: Try Vercel KV (legacy)
      if (process.env.KV_REST_API_URL && !redis) {
        console.log('🔄 Trying legacy Vercel KV...');
        const kvModule = await import('@vercel/kv');
        redis = kvModule.default || kvModule.kv || kvModule;
        return redis;
      }
    }
  } catch (error) {
    console.error('❌ Redis/KV initialization error:', error);
    console.warn('📝 Falling back to in-memory storage');
  }
  
  return null;
}

const CARDS_KEY = 'digital-cards';
const CARD_PREFIX = 'card:';

/**
 * Save a card to persistent storage
 */
export async function saveCardKV(card: Card): Promise<void> {
  const redisClient = await initRedis();
  
  if (redisClient) {
    try {
      console.log(`💾 Saving card ${card.id} to Redis...`);
      // Save to Redis with individual key for fast lookup
      await redisClient.set(`${CARD_PREFIX}${card.id}`, JSON.stringify(card));
      // Also add to list for getAllCards
      const allCards = await getAllCardsKV();
      const exists = allCards.find(c => c.id === card.id);
      if (!exists) {
        allCards.push(card);
        await redisClient.set(CARDS_KEY, JSON.stringify(allCards));
      }
      console.log(`✅ Card ${card.id} saved to Redis`);
    } catch (error) {
      console.error('❌ Error saving card to Redis:', error);
      // Fallback to in-memory on error
      const exists = fallbackStore.find(c => c.id === card.id);
      if (!exists) {
        fallbackStore.push(card);
        console.warn('📝 Card saved to in-memory fallback');
      }
    }
  } else {
    // Fallback to in-memory
    console.warn('📝 Redis not available, using in-memory storage');
    const exists = fallbackStore.find(c => c.id === card.id);
    if (!exists) {
      fallbackStore.push(card);
    }
  }
}

/**
 * Get all cards from storage
 */
export async function getAllCardsKV(): Promise<Card[]> {
  const redisClient = await initRedis();
  
  if (redisClient) {
    try {
      const data = await redisClient.get(CARDS_KEY);
      if (!data) return [];
      const cards = typeof data === 'string' ? JSON.parse(data) : data;
      return cards.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt),
      }));
    } catch (error) {
      console.error('❌ Error fetching cards from Redis:', error);
      // Fallback to in-memory
      return fallbackStore.map((card) => ({
        ...card,
        createdAt: new Date(card.createdAt),
      }));
    }
  } else {
    // Fallback to in-memory
    return fallbackStore.map((card) => ({
      ...card,
      createdAt: new Date(card.createdAt),
    }));
  }
}

/**
 * Get a specific card by ID
 */
export async function getCardByIdKV(id: string): Promise<Card | null> {
  const redisClient = await initRedis();
  
  if (redisClient) {
    try {
      console.log(`🔍 Fetching card ${id} from Redis...`);
      const data = await redisClient.get(`${CARD_PREFIX}${id}`);
      if (!data) {
        // If not found by key, check list (for backwards compatibility)
        console.log(`⚠️ Card ${id} not found by key, checking list...`);
        const allCards = await getAllCardsKV();
        const card = allCards.find(c => c.id === id);
        if (card) {
          console.log(`✅ Card ${id} found in list`);
        } else {
          console.log(`❌ Card ${id} not found in Redis`);
        }
        return card || null;
      }
      const card = typeof data === 'string' ? JSON.parse(data) : data;
      console.log(`✅ Card ${id} found in Redis`);
      return {
        ...card,
        createdAt: new Date(card.createdAt),
      };
    } catch (error) {
      console.error(`❌ Error fetching card ${id} from Redis:`, error);
      // Fallback to in-memory
      const card = fallbackStore.find((card) => card.id === id);
      return card ? {
        ...card,
        createdAt: new Date(card.createdAt),
      } : null;
    }
  } else {
    console.warn(`📝 Redis not available, checking in-memory for card ${id}`);
    // Fallback to in-memory
    const card = fallbackStore.find((card) => card.id === id);
    return card ? {
      ...card,
      createdAt: new Date(card.createdAt),
    } : null;
  }
}

/**
 * Delete a card by ID
 */
export async function deleteCardKV(id: string): Promise<boolean> {
  const redisClient = await initRedis();
  
  if (redisClient) {
    try {
      await redisClient.del(`${CARD_PREFIX}${id}`);
      // Also remove from list
      const allCards = await getAllCardsKV();
      const filtered = allCards.filter(c => c.id !== id);
      await redisClient.set(CARDS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('❌ Error deleting card from Redis:', error);
      // Fallback to in-memory
      const index = fallbackStore.findIndex((card) => card.id === id);
      if (index === -1) return false;
      fallbackStore.splice(index, 1);
      return true;
    }
  } else {
    // Fallback to in-memory
    const index = fallbackStore.findIndex((card) => card.id === id);
    if (index === -1) return false;
    fallbackStore.splice(index, 1);
    return true;
  }
}
