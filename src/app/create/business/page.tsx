'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import BusinessCardForm from '@/components/BusinessCardForm';
import { type BusinessCardFormData } from '@/lib/validation';
import { type BusinessCard, BusinessCardStyle } from '@/types/card';
import { useState } from 'react';
import { saveCard } from '@/lib/cardStorage';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ContactDownload from '@/components/ContactDownload';
import { generateCardUrl } from '@/lib/qrGenerator';

type Step = 'form' | 'preview' | 'success';

export default function CreateBusinessCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [formData, setFormData] = useState<BusinessCardFormData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<BusinessCardStyle>('style1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<BusinessCard | null>(null);

  const handleFormSubmit = async (data: BusinessCardFormData) => {
    setFormData(data);
    setSelectedStyle(data.style || 'style1');
    setCurrentStep('preview');
  };

  const handleStyleSelect = (style: BusinessCardStyle) => {
    setSelectedStyle(style);
  };

  const handleCreateCard = async () => {
    if (!formData) return;

    setIsLoading(true);
    setError(null);

    try {
      const businessCard: BusinessCard = {
        id: nanoid(),
        type: 'business',
        style: selectedStyle,
        data: {
          name: formData.name,
          title: formData.title,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          website: formData.website || undefined,
          linkedin: formData.linkedin || undefined,
          address: formData.address || undefined,
          image: formData.image || undefined,
        },
        createdAt: new Date(),
      };

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessCard),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to create card');
      }

      const result = await response.json();
      saveCard(businessCard);
      setCreatedCard(businessCard);
      setCurrentStep('success');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      setIsLoading(false);
    }
  };

  const previewCard: BusinessCard | null = formData ? {
    id: 'preview',
    type: 'business',
    style: selectedStyle,
    data: {
      name: formData.name,
      title: formData.title,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || undefined,
      linkedin: formData.linkedin || undefined,
      address: formData.address || undefined,
      image: formData.image || undefined,
    },
    createdAt: new Date(),
  } : null;

  const styleOptions: { value: BusinessCardStyle; label: string; description: string }[] = [
    { value: 'style1', label: 'Modern Minimalist', description: 'Clean white/black design' },
    { value: 'style2', label: 'Professional Corporate', description: 'Blue accent, structured layout' },
    { value: 'style3', label: 'Creative Gradient', description: 'Colorful gradients, bold typography' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black py-12 px-4">
      <main className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => currentStep === 'form' ? router.push('/dashboard') : setCurrentStep('form')}
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {currentStep === 'form' ? 'Back to Dashboard' : 'Back to Form'}
          </button>
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Create Business Card
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {currentStep === 'form' && 'Fill in your business information to create your digital card'}
              {currentStep === 'preview' && 'Preview your card and select a design'}
              {currentStep === 'success' && 'Your card is ready!'}
            </p>
          </div>
        </div>

        {/* Step 1: Form */}
        {currentStep === 'form' && (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <BusinessCardForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {/* Step 2: Preview with Design Selection */}
        {currentStep === 'preview' && previewCard && (
          <div className="space-y-8">
            {/* Card Preview */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                Your Card Preview
              </h2>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl mb-6">
                <CardPreview card={previewCard} />
              </div>

              {/* Design Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
                  Select Card Design
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {styleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleStyleSelect(option.value)}
                      className={`relative p-4 border-2 rounded-lg transition-all text-left ${
                        selectedStyle === option.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 block">
                        {option.label}
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {option.description}
                      </span>
                      {selectedStyle === option.value && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Card Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCreateCard}
                  disabled={isLoading}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success with QR and Share */}
        {currentStep === 'success' && createdCard && (
          <div className="space-y-8">
            <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">🎉 Your Card is Ready!</h2>
              <p className="text-purple-100">Your digital card has been created successfully</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card Preview */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Card Preview
                </h3>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                  <CardPreview card={createdCard} />
                </div>
                <div className="mt-4">
                  <ContactDownload card={createdCard} variant="default" />
                </div>
              </div>

              {/* QR Code and Share */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <QRCodeDisplay 
                  card={createdCard} 
                  baseUrl={typeof window !== 'undefined' ? window.location.origin : undefined} 
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`/card/${createdCard.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                View Card Page
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-medium"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
