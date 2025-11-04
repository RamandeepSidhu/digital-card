'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import BusinessCardForm from '@/components/BusinessCardForm';
import { type BusinessCardFormData } from '@/lib/validation';
import { type BusinessCard } from '@/types/card';
import { useState } from 'react';
import { saveCard } from '@/lib/cardStorage';
import CardSuccessModal from '@/components/CardSuccessModal';

export default function CreateBusinessCardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<BusinessCard | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (data: BusinessCardFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create business card object
      const businessCard: BusinessCard = {
        id: nanoid(),
        type: 'business',
        style: data.style,
        data: {
          name: data.name,
          title: data.title,
          company: data.company,
          email: data.email,
          phone: data.phone,
          website: data.website || undefined,
          linkedin: data.linkedin || undefined,
          address: data.address || undefined,
          image: data.image || undefined,
        },
        createdAt: new Date(),
      };

      // Save using API endpoint
      console.log('📤 Calling API to save card...', businessCard.id);
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessCard),
      });

      console.log('📥 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create card');
      }

      const result = await response.json();
      console.log('✅ Card saved successfully:', result);
      
      // Save to localStorage for "My Cards" page
      saveCard(businessCard);
      
      // Show success modal with card details
      setCreatedCard(businessCard);
      setShowSuccessModal(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Optionally navigate to card page or stay on form
    if (createdCard) {
      router.push(`/card/${createdCard.id}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6"
          >
            <svg
              className="mr-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </a>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Create Business Card
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Fill in your business information to create your digital card
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <BusinessCardForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>

      {/* Success Modal */}
      {createdCard && (
        <CardSuccessModal
          card={createdCard}
          showModal={showSuccessModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
