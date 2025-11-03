'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import BankCardForm from '@/components/BankCardForm';
import { type BankCardFormData } from '@/lib/validation';
import { type BankCard } from '@/types/card';
import { useState } from 'react';
import { saveCard } from '@/lib/cardStorage';
import CardSuccessModal from '@/components/CardSuccessModal';

export default function CreateBankCardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<BankCard | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (data: BankCardFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create bank card object
      const bankCard: BankCard = {
        id: nanoid(),
        type: 'bank',
        style: data.style,
        data: {
          accountHolder: data.accountHolder,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode || undefined,
          routingNumber: data.routingNumber || undefined,
          upiId: data.upiId || undefined,
        },
        createdAt: new Date(),
      };

      // Save using API endpoint
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankCard),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create card');
      }

      const result = await response.json();
      
      // Save to localStorage for "My Cards" page
      saveCard(bankCard);
      
      // Show success modal with card details
      setCreatedCard(bankCard);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
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
            Create Bank Card
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Fill in your payment details to create your digital bank card
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <BankCardForm onSubmit={handleSubmit} isLoading={isLoading} />
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
