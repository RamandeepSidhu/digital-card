'use client';

import { Card} from '@/types/card';
import { generateVCard, generatePersonalVCard, downloadVCard } from '@/lib/qrGenerator';
import { useState } from 'react';

interface ContactDownloadProps {
  card: Card;
  variant?: 'default' | 'prominent';
}

export default function ContactDownload({ card, variant = 'default' }: ContactDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let vcardContent: string;
      let filename: string;

      if (card.type === 'business') {
        vcardContent = generateVCard(card.data);
        filename = `${card.data.name.replace(/\s+/g, '-')}-contact.vcf`;
      } else if (card.type === 'personal') {
        vcardContent = generatePersonalVCard(card.data);
        filename = `${card.data.name.replace(/\s+/g, '-')}-contact.vcf`;
      } else {
        // Bank cards don't have contact info
        return;
      }

      downloadVCard(vcardContent, filename);
      
      // Small delay for better UX
      setTimeout(() => setDownloading(false), 500);
    } catch (error) {
      console.error('Failed to download contact:', error);
      setDownloading(false);
    }
  };

  // Don't show for bank cards
  if (card.type === 'bank') {
    return null;
  }

  const baseClasses = "cursor-pointer flex items-center justify-center gap-2 px-4  py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full";
  const prominentClasses = "cursor-pointer flex items-center gap-3 px-4 py-2 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-semibold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={variant === 'prominent' ? prominentClasses : baseClasses}
    >
      <svg className={`${variant === 'prominent' ? 'w-6 h-6' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      <span>{downloading ? 'Adding...' : 'Add to Contacts'}</span>
    </button>
  );
}

