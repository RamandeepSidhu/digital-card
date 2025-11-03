'use client';

import { QRCodeSVG } from 'qrcode.react';
import { generateCardUrl } from '@/lib/qrGenerator';
import { useState } from 'react';
import { Card } from '@/types/card';

interface QRCodeDisplayProps {
  card: Card;
  baseUrl?: string;
}

export default function QRCodeDisplay({ card, baseUrl }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const cardUrl = generateCardUrl(card.id, baseUrl);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById(`qrcode-${card.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onerror = () => {
      console.error('Failed to load SVG image for QR code download');
    };

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      // Set canvas size
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `card-qr-${card.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          }
        }, 'image/png');
      }
    };

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  const handleShare = async (method: 'whatsapp' | 'email' | 'twitter' | 'facebook') => {
    const shareText = `Check out my digital card: ${cardUrl}`;
    
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=My Digital Card&body=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardUrl)}`, '_blank');
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Your Card is Ready!
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Scan the QR code or share the link to access your digital card
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <QRCodeSVG
            id={`qrcode-${card.id}`}
            value={cardUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Card URL */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Shareable Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cardUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-mono"
          />
          <button
            onClick={handleCopyUrl}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownloadQR}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR
        </button>
        <a
          href={cardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          View Card
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Share Options */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Share via
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <span>📱</span>
            WhatsApp
          </button>
          <button
            onClick={() => handleShare('email')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <span>✉️</span>
            Email
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
          >
            <span>🐦</span>
            Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span>📘</span>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

