'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/types/card';
import { getAllCards } from '@/lib/cardStorage';
import CardPreview from '@/components/CardPreview';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const response = await fetch('/api/cards');
        
        if (response.ok) {
          const data = await response.json();
          const dbCards: Card[] = data.cards || [];
          const formattedCards = dbCards.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
          }));

          const localCards = getAllCards();
          const cardMap = new Map<string, Card>();
          localCards.forEach(card => cardMap.set(card.id, card));
          formattedCards.forEach(card => cardMap.set(card.id, card));

          const allCards = Array.from(cardMap.values());
          allCards.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          setCards(allCards);
        } else {
          const localCards = getAllCards();
          setCards(localCards);
        }
      } catch (err) {
        const localCards = getAllCards();
        setCards(localCards);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchCards();
    }
  }, [status]);

  if (status === 'loading' || loading) {
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
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-zinc-900 dark:via-purple-950 dark:to-zinc-950">
      {/* Bubble Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-white/20 dark:border-zinc-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                DC
              </div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                My Cards
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-zinc-800/50 rounded-full backdrop-blur-sm">
                <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 hidden sm:inline font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white/50 dark:bg-zinc-800/50 rounded-full backdrop-blur-sm transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cards Display */}
        {cards.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Your Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cards.slice(0, 6).map((card, index) => (
                <Link
                  key={card.id}
                  href={`/card/${card.id}`}
                  className="group"
                  style={{ animation: `floatUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/50 dark:border-zinc-700/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                    <div className="p-4 bg-linear-to-br from-purple-50/50 to-blue-50/50 dark:from-zinc-900 dark:to-zinc-950">
                      <CardPreview card={card} />
                    </div>
                    <div className="p-4 border-t border-white/20 dark:border-zinc-700/50">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300">
                          {card.type === 'business' ? '💼 Business' : card.type === 'personal' ? '👤 Personal' : '🏦 Bank'}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {cards.length > 6 && (
              <div className="text-center">
                <Link
                  href="/my-cards"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl text-zinc-900 dark:text-zinc-100 rounded-full hover:shadow-xl transition-all font-medium"
                >
                  <span>View All {cards.length} Cards</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-12 text-center">
            <div className="max-w-md mx-auto bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 dark:border-zinc-700/50">
              <div className="text-7xl mb-6 animate-bounce">📇</div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No Cards Yet</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Create your first digital card to get started!
              </p>
            </div>
          </div>
        )}

        {/* Bubble Card Type Selector */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Create New Card
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Choose a card type to get started
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
              <Link
                href="/create/business"
                className="group relative"
                style={{ animation: 'floatUp 0.6s ease-out 0.1s both' }}
              >
                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-[2.5rem] p-10 border-4 border-transparent hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-center relative overflow-hidden">
                  {/* Bubble background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 dark:bg-purple-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/30 dark:bg-pink-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform">
                      💼
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Business Card</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Professional contact card with company details, social links, and more
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-sm font-semibold text-purple-700 dark:text-purple-300">
                      <span>Create Now</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/create/personal"
                className="group relative"
                style={{ animation: 'floatUp 0.6s ease-out 0.2s both' }}
              >
                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-[2.5rem] p-10 border-4 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200/30 dark:bg-cyan-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform">
                      👤
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Personal Card</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Personal contact card with social media links and profile information
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300">
                      <span>Create Now</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/create/bank"
                className="group relative"
                style={{ animation: 'floatUp 0.6s ease-out 0.3s both' }}
              >
                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-[2.5rem] p-10 border-4 border-transparent hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-xl group-hover:scale-110 transition-transform">
                      🏦
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Bank Card</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Secure payment information card with account details and UPI ID
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full text-sm font-semibold text-green-700 dark:text-green-300">
                      <span>Create Now</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
