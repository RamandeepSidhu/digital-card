'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import BankCardForm from '@/components/BankCardForm';
import { type BankCardFormData } from '@/lib/validation';
import { type BankCard, BankCardStyle } from '@/types/card';
import { useState, useCallback } from 'react';
import { saveCard } from '@/lib/cardStorage';
import CardPreview from '@/components/CardPreview';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ContactDownload from '@/components/ContactDownload';
import Header from '@/components/Header';

type Step = 'style' | 'form' | 'preview' | 'success';

export default function CreateBankCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('style');
  const [formData, setFormData] = useState<BankCardFormData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<BankCardStyle>('style1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<BankCard | null>(null);

  const handleStyleSelect = (style: BankCardStyle) => {
    setSelectedStyle(style);
    setCurrentStep('form');
  };

  const handleFormSubmit = async (data: BankCardFormData) => {
    // Override style with selected style
    data.style = selectedStyle;
    setFormData(data);
    setCurrentStep('preview');
  };

  const handleFormChange = useCallback((data: BankCardFormData) => {
    // Update form data for live preview
    const updatedData = { ...data, style: selectedStyle };
    setFormData(updatedData);
  }, [selectedStyle]);

  const handleCreateCard = async () => {
    if (!formData) return;

    setIsLoading(true);
    setError(null);

    try {
      const bankCard: BankCard | any = {
        id: nanoid(),
        type: 'bank',
        style: selectedStyle,
        data: {
          accountHolder: formData.accountHolder,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode || undefined,
          routingNumber: formData.routingNumber || undefined,
          upiId: formData.upiId || undefined,
          logo: formData.logo || undefined,
        },
        createdAt: new Date(),
      };

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankCard),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to create card');
      }

      const result = await response.json();
      saveCard(bankCard);
      setCreatedCard(bankCard);
      setCurrentStep('success');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      setIsLoading(false);
    }
  };

  const previewCard: BankCard | any = formData ? {
    id: 'preview',
    type: 'bank',
    style: selectedStyle,
    data: {
      accountHolder: formData.accountHolder || 'Account Holder',
      bankName: formData.bankName || 'Bank Name',
      accountNumber: formData.accountNumber || '1234567890',
      ifscCode: formData.ifscCode || undefined,
      routingNumber: formData.routingNumber || undefined,
      upiId: formData.upiId || undefined,
      logo: formData.logo || undefined,
    },
    createdAt: new Date(),
  } : null;

  const styleOptions: { value: BankCardStyle; label: string; description: string }[] = [
    { value: 'style1', label: 'Classic Bank', description: 'Traditional card-like appearance' },
    { value: 'style2', label: 'Glass Morphism', description: 'Frosted glass effect, modern' },
    { value: 'style3', label: 'Dark Mode', description: 'Sleek dark theme, neon accents' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black">
      <Header />
      <main className="w-full max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          {/* Breadcrumb Navigation with Action Buttons */}
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
                {currentStep !== 'style' && (
                  <>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <button
                        onClick={() => setCurrentStep('style')}
                        className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                      >
                        Style Selection
                      </button>
                    </li>
                  </>
                )}
                {currentStep === 'form' && (
                  <>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">Form</span>
                    </li>
                  </>
                )}
                {currentStep === 'preview' && (
                  <>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <button
                        onClick={() => setCurrentStep('style')}
                        className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                      >
                        Style Selection
                      </button>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <button
                        onClick={() => setCurrentStep('form')}
                        className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                      >
                        Form
                      </button>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">Preview</span>
                    </li>
                  </>
                )}
                {currentStep === 'success' && (
                  <>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li>
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">Success</span>
                    </li>
                  </>
                )}
                {currentStep === 'style' && (
                  <>
                    <li>
                      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </li>
                    <li className="text-zinc-900 dark:text-zinc-100 font-medium">Style Selection</li>
                  </>
                )}
              </ol>
            </nav>
            
            {/* Action Buttons for Success Step - Aligned with Breadcrumb */}
            {currentStep === 'success' && createdCard && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/card/${createdCard.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm text-sm whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Card Page
                </Link>
              </div>
            )}
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Create Card
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {currentStep === 'style' && 'Choose your card design style'}
              {currentStep === 'form' && 'Fill in your payment information'}
              {currentStep === 'preview' && 'Preview your card before creating'}
              {currentStep === 'success' && 'Your card is ready!'}
            </p>
          </div>
        </div>

        {/* Step 1: Style Selection */}
        {currentStep === 'style' && (
          <div className="">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styleOptions.map((option) => {
                const previewCard: BankCard | any = {
                  id: 'preview',
                  type: 'bank',
                  style: option.value,
                  data: {
                    accountHolder: 'John Doe',
                    bankName: 'Bank Name',
                    accountNumber: '1234567890',
                    upiId: 'john@paytm',
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
              <BankCardForm 
                onSubmit={handleFormSubmit} 
                isLoading={false} 
                defaultStyle={selectedStyle}
                onFormChange={handleFormChange}
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
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <QRCodeDisplay 
                  card={createdCard} 
                  baseUrl={typeof window !== 'undefined' ? window.location.origin : undefined} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
