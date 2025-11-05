import { Card } from '@/types/card';

/**
 * Persistent storage using Redis (supports Upstash REST API and Redis Cloud connection string)
 * Falls back to in-memory storage if Redis is not available
 */

let redis: any = null;
let fallbackStore: Card[] = [];

// Try to initialize Redis (supports both Upstash REST API and Redis Cloud connection string)
export async function initRedis() {
  if (redis !== null) return redis; // Already initialized
  
  try {
    // Only try to import if we're on the server and Redis is configured
    if (typeof window === 'undefined') {
      // Check for Redis Cloud connection string (redis:// format)
      const redisConnectionString = process.env.REDIS_URL;
      
      if (redisConnectionString && redisConnectionString.startsWith('redis://')) {
        try {
          console.log('🔗 Connecting to Redis Cloud (connection string)...');
          const { createClient } = await import('redis');
          const client = createClient({
            url: redisConnectionString.trim(),
          });
          
          await client.connect();
          console.log('✅ Redis Cloud connection initialized');
          
          // Wrap Redis client to match Upstash Redis API
          redis = {
            get: async (key: string) => {
              const value = await client.get(key);
              return value;
            },
            set: async (key: string, value: string) => {
              const result = await client.set(key, value);
              return result === 'OK' ? result : 'OK'; // Normalize return value
            },
            del: async (key: string) => {
              return await client.del(key);
            },
            ping: async () => {
              return await client.ping();
            },
            client, // Store original client for cleanup if needed
          };
          
          await redis.ping();
          console.log('✅ Redis Cloud connection tested');
          return redis;
        } catch (error: any) {
          console.error('❌ Redis Cloud connection failed:', error.message || error);
          return null;
        }
      }
      
      // Try Upstash Redis (REST API)
      const redisUrl = process.env.KV_REST_API_URL;
      const redisToken = process.env.KV_REST_API_TOKEN;
      
      // Validate that both URL and token are present and not empty
      if (!redisUrl || redisUrl.trim() === '') {
        console.warn('⚠️ Redis URL is missing or empty');
        return null;
      }
      
      if (!redisToken || redisToken.trim() === '') {
        console.warn('⚠️ Redis token is missing or empty');
        console.warn('💡 Make sure KV_REST_API_TOKEN is set in .env.local file');
        return null;
      }
      
      // Validate URL format (Upstash uses https://)
      if (!redisUrl.startsWith('https://')) {
        console.warn('⚠️ Redis URL must start with https:// for Upstash');
        return null;
      }
      
      // Validate token is not just whitespace
      const trimmedToken = redisToken.trim();
      if (trimmedToken.length < 10) {
        console.warn('⚠️ Redis token appears to be invalid (too short)');
        return null;
      }
      
      try {
        console.log('🔗 Connecting to Upstash Redis (REST API)...', { 
          url: redisUrl, 
          hasToken: !!trimmedToken,
          tokenLength: trimmedToken.length 
        });
        
        // Dynamic import to avoid bundling issues
        const { Redis } = await import('@upstash/redis');
        redis = new Redis({
          url: redisUrl.trim(),
          token: trimmedToken,
        });
        
        // Test connection with a ping
        await redis.ping();
        console.log('✅ Upstash Redis connection initialized and tested');
        return redis;
      } catch (error: any) {
        console.error('❌ Upstash Redis connection failed:', error.message || error);
        if (error.message?.includes('token') || error.message?.includes('auth')) {
          console.error('💡 Authentication error - check your KV_REST_API_TOKEN in .env.local');
          console.error('💡 Make sure the token is correct and not expired');
        }
        return null;
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
      
      // Strategy 1: Save to individual key for fast lookup
      await redisClient.set(`${CARD_PREFIX}${card.id}`, JSON.stringify(card));
      console.log(`✅ Card ${card.id} saved to individual key`);
      
      // Strategy 2: Also save to list for getAllCards
      try {
        const allCardsData = await redisClient.get(CARDS_KEY);
        let allCards: Card[] = [];
        
        if (allCardsData) {
          allCards = typeof allCardsData === 'string' ? JSON.parse(allCardsData) : allCardsData;
          if (!Array.isArray(allCards)) {
            allCards = [];
          }
        }
        
        // Check if card already exists in list
        const exists = allCards.find(c => c?.id === card.id);
        if (!exists) {
          allCards.push(card);
          await redisClient.set(CARDS_KEY, JSON.stringify(allCards));
          console.log(`✅ Card ${card.id} added to list`);
        } else {
          console.log(`ℹ️ Card ${card.id} already in list, skipping`);
        }
      } catch (listError) {
        console.warn(`⚠️ Error updating list for card ${card.id}:`, listError);
        // Individual key save succeeded, so continue
      }
      
      console.log(`✅ Card ${card.id} fully saved to Redis`);
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
      
      // Strategy 1: Try individual key first (fastest)
      let data = await redisClient.get(`${CARD_PREFIX}${id}`);
      
      if (data) {
        const card = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(`✅ Card ${id} found by individual key`);
        return {
          ...card,
          createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
        };
      }
      
      // Strategy 2: Fallback to searching the list (for cards saved before individual keys were implemented)
      console.log(`⚠️ Card ${id} not found by key, searching list...`);
      const allCardsData = await redisClient.get(CARDS_KEY);
      
      if (allCardsData) {
        const allCards = typeof allCardsData === 'string' ? JSON.parse(allCardsData) : allCardsData;
        const card = Array.isArray(allCards) ? allCards.find((c: any) => c?.id === id) : null;
        
        if (card) {
          console.log(`✅ Card ${id} found in list`);
          // Save to individual key for faster future lookups
          try {
            await redisClient.set(`${CARD_PREFIX}${id}`, JSON.stringify(card));
            console.log(`💾 Card ${id} cached to individual key`);
          } catch (cacheError) {
            console.warn(`⚠️ Failed to cache card ${id} to individual key:`, cacheError);
          }
          
          return {
            ...card,
            createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
          };
        }
      }
      
      console.log(`❌ Card ${id} not found in Redis (checked both key and list)`);
      return null;
      
    } catch (error) {
      console.error(`❌ Error fetching card ${id} from Redis:`, error);
      // Fallback to in-memory
      const card = fallbackStore.find((card) => card.id === id);
      if (card) {
        console.log(`📝 Card ${id} found in in-memory fallback`);
        return {
          ...card,
          createdAt: new Date(card.createdAt),
        };
      }
      return null;
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
 * Delete a card from storage
 */
export async function deleteCardKV(id: string): Promise<void> {
  const redisClient = await initRedis();
  
  if (redisClient) {
    try {
      console.log(`🗑️ Deleting card ${id} from Redis...`);
      
      // Strategy 1: Delete individual key
      await redisClient.del(`${CARD_PREFIX}${id}`);
      console.log(`✅ Card ${id} deleted from individual key`);
      
      // Strategy 2: Remove from list
      try {
        const allCardsData = await redisClient.get(CARDS_KEY);
        if (allCardsData) {
          let allCards: Card[] = typeof allCardsData === 'string' ? JSON.parse(allCardsData) : allCardsData;
          if (!Array.isArray(allCards)) {
            allCards = [];
          }
          
          const filteredCards = allCards.filter(c => c?.id !== id);
          if (filteredCards.length !== allCards.length) {
            await redisClient.set(CARDS_KEY, JSON.stringify(filteredCards));
            console.log(`✅ Card ${id} removed from list`);
          }
        }
      } catch (listError) {
        console.warn(`⚠️ Error updating list for card ${id}:`, listError);
        // Individual key deletion succeeded, so continue
      }
      
      console.log(`✅ Card ${id} fully deleted from Redis`);
    } catch (error) {
      console.error(`❌ Error deleting card ${id} from Redis:`, error);
      // Fallback to in-memory
      const index = fallbackStore.findIndex(c => c.id === id);
      if (index !== -1) {
        fallbackStore.splice(index, 1);
        console.warn('📝 Card deleted from in-memory fallback');
      }
    }
  } else {
    // Fallback to in-memory
    console.warn('📝 Redis not available, deleting from in-memory storage');
    const index = fallbackStore.findIndex(c => c.id === id);
    if (index !== -1) {
      fallbackStore.splice(index, 1);
    }
  }
}
