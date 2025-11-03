'use client';

import Link from 'next/link';
import { CardType } from '@/types/card';

interface CardTypeOption {
  type: CardType;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  hoverGradient: string;
  href: string;
}

const cardTypes1: CardTypeOption[] = [
  {
    type: 'business',
    title: 'Business Card',
    description: 'Create a professional digital business card with your contact information',
    icon: '💼',
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'from-purple-600 to-purple-700',
    href: '/create/business',
  },
  {
    type: 'bank',
    title: 'Bank Card',
    description: 'Share your payment details securely with a digital bank card',
    icon: '🏦',
    gradient: 'from-purple-400 to-purple-500',
    hoverGradient: 'from-purple-500 to-purple-600',
    href: '/create/bank',
  },
];

const cardTypes: CardTypeOption[] = [
  {
    type: 'business',
    title: 'Business Card',
    description: 'Create a professional digital business card with your contact information',
    icon: '💼',
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'from-purple-600 to-purple-700',
    href: '/create/business',
  },
  {
    type: 'bank',
    title: 'Bank Card',
    description: 'Share your payment details securely with a digital bank card',
    icon: '🏦',
    gradient: 'from-purple-400 to-purple-500',
    hoverGradient: 'from-purple-500 to-purple-600',
    href: '/create/bank',
  },
  {
    type: 'personal',
    title: 'Personal Card',
    description: 'Create a personal digital card with your social links and contact info',
    icon: '👤',
    gradient: 'from-purple-600 to-purple-700',
    hoverGradient: 'from-purple-700 to-purple-800',
    href: '/create/personal',
  },
];

export default function CardTypeSelector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {cardTypes.map((cardType) => (
        <Link
          key={cardType.type}
          href={cardType.href}
          className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${cardType.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
          />
          <div className="relative z-10 flex flex-col h-full">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {cardType.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
              {cardType.title}
            </h2>
            <p className="text-white/90 text-sm leading-relaxed flex-grow">
              {cardType.description}
            </p>
            <div className="mt-6 flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
              Get Started
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
        </Link>
      ))}
    </div>
  );
}

