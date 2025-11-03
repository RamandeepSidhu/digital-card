import { Card } from '@/types/card';

// In-memory storage for server-side (MVP)
// In production, this would be replaced with a database
let cardStore: Card[] = [];

/**
 * Server-side card storage (in-memory for MVP)
 * In production, replace with database calls
 */
export function saveCardServer(card: Card): void {
  cardStore.push(card);
}

export function getAllCardsServer(): Card[] {
  return cardStore.map((card) => ({
    ...card,
    createdAt: new Date(card.createdAt),
  }));
}

export function getCardByIdServer(id: string): Card | null {
  return cardStore.find((card) => card.id === id) || null;
}

export function deleteCardServer(id: string): boolean {
  const index = cardStore.findIndex((card) => card.id === id);
  if (index === -1) return false;
  cardStore.splice(index, 1);
  return true;
}

