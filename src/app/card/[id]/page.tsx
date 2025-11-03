'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Card } from '@/types/card';
import ContactDownload from '@/components/ContactDownload';
import { BusinessCard } from '@/types/card';
import { getCardById } from '@/lib/cardStorage';

export default function CardPage() {
  const params = useParams();
  const id = params.id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCard() {
      try {
        // First, try to fetch from API (server-side storage)
        const response = await fetch(`/api/card/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCard(data.card);
          setLoading(false);
          return;
        }

        // If API returns 404, check localStorage as fallback
        if (response.status === 404) {
          if (typeof window !== 'undefined') {
            const localCard = getCardById(id);
            if (localCard) {
              setCard(localCard);
              setLoading(false);
              return;
            }
          }
          setError('Card not found');
        } else {
          setError('Failed to load card');
        }
      } catch (err) {
        // If fetch fails entirely, check localStorage
        if (typeof window !== 'undefined') {
          const localCard = getCardById(id);
          if (localCard) {
            setCard(localCard);
            setLoading(false);
            return;
          }
        }
        setError('Failed to load card');
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
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Card Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {error || 'The card you are looking for does not exist.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black py-12 px-4">
      <main className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Digital Card
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Scan the QR code or save the contact information
          <