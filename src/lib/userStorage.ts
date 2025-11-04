/**
 * User storage with Redis and in-memory fallback
 * For development when Redis is not configured
 */

import { initRedis } from './cardStorageKV';

// Use globalThis to persist across hot reloads in development
const getInMemoryUsers = (): Map<string, any> => {
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore - storing in globalThis for persistence
    if (!globalThis.__inMemoryUsers) {
      // @ts-ignore
      globalThis.__inMemoryUsers = new Map();
    }
    // @ts-ignore
    return globalThis.__inMemoryUsers;
  }
  // Fallback for environments where globalThis doesn't work
  if (typeof global !== 'undefined') {
    // @ts-ignore
    if (!global.__inMemoryUsers) {
      // @ts-ignore
      global.__inMemoryUsers = new Map();
    }
    // @ts-ignore
    return global.__inMemoryUsers;
  }
  // Last resort - module-level (will reset on hot reload)
  if (!(getInMemoryUsers as any).__map) {
    (getInMemoryUsers as any).__map = new Map();
  }
  return (getInMemoryUsers as any).__map;
};

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  // Normalize email to lowercase for consistent lookup
  const normalizedEmail = email.toLowerCase().trim();
  
  const redis = await initRedis();
  
  if (redis) {
    try {
      const userKey = `user:email:${normalizedEmail}`;
      const userData = await redis.get(userKey);
      if (userData) {
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        console.log(`✅ User found in Redis: ${normalizedEmail}`);
        return user;
      }
    } catch (error) {
      console.error('Error fetching user from Redis:', error);
    }
  }
  
  // Fallback to in-memory
  const inMemoryUsers = getInMemoryUsers();
  const user = inMemoryUsers.get(`user:email:${normalizedEmail}`);
  if (user) {
    console.log(`✅ User found in memory: ${normalizedEmail}`);
    console.log(`📊 In-memory storage size: ${inMemoryUsers.size} entries`);
    return user;
  }
  
  console.log(`❌ User not found: ${normalizedEmail}`);
  console.log(`📊 In-memory storage size: ${inMemoryUsers.size} entries`);
  // Debug: log all keys
  if (inMemoryUsers.size > 0) {
    console.log(`📋 In-memory keys:`, Array.from(inMemoryUsers.keys()));
  }
  return null;
}

export async function getUserById(id: string): Promise<User | null> {
  const redis = await initRedis();
  
  if (redis) {
    try {
      const userKey = `user:id:${id}`;
      const userData = await redis.get(userKey);
      if (userData) {
        return typeof userData === 'string' ? JSON.parse(userData) : userData;
      }
    } catch (error) {
      console.error('Error fetching user from Redis:', error);
    }
  }
  
  // Fallback to in-memory
  const inMemoryUsers = getInMemoryUsers();
  const user = inMemoryUsers.get(`user:id:${id}`);
  return user ? user : null;
}

export async function saveUser(user: User): Promise<void> {
  // Normalize email to lowercase for consistent storage
  const normalizedEmail = user.email.toLowerCase().trim();
  const userToSave = {
    ...user,
    email: normalizedEmail,
  };
  
  const redis = await initRedis();
  
  if (redis) {
    try {
      const emailKey = `user:email:${normalizedEmail}`;
      const idKey = `user:id:${user.id}`;
      await redis.set(emailKey, JSON.stringify(userToSave));
      await redis.set(idKey, JSON.stringify(userToSave));
      console.log(`✅ User saved to Redis: ${normalizedEmail}`);
      return;
    } catch (error) {
      console.error('Error saving user to Redis:', error);
      // Fall through to in-memory fallback
    }
  }
  
  // Fallback to in-memory
  const inMemoryUsers = getInMemoryUsers();
  const emailKey = `user:email:${normalizedEmail}`;
  const idKey = `user:id:${user.id}`;
  inMemoryUsers.set(emailKey, userToSave);
  inMemoryUsers.set(idKey, userToSave);
  console.warn(`📝 User saved to in-memory storage: ${normalizedEmail} (Redis not available)`);
  console.log(`📊 In-memory storage size after save: ${inMemoryUsers.size} entries`);
}

