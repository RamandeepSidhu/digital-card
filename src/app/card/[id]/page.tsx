'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Card } from '@/types/card';
import ContactDownload from '@/components/ContactDownload';
import Header from '@/components/Header';
import Link from 'next/link';

export default function CardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Check if current user owns this card
  const isOwner = session?.user?.id && card?.userId === session.user.id;

  useEffect(() => {
    async function fetchCard() {
      // Fetch card from API only (no localStorage fallback)
      console.log(`[Card Detail Page] Fetching card with ID: ${id}`);
      try {
        const apiUrl = `/api/card/${id}`;
        console.log(`[Card Detail Page] Calling API: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        
        console.log(`[Card Detail Page] API response status: ${response.status}, ok: ${response.ok}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            const errorData = await response.json().catch(() => ({}));
            const hasRedis = errorData?.debug?.redisConnected;
            
            if (!hasRedis) {
              setError('Card not found. Redis is not connected. Please ensure KV_REST_API_URL and KV_REST_API_TOKEN are set in Vercel environment variables and redeploy the app.');
            } else {
              setError('Card not found. This card may have been deleted or does not exist.');
            }
          } else {
            setError('Failed to load card. Please try again later.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (!data.card) {
          setError('Card data is invalid. Please try again.');
          setLoading(false);
          return;
        }

        // Debug: Log image data
        if (data.card && data.card.type === 'business' && data.card.data) {
          const hasImage = data.card.data.image && typeof data.card.data.image === 'string' && data.card.data.image.trim() !== '';
          console.log(`[Card Detail Page] Image data: ${hasImage ? 'Present' : 'Missing'}, type: ${typeof data.card.data.image}, length: ${data.card.data.image?.length || 0}`);
          console.log(`[Card Detail Page] Full card data structure:`, {
            hasData: !!data.card.data,
            hasImage: !!data.card.data.image,
            imageType: typeof data.card.data.image,
            imagePreview: typeof data.card.data.image === 'string' ? data.card.data.image.substring(0, 50) + '...' : 'N/A'
          });
        }
        
        // Ensure card data structure is preserved
        const cardToSet = {
          ...data.card,
          data: {
            ...data.card.data,
            // Explicitly preserve image if it exists
            image: data.card.data?.image || undefined,
          },
        };
        
        console.log(`[Card Detail Page] Setting card with image:`, {
          hasImage: !!cardToSet.data?.image,
          imageType: typeof cardToSet.data?.image,
        });
        
        setCard(cardToSet);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Unable to load card. Please check your internet connection and try again.');
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
      // Delete from API (Redis) only
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Redirect to dashboard after successful deletion
        router.push('/dashboard');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to delete card. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Unable to delete card. Please check your internet connection and try again.');
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
            {/* Edit and Remove buttons hidden on QR page */}
            {/* Only show Add to Contacts button for business/personal cards */}
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
              {card && (
                  <CardPreview card={card} />
              )}
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

