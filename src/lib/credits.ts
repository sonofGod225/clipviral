import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { supabaseAdmin } from './supabase';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables');
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limiter pour les requêtes API
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requêtes par minute
});

// Gestion des crédits
export async function getUserCredits(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data.credits;
}

export async function updateUserCredits(userId: string, amount: number): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ credits: amount })
    .eq('id', userId)
    .select('credits')
    .single();

  if (error) throw error;
  return data.credits;
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  const currentCredits = await getUserCredits(userId);
  
  if (currentCredits < amount) {
    return false;
  }

  await updateUserCredits(userId, currentCredits - amount);
  return true;
}

export async function addCredits(userId: string, amount: number): Promise<number> {
  const currentCredits = await getUserCredits(userId);
  return await updateUserCredits(userId, currentCredits + amount);
}

// Cache des crédits avec Redis
const CREDITS_CACHE_TTL = 60 * 5; // 5 minutes

export async function getCachedCredits(userId: string): Promise<number> {
  const cacheKey = `credits:${userId}`;
  const cachedCredits = await redis.get<number>(cacheKey);

  if (cachedCredits !== null) {
    return cachedCredits;
  }

  const credits = await getUserCredits(userId);
  await redis.set(cacheKey, credits, { ex: CREDITS_CACHE_TTL });
  return credits;
}

export async function invalidateCreditsCache(userId: string): Promise<void> {
  const cacheKey = `credits:${userId}`;
  await redis.del(cacheKey);
} 