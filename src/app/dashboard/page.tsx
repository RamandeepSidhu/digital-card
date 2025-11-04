"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/types/card";
import { getAllCards } from "@/lib/cardStorage";
import CardPreview from "@/components/CardPreview";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

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
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                DC
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Cards</h1>
            </div>
            <div className="flex items-center gap-3">
              {cards.length > 0 && (
                <Link
                  href="/create"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Card
                </Link>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {session.user?.name?.charAt(0).toUpperCase() ||
                    session.user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{session.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
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
                const cardName =
                  card.type === "business"
                    ? card.data.name
                    : card.type === "personal"
                    ? card.data.name
                    : card.data.accountHolder;

                return (
                  <Link
                    key={card.id}
                    href={`/card/${card.id}`}
                    className="group block"
                  >
                      <div className="hover:shadow-xl transition-all duration-300 rounded-4xl  border-gray-200">
                        <CardPreview card={card} />
                    </div>
                  </Link>
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

      </main>
    </div>
  );
}
