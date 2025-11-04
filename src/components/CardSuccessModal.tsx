'use client';

import { Card } from '@/types/card';
import QRCodeDisplay from './QRCodeDisplay';
import CardPreview from './CardPreview';
import ContactDownload from './ContactDownload';
import { generateCardUrl } from '@/lib/qrGenerator';
import { useState, useEffect } from 'react';

interface CardSuccessModalProps {
  card: Card;
  onClose?: () => void;
  showModal?: boolean;
}

export default function CardSuccessModal({ card, onClose, showModal = true }: CardSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const cardUrl = generateCardUrl(card.id, baseUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Banner with Profile */}
        <div className="relative bg-linear-to-r from-purple-600 via-purple-700 to-purple-600 p-6 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Card Preview Mini */}
              <div className="hidden sm:block transform scale-75 origin-left">
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-2">
                  <CardPreview card={card} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">🎉 Your Card is Ready!</h2>
                <p className="text-purple-100 text-sm sm:text-base">Your digital card has been created successfully</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Card Preview Banner */}
          <div className="bg-linear-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <CardPreview card={card} />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {card.type === 'business' && card.data.name}
                    {card.type === 'personal' && card.data.name}
                    {card.type === 'bank' && card.data.accountHolder}
                  </h3>
                  {card.type === 'business' && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {card.data.title} at {card.data.company}
                    </p>
                  )}
                </div>
                {/* Add to Contacts Button */}
                {(card.type === 'business' || card.type === 'personal') && (
                  <ContactDownload card={card} variant="default" />
                )}
              </div>
            </div>
          </div>

          {/* Card Link Section */}
          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              📎 Your Card Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cardUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-purple-300 dark:border-purple-600 rounded-lg text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCopyLink}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              🔗 Bookmark this link or save it to access your card later
            </p>
          </div>

          {/* QR Code Display */}
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl">
            <QRCodeDisplay card={card} baseUrl={baseUrl} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`/card/${card.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Card Page
            </a>
            <a
              href="/my-cards"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-center font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Cards
            </a>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>💡 Tip:</strong> This link will work forever! Save it to your bookmarks or share it with others. 
              You can also access all your cards from the "My Cards" page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

