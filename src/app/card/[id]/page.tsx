'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Card } from '@/types/card';
import ContactDownload from '@/components/ContactDownload';
import { getCardById } from '@/lib/cardStorage';

export default function CardPage() {
  const params = useParams();
  const id = params.id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCard() {
      // Try API first (works with Vercel KV persistent storage)
      // This allows cards to work across devices
      try {
        const response = await fetch(`/api/card/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCard(data.card);
          
          // Also save to localStorage for offline access
          if (typeof window !== 'undefined' && data.card) {
            const { saveCard } = await import('@/lib/cardStorage');
            saveCard(data.card);
          }
          
          setLoading(false);
          return;
        }

        // API returned 404 - try localStorage as fallback
        if (response.status === 404 && typeof window !== 'undefined') {
          const localCard = getCardById(id);
          if (localCard) {
            setCard(localCard);
            setLoading(false);
            return;
          }
        }

        // Card not found anywhere
        if (response.status === 404) {
          const errorData = await response.json().catch(() => ({}));
          const hasRedis = errorData?.debug?.redisConnected;
          
          if (!hasRedis) {
            setError('Card not found. Redis is not connected. Please ensure KV_REST_API_URL and KV_REST_API_TOKEN are set in Vercel environment variables and redeploy the app. Note: Cards created before Redis setup will not be accessible.');
          } else {
            setError('Card not found. This card may have been created before Redis was set up, or it was created on a different device. Please create a new card after Redis is configured.');
          }
        } else {
          setError('Card not found. Please check if the card ID is correct.');
        }
      } catch (err) {
        // Network error - try localStorage as fallback
        if (typeof window !== 'undefined') {
          const localCard = getCardById(id);
          if (localCard) {
            setCard(localCard);
            setLoading(false);
            return;
          }
        }
        setError('Unable to load card. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCard();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Card Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {error || 'The card you are looking for does not exist.'}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Home
            </a>
            <a
              href="/my-cards"
              className="inline-flex items-center px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              📋 My Cards
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black py-12 px-4">
      <main className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Digital Card
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Scan the QR code or save the contact information
          </p>
        </div>

        {/* Prominent Add to Contacts Button */}
        {(card.type === 'business' || card.type === 'personal') && (
          <div className="mb-8 flex justify-center">
            <ContactDownload card={card} variant="prominent" />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card Display */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6">
                <CardPreview card={card} />
              </div>
            </div>
          </div>

          {/* QR Code and Actions */}
          <div className="flex items-center justify-center">
            <QRCodeDisplay 
              card={card} 
              baseUrl={typeof window !== 'undefined' ? window.location.origin : undefined} 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/my-cards"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-medium shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Cards
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-medium shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Create New Card
          </a>
        </div>
      </main>
    </div>
  );
}

