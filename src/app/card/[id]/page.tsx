'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Card } from '@/types/card';
import ContactDownload from '@/components/ContactDownload';
import { getCardById } from '@/lib/cardStorage';
import Header from '@/components/Header';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Card Not Found
          </h1>
          <p className="text-gray-600 mb-6">
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
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              My Cards
            </a>
          </div>
        </div>
      </div>
    );
  }

  const cardName = card.type === 'business' 
    ? card.data.name 
    : card.type === 'personal' 
    ? card.data.name 
    : card.data.accountHolder;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-12 px-4">
        {/* Breadcrumb Navigation with Action Button */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link
                  href="/my-cards"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  My Cards
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[200px]">
                {cardName || 'Card'}
              </li>
            </ol>
          </nav>
          
          <div
            className="inline-flex items-center text-sm "
          >
            {(card.type === 'business' || card.type === 'personal') && (
              <div className="w-full max-w-sm">
                <ContactDownload card={card} />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card Display */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <CardPreview card={card} />
            </div>
          </div>

          {/* QR Code and Actions */}
          <div className="flex flex-col items-center justify-center gap-6">
            <QRCodeDisplay 
              card={card} 
              baseUrl={typeof window !== 'undefined' ? window.location.origin : undefined} 
            />
            
            {/* Prominent Add to Contacts Button */}
           
          </div>
        </div>
      </main>
    </div>
  );
}

