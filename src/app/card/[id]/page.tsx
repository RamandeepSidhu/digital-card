'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Card } from '@/types/card';
import ContactDownload from '@/components/ContactDownload';
import { getCardById, deleteCard } from '@/lib/cardStorage';
import Header from '@/components/Header';
import Link from 'next/link';

export default function CardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const handleDeleteClick = () => {
    setDeleteConfirmId(id);
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
        // Redirect to dashboard after successful deletion
        router.push('/dashboard');
      } else {
        // Still redirect even if localStorage deletion fails
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
      // Still try to delete from localStorage
      const success = deleteCard(cardId);
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

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
          
          <div className="flex items-center gap-3">
            {!deleteConfirmId && (
              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center gap-2 px-4 h-[40px] py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Card
              </button>
            )}
            <Link
              href={`/edit/${card.type}/${card.id}`}
              className="inline-flex items-center gap-2 px-4 h-[40px] py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Card
            </Link>
            {(card.type === 'business' || card.type === 'personal') && (
              <div className="w-full max-w-sm">
                <ContactDownload card={card} variant="default" />
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

