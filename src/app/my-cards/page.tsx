'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/types/card';
import { getAllCards, deleteCard } from '@/lib/cardStorage';
import { generateCardUrl } from '@/lib/qrGenerator';
import CardPreview from '@/components/CardPreview';
import Link from 'next/link';

export default function MyCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        setError(null);

        // Fetch cards from database (Redis) via API
        const response = await fetch('/api/cards');
        
        if (response.ok) {
          const data = await response.json();
          const dbCards: Card[] = data.cards || [];
          
          // Convert createdAt strings to Date objects
          const formattedCards = dbCards.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
          }));

          // Merge with localStorage cards (in case some are only local)
          const localCards = getAllCards();
          
          // Combine and deduplicate by ID (prefer database cards)
          const cardMap = new Map<string, Card>();
          
          // Add local cards first
          localCards.forEach(card => {
            cardMap.set(card.id, card);
          });
          
          // Overwrite with database cards (they take priority)
          formattedCards.forEach(card => {
            cardMap.set(card.id, card);
          });

          const allCards = Array.from(cardMap.values());
          
          // Filter out example/dummy/test cards - only show cards with real data from API
          const realCards = allCards.filter(
            (card) => 
              !card.id.startsWith('example-') && 
              !card.id.startsWith('test-') && 
              card.data
          );
          
          // Sort by creation date (newest first)
          realCards.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          setCards(realCards);
        } else {
          // If API fails, fall back to localStorage
          console.warn('Failed to fetch cards from database, using localStorage');
          const localCards = getAllCards();
          // Filter out example/dummy/test cards - only show cards with real data
          const realCards = localCards.filter(
            (card) => 
              !card.id.startsWith('example-') && 
              !card.id.startsWith('test-') && 
              card.data
          );
          setCards(realCards);
        }
      } catch (err) {
        console.error('Error fetching cards:', err);
        // Fall back to localStorage on error
        const localCards = getAllCards();
        // Filter out example/dummy cards
        const realCards = localCards.filter(
          (card) => !card.id.startsWith('example-')
        );
        setCards(realCards);
        setError('Unable to load cards from database. Showing local cards only.');
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  const handleCopyLink = async (cardId: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const cardUrl = generateCardUrl(cardId, baseUrl);
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopiedId(cardId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDelete = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      const success = deleteCard(cardId);
      if (success) {
        setCards(getAllCards());
      }
    }
  };

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case 'business':
        return 'Business';
      case 'bank':
        return 'Bank';
      case 'personal':
        return 'Personal';
      default:
        return type;
    }
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'business':
        return '💼';
      case 'bank':
        return '🏦';
      case 'personal':
        return '👤';
      default:
        return '📇';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black py-12 px-4">
        <main className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-zinc-600 dark:text-zinc-400">Loading your cards from database...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black py-12 px-4">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            📋 My Cards
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and access all your created digital cards
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          )}
        </div>

        {cards.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              No Cards Yet
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Create your first digital card to get started!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Create a Card
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.slice(0, 6).map((card) => {
              const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
              const cardUrl = generateCardUrl(card.id, baseUrl);
              
              // Get card name based on type
              const cardName = card.type === 'business' 
                ? card.data.name 
                : card.type === 'personal' 
                ? card.data.name 
                : card.data.accountHolder;
              
              return (
                <div
                  key={card.id}
                  className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-shadow"
                >
                  {/* Card Preview */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900">
                    <CardPreview card={card} />
                  </div>

                  {/* Card Info */}
                  <div className="p-4 space-y-3">
                    {/* Card Name - Prominently Displayed */}
                    <div className="pb-3 border-b border-zinc-200 dark:border-zinc-700">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                        {cardName}
                      </h3>
                      {card.type === 'business' && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {card.data.title} at {card.data.company}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCardTypeIcon(card.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {getCardTypeLabel(card.type)} Card
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {(() => {
                              const date = card.createdAt instanceof Date ? card.createdAt : new Date(card.createdAt);
                              const day = String(date.getDate()).padStart(2, '0');
                              const year = String(date.getFullYear()).slice(-2);
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              return `${day} ${year} ${month}`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Link */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3">
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Card Link:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cardUrl}
                          readOnly
                          className="flex-1 text-xs px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-900 dark:text-zinc-100 font-mono truncate"
                        />
                        <button
                          onClick={() => handleCopyLink(card.id)}
                          className={`cursor-pointer px-3 py-1 rounded text-xs font-medium transition-colors ${
                            copiedId === card.id
                              ? 'bg-green-500 text-white'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {copiedId === card.id ? '✓' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/card/${card.id}`}
                        target="_blank"
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium"
                      >
                        👁️ View
                      </Link>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="cursor-pointer px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {cards.length > 6 && (
          <div className="mt-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Showing 6 of {cards.length} cards
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              More cards available in your dashboard
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

