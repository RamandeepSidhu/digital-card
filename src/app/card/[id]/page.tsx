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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-12 px-4">
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
            {(card.type === 'business' || card.type === 'personal') && (
              <div className="w-full max-w-sm">
                <ContactDownload card={card} variant="prominent" />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Cards
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Card
          </a>
        </div>
      </main>
    </div>
  );
}

