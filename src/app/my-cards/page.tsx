'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/types/card';
import { getAllCards, deleteCard } from '@/lib/cardStorage';
import { generateCardUrl } from '@/lib/qrGenerator';
import CardPreview from '@/components/CardPreview';
import Link from 'next/link';
import Header from '@/components/Header';

export default function MyCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const handleDeleteClick = (cardId: string) => {
    setDeleteConfirmId(cardId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    
    const cardId = deleteConfirmId;
    setDeleteConfirmId(null);
    
    try {
      // Delete from API (Redis)
      await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });
      
      // Delete from localStorage
      const success = deleteCard(cardId);
      
      if (success) {
        // Refresh cards list
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);
        alert('Card deleted successfully!');
      } else {
        alert('Failed to delete card. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
      // Still try to delete from localStorage
      const success = deleteCard(cardId);
      if (success) {
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);
        alert('Card deleted successfully!');
      } else {
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">My Cards</span>
            </li>
          </ol>
        </nav>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              My Cards
            </h1>
            <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
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
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Cards Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first digital card to get started!
            </p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Create a Card
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                  className="relative group"
                  style={{ overflow: 'visible' }}
                >
                  {/* Card Preview Container */}
                  <div className="relative" style={{ overflow: 'visible' }}>
                    {/* Card Preview */}
                    <div className="relative">
                      <Link href={`/card/${card.id}`} className="block">
                        <CardPreview card={card} />
                      </Link>
                    </div>
                    
                    {/* Action Buttons - Edit and Remove - Positioned on card */}
                    {!deleteConfirmId && (
                      <div className="absolute top-2 right-2 flex gap-2 z-20">
                        {/* Edit Button */}
                        <Link
                          href={`/edit/${card.type}/${card.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-lg flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100"
                          title="Edit Card"
                          onMouseEnter={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(card.id);
                          }}
                          className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-lg flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100"
                          title="Remove Card"
                          onMouseEnter={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
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

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-purple-50/80 to-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Card
                  </h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete this card?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                This action cannot be undone. The card will be permanently deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

