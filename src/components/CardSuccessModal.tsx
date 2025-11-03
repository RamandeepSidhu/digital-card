'use client';

import { Card } from '@/types/card';
import QRCodeDisplay from './QRCodeDisplay';
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
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">🎉 Your Card is Ready!</h2>
              <p className="text-purple-100 text-sm">Save or share this link to access your card anytime</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2"
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
          {/* Card Link Section - Very Prominent */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700">
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
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
            >
              👁️ View Card Page
            </a>
            <a
              href="/my-cards"
              className="px-4 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-center font-medium"
            >
              📋 My Cards
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

