'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import PersonalCardForm from '@/components/PersonalCardForm';
import { type PersonalCardFormData } from '@/lib/validation';
import { type PersonalCard, PersonalCardStyle } from '@/types/card';
import { useState } from 'react';
import { saveCard } from '@/lib/cardStorage';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ContactDownload from '@/components/ContactDownload';
import Header from '@/components/Header';

type Step = 'style' | 'form' | 'preview' | 'success';

export default function CreatePersonalCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('style');
  const [formData, setFormData] = useState<PersonalCardFormData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PersonalCardStyle>('style1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<PersonalCard | null>(null);

  const handleStyleSelect = (style: PersonalCardStyle) => {
    setSelectedStyle(style);
    setCurrentStep('form');
  };

  const handleFormSubmit = async (data: PersonalCardFormData) => {
    // Override style with selected style
    data.style = selectedStyle;
    setFormData(data);
    setCurrentStep('preview');
  };

  const handleFormChange = (data: PersonalCardFormData) => {
    // Update form data for live preview
    data.style = selectedStyle;
    setFormData(data);
  };

  const handleCreateCard = async () => {
    if (!formData) return;

    setIsLoading(true);
    setError(null);

    try {
      const personalCard: PersonalCard = {
        id: nanoid(),
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create card');
      }

      const result = await response.json();
      saveCard(personalCard);
      setCreatedCard(personalCard);
      setCurrentStep('success');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      setIsLoading(false);
    }
  };

  const previewCard: PersonalCard | null = formData ? {
    id: 'preview',
    type: 'personal',
    style: selectedStyle,
    data: {
      name: formData.name || 'Your Name',
      email: formData.email || 'your.email@example.com',
      phone: formData.phone || '+1 (555) 123-4567',
      address: formData.address || undefined,
      birthday: formData.birthday || undefined,
      website: formData.website || undefined,
      image: formData.image || undefined,
      socialMedia: formData.socialMedia || undefined,
    },
    createdAt: new Date(),
  } : null;

  const styleOptions: { value: PersonalCardStyle; label: string; description: string }[] = [
    { value: 'style1', label: 'Modern Blue', description: 'Clean blue gradient with avatar' },
    { value: 'style2', label: 'Dark Premium', description: 'Elegant dark theme with accents' },
    { value: 'style3', label: 'Classic White', description: 'Timeless white design' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black">
      <Header />
      <main className="w-full max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          {currentStep !== 'style' && (
            <button
              onClick={() => {
                if (currentStep === 'form') {
                  setCurrentStep('style');
                } else if (currentStep === 'preview') {
                  setCurrentStep('form');
                }
              }}
              className="cursor-pointer inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6 group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {currentStep === 'form' && 'Back to Style Selection'}
              {currentStep === 'preview' && 'Back to Form'}
            </button>
          )}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Create Card
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {currentStep === 'style' && 'Choose your card design style'}
              {currentStep === 'form' && 'Fill in your personal information'}
              {currentStep === 'preview' && 'Preview your card before creating'}
              {currentStep === 'success' && 'Your card is ready!'}
            </p>
          </div>
        </div>

        {/* Step 1: Style Selection */}
        {currentStep === 'style' && (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
              Choose Your Card Style
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styleOptions.map((option) => {
                const previewCard: PersonalCard = {
                  id: 'preview',
                  type: 'personal',
                  style: option.value,
                  data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1 (555) 123-4567',
                  },
                  createdAt: new Date(),
                };

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStyleSelect(option.value)}
                    className={`cursor-pointer relative p-6 border-2 rounded-2xl transition-all text-left hover:shadow-xl group overflow-hidden ${
                      selectedStyle === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-600 hover:scale-102'
                    }`}
                  >
                    {selectedStyle === option.value && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    
                    {/* Card Preview */}
                    <div className={`mb-4 transition-transform ${selectedStyle === option.value ? 'scale-100' : 'scale-95 group-hover:scale-100'}`}>
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 transform rotate-3 shadow-md" style={{ height: '425px', maxHeight: '425px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px' }}>
                          <div style={{ transform: 'scale(0.85)', width: '100%', maxWidth: '100%' }}>
                            <CardPreview card={previewCard} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Style Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                        {option.label}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                        {option.description}
                      </p>
                      <div className={`inline-flex items-center gap-2 text-sm font-medium transition-all ${
                        selectedStyle === option.value
                          ? 'text-purple-600 dark:text-purple-400 opacity-100'
                          : 'text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100'
                      }`}>
                        <span>{selectedStyle === option.value ? 'Selected' : 'Select Style'}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Form with Live Preview */}
        {currentStep === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Form */}
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
              />
            </div>

            {/* Right Side - Live Preview */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700 sticky top-4 h-fit">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
                Live Preview
              </h3>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl flex items-center justify-center min-h-[500px]">
                {previewCard ? (
                  <CardPreview card={previewCard} />
                ) : (
                  <div className="text-zinc-400 text-center">
                    <p>Fill in the form to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 'preview' && previewCard && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Your Card Preview
                </h2>
                <button
                  onClick={() => setCurrentStep('style')}
                  className="cursor-pointer text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  Change Style
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl mb-6">
                <CardPreview card={previewCard} />
              </div>

              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Selected Style:
                </p>
                <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {styleOptions.find(opt => opt.value === selectedStyle)?.label}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <button
                  onClick={() => setCurrentStep('form')}
                  className="cursor-pointer px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleCreateCard}
                  disabled={isLoading}
                  className="cursor-pointer px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 'success' && createdCard && (
          <div className="space-y-8">
            <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">🎉 Your Card is Ready!</h2>
              <p className="text-purple-100">Your digital card has been created successfully</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <QRCodeDisplay 
                  card={createdCard} 
                  baseUrl={typeof window !== 'undefined' ? window.location.origin : undefined} 
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`/card/${createdCard.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
              >
                View Card Page
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-medium cursor-pointer"
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
