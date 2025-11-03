'use client';

import { BusinessCard } from '@/types/card';
import { generateVCard, downloadVCard } from '@/lib/qrGenerator';

interface ContactDownloadProps {
  card: BusinessCard;
}

export default function ContactDownload({ card }: ContactDownloadProps) {
  const handleDownload = () => {
    const vcardContent = generateVCard(card.data);
    const filename = `${card.data.name.replace(/\s+/g, '-')}-contact.vcf`;
    downloadVCard(vcardContent, filename);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium shadow-lg"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Save to Contacts</span>
    </button>
  );
}

