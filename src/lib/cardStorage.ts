import { Card } from '@/types/card';

/**
 * Storage utilities for card data
 * Using localStorage for MVP, can be migrated to database later
 */

const STORAGE_KEY = 'digital-cards';

/**
 * Store a new card in localStorage
 */
export function saveCard(card: Card): void {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is only available in browser environment');
  }

  const existingCards = getAllCards();
  existingCards.push(card);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingCards));
}

/**
 * Get all cards from localStorage
 */
export function getAllCards(): Card[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const cards = JSON.parse(stored);
    return cards.map((card: Card) => ({
      ...card,
      createdAt: new Date(card.createdAt),
    }));
  } catch (error) {
    console.error('Error parsing cards from localStorage:', error);
    return [];
  }
}

/**
 * Get a specific card by ID
 */
export function getCardById(id: string): Card | null {
  const cards = getAllCards();
  return cards.find((card) => card.id === id) || null;
}

/**
 * Delete a card by ID
 */
export function deleteCard(id: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const cards = getAllCards();
  const filteredCards = cards.filter((card) => card.id !== id);
  
  if (filteredCards.length === cards.length) {
    return false; // Card not found
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
  return true;
}

