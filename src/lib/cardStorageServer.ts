import { Card } from '@/types/card';
import { saveCardKV, getAllCardsKV, getCardByIdKV, deleteCardKV } from './cardStorageKV';

/**
 * Server-side card storage
 * Uses Vercel KV (persistent) if available, falls back to in-memory
 */

export async function saveCardServer(card: Card): Promise<void> {
  await saveCardKV(card);
}

export async function getAllCardsServer(): Promise<Card[]> {
  return await getAllCardsKV();
}

export async function getCardByIdServer(id: string): Promise<Card | null> {
  return await getCardByIdKV(id);
}

export async function deleteCardServer(id: string): Promise<boolean> {
  return await deleteCardKV(id);
}

