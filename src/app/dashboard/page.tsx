"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/types/card";
import { getAllCards, deleteCard } from "@/lib/cardStorage";
import CardPreview from "@/components/CardPreview";
import Link from "next/link";
import Header from "@/components/Header";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const response = await fetch("/api/cards");

        if (response.ok) {
          const data = await response.json();
          const dbCards: Card[] = data.cards || [];
          const formattedCards = dbCards.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
          }));

          const localCards = getAllCards();
          const cardMap = new Map<string, Card>();
          localCards.forEach((card) => cardMap.set(card.id, card));
          formattedCards.forEach((card) => cardMap.set(card.id, card));

          const allCards = Array.from(cardMap.values());
          // Filter out example/dummy/test cards - only show cards with real data from API
          const realCards = allCards.filter(
            (card) => 
              !card.id.startsWith('example-') && 
              !card.id.startsWith('test-') && 
              card.data
          );
          realCards.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          setCards(realCards);

          // If user has no cards, redirect to onboarding
          if (realCards.length === 0) {
            router.push('/onboarding');
            return;
          }
        } else {
          const localCards = getAllCards();
          // Filter out example/dummy/test cards - only show cards with real data
          const realCards = localCards.filter(
            (card) => 
              !card.id.startsWith('example-') && 
              !card.id.startsWith('test-') && 
              card.data
          );
          setCards(realCards);

          // If user has no cards, redirect to onboarding
          if (realCards.length === 0) {
            router.push('/onboarding');
            return;
          }
        }
      } catch (err) {
        const localCards = getAllCards();
        // Filter out example/dummy/test cards - only show cards with real data
        const realCards = localCards.filter(
          (card) => 
            !card.id.startsWith('example-') && 
            !card.id.startsWith('test-') && 
            card.data
        );
        setCards(realCards);

        // If user has no cards, redirect to onboarding
        if (realCards.length === 0) {
          router.push('/onboarding');
          return;
        }
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchCards();
    }
  }, [status, router]);

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
      } 
    } catch (err) {
      console.error('Error deleting card:', err);
      // Still try to delete from localStorage
      const success = deleteCard(cardId);
      if (success) {
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-zinc-900 dark:via-purple-950 dark:to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">Dashboard</span>
            </li>
          </ol>
        </nav>
        {/* Welcome Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your cards page!
          </h2>
        </div>

        {/* Cards Display */}
        {cards.length > 0 ? (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
              {cards.map((card, index) => {

                return (
                  <div 
                    key={card.id} 
                    className="relative group"
                    style={{ 
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    <div className="relative" style={{ overflow: 'visible' }}>
                      <Link href={`/card/${card.id}`} className="block">
                        <CardPreview card={card} />
                      </Link>
                      {/* Delete Button - Shows on hover, hidden when modal is open */}
                      {!deleteConfirmId && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(card.id);
                          }}
                          className="absolute top-3 right-3 p-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300"
                          title="Delete Card"
                          style={{ 
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 10000,
                            pointerEvents: 'auto'
                          }}
                          onMouseEnter={(e) => e.stopPropagation()}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="text-6xl mb-4">📇</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Create Your First Card
                </h3>
                <p className="text-gray-600 mb-8">
                  Choose a card type to get started
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link
                  href="/create/business"
                  className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all text-center"
                >
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Business Card
                  </h3>
                  <p className="text-sm text-gray-600">
                    Professional contact card
                  </p>
                </Link>

                <Link
                  href="/create/personal"
                  className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center"
                >
                  <div className="text-4xl mb-3">👤</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Personal Card
                  </h3>
                  <p className="text-sm text-gray-600">Personal contact card</p>
                </Link>

                <Link
                  href="/create/bank"
                  className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all text-center"
                >
                  <div className="text-4xl mb-3">🏦</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Bank Card
                  </h3>
                  <p className="text-sm text-gray-600">
                    Payment information card
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-linear-to-br from-white/80 via-purple-50/80 to-white/80 dark:from-zinc-900/80 dark:via-purple-900/20 dark:to-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Delete Card
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Are you sure you want to delete this card?
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                This action cannot be undone. The card will be permanently deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors font-medium"
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
