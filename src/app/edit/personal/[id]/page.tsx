'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PersonalCardForm from '@/components/PersonalCardForm';
import { type PersonalCardFormData } from '@/lib/validation';
import { type PersonalCard, PersonalCardStyle } from '@/types/card';
import { useState, useCallback, useEffect } from 'react';
import { saveCard, getCardById } from '@/lib/cardStorage';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import Header from '@/components/Header';

type Step = 'form' | 'preview' | 'success';

export default function EditPersonalCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [formData, setFormData] = useState<PersonalCardFormData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PersonalCardStyle>('style1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedCard, setUpdatedCard] = useState<PersonalCard | null>(null);
  const [loadingCard, setLoadingCard] = useState(true);

  useEffect(() => {
    async function loadCard() {
      try {
        const response = await fetch(`/api/card/${cardId}`);
        if (response.ok) {
          const data = await response.json();
          const card = data.card as PersonalCard;
          setSelectedStyle(card.style);
          
          const formData: PersonalCardFormData = {
            name: card.data.name,
            email: card.data.email,
            phone: card.data.phone,
            address: card.data.address || '',
            birthday: card.data.birthday || '',
            website: card.data.website || '',
            image: card.data.image || '',
            socialMedia: card.data.socialMedia || {},
            style: card.style,
          };
          setFormData(formData);
          setLoadingCard(false);
          return;
        }

        const localCard = getCardById(cardId);
        if (localCard && localCard.type === 'personal') {
          const card = localCard as PersonalCard;
          setSelectedStyle(card.style);
          
          const formData: PersonalCardFormData = {
            name: card.data.name,
            email: card.data.email,
            phone: card.data.phone,
            address: card.data.address || '',
            birthday: card.data.birthday || '',
            website: card.data.website || '',
            image: card.data.image || '',
            socialMedia: card.data.socialMedia || {},
            style: card.style,
          };
          setFormData(formData);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('Error loading card:', err);
        setError('Failed to load card');
      } finally {
        setLoadingCard(false);
      }
    }

    if (cardId) {
      loadCard();
    }
  }, [cardId]);

  const handleFormSubmit = async (data: PersonalCardFormData) => {
    const updatedData = { ...data, style: selectedStyle as typeof data.style };
    setFormData(updatedData);
    setCurrentStep('preview');
  };

  const handleFormChange = useCallback((data: PersonalCardFormData) => {
    const updatedData = { ...data, style: selectedStyle as typeof data.style };
    setFormData(updatedData);
  }, [selectedStyle]);

  const handleUpdateCard = async () => {
    if (!formData || !cardId) return;

    setIsLoading(true);
    setError(null);

    try {
      const personalCard: PersonalCard | any = {
        id: cardId,
        type: 'personal',
        style: selectedStyle,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || undefined,
          birthday: formData.birthday || undefined,
          website: formData.website || undefined,
          image: formData.image || undefined,
          socialMedia: {
            instagram: formData.socialMedia?.instagram || undefined,
            twitter: formData.socialMedia?.twitter || undefined,
            facebook: formData.socialMedia?.facebook || undefined,
            linkedin: formData.socialMedia?.linkedin || undefined,
          },
        },
        createdAt: new Date(),
      };

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalCard),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update card');
      }

      saveCard(personalCard);
      setUpdatedCard(personalCard);
      setCurrentStep('success');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
      setIsLoading(false);
    }
  };

  const previewCard: PersonalCard | any = formData ? {
    id: cardId || 'preview',
    type: 'personal',
    style: selectedStyle,
    data: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
      birthday: formData.birthday || undefined,
      website: formData.website || undefined,
      image: formData.image || undefined,
      socialMedia: formData.socialMedia || undefined,
    },
    createdAt: new Date(),
  } : null;

  if (loadingCard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Card Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black">
      <Header />
      <main className="w-full max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
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
                    href={`/card/${cardId}`}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Card
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">Edit</span>
                </li>
              </ol>
            </nav>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Edit Personal Card
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {currentStep === 'form' && 'Update your personal information'}
              {currentStep === 'preview' && 'Preview your changes'}
              {currentStep === 'success' && 'Your card has been updated!'}
            </p>
          </div>
        </div>

        {currentStep === 'form' && formData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <PersonalCardForm 
                onSubmit={handleFormSubmit} 
                isLoading={false} 
                defaultStyle={selectedStyle}
                onFormChange={handleFormChange}
                defaultValues={formData}
              />
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700 sticky top-4 h-fit">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
                Live Preview
              </h3>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl flex items-center justify-center min-h-[500px]">
                <CardPreview card={{
                  id: 'live-preview',
                  type: 'personal',
                  style: selectedStyle,
                  data: {
                    name: formData?.name || 'Your Name',
                    email: formData?.email || 'your.email@example.com',
                    phone: formData?.phone || '+1 (555) 123-4567',
                    address: formData?.address || undefined,
                    birthday: formData?.birthday || undefined,
                    website: formData?.website || undefined,
                    image: formData?.image || undefined,
                    socialMedia: formData?.socialMedia || undefined,
                  },
                  createdAt: new Date(),
                }} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'preview' && previewCard && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                Your Updated Card Preview
              </h2>
              
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl mb-6">
                <CardPreview card={previewCard} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <button
                  onClick={() => setCurrentStep('form')}
                  className="cursor-pointer px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleUpdateCard}
                  disabled={isLoading}
                  className="cursor-pointer px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Updating...' : 'Update Card'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'success' && updatedCard && (
          <div className="space-y-8">
            <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">✅ Card Updated!</h2>
              <p className="text-purple-100">Your digital card has been updated successfully</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Updated Card Preview
                </h3>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                  <CardPreview card={updatedCard} />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <QRCodeDisplay 
                  card={updatedCard} 
                  baseUrl={typeof window !== 'undefined' ? window.location.origin : undefined} 
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href={`/card/${cardId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                View Card
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

