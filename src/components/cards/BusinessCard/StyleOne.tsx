'use client';
import { BusinessCard } from '@/types/card';
import { useState } from 'react';

interface StyleOneProps {
  card: BusinessCard;
}

export default function StyleOne({ card }: StyleOneProps) {
  const { data } = card;
  const [imageError, setImageError] = useState(false);
  
  // Check if image exists and is valid
  const hasImage = data.image && data.image.trim() !== '' && !imageError;
  
  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      {/* Top Image */}
      <div className="relative">
        {hasImage ? (
          <div className="h-48 overflow-hidden">
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Image failed to load for card:', card.id);
                setImageError(true);
              }}
              onLoad={() => {
                setImageError(false);
              }}
            />
          </div>
        ) : (
          <div className="h-48 bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Purple wave divider */}
        <svg
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-12"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 C150,20 350,40 500,0 L500,80 Z"
            fill="url(#waveGradient)"
          ></path>
        </svg>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-5 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{data.name || "—"}</h2>
        
        {/* Title and Company */}
        {data.title && (
          <p className="text-sm text-gray-600 mb-1">{data.title}</p>
        )}
        {data.company && (
          <p className="text-sm text-gray-500 mb-5">{data.company}</p>
        )}

        {/* Contact Information */}
        <div className="mt-4 space-y-3">
          {data.email && (
            <div className="flex items-start gap-3 text-gray-700 text-sm">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span
                className="flex-1 min-w-0 leading-relaxed"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {data.email}
              </span>
            </div>
          )}

          {data.phone && (
            <div className="flex items-center gap-3 text-gray-700 text-sm">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="flex-1 min-w-0 leading-relaxed">
                {data.phone}
              </span>
            </div>
          )}

          {data.website && (
            <div className="flex items-center gap-3 text-gray-700 text-sm">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <a 
                href={data.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-purple-600 flex-1 min-w-0 leading-relaxed"
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {data.linkedin && (
            <div className="flex items-center gap-3 text-gray-700 text-sm">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <a 
                href={data.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-purple-600 flex-1 min-w-0 leading-relaxed"
              >
                LinkedIn
              </a>
            </div>
          )}

          {data.address && (
            <div className="flex items-start gap-3 text-gray-700 text-sm">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="flex-1 wrap-break-word min-w-0 leading-relaxed">
                {data.address}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t pt-3 flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">Business Card</span>
          {data.date && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{(() => {
                try {
                  const date = data.date.includes('T') ? new Date(data.date) : new Date(data.date);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = String(date.getFullYear()).slice(-2);
                  return `${day}/${month}/${year}`;
                } catch {
                  return data.date;
                }
              })()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
