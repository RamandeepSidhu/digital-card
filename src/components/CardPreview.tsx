'use client';

import { BusinessCard, BankCard, PersonalCard, Card } from '@/types/card';
import BusinessCardDisplay from './cards/BusinessCard';
import BankCardDisplay from './cards/BankCard';
import PersonalCardDisplay from './cards/PersonalCard';

interface CardPreviewProps {
  card: Card;
}

export default function CardPreview({ card }: CardPreviewProps | any) {
  // Only log once per card ID to avoid spam
  if (typeof window !== 'undefined' && card && card.type === 'business' && card.data) {
    const logKey = `__card_preview_logged_${card.id}`;
    if (!(window as any)[logKey]) {
      console.log(`[CardPreview] Card ${card.id} - Image check:`, {
        hasImage: !!card.data.image,
        imageType: typeof card.data.image,
        imageLength: typeof card.data.image === 'string' ? card.data.image.length : 0,
        dataKeys: Object.keys(card.data),
      });
      (window as any)[logKey] = true;
    }
  }
  
  if (card.type === 'business') {
    return <BusinessCardDisplay card={card as BusinessCard} />;
  } else if (card.type === 'bank') {
    return <BankCardDisplay card={card as BankCard} />;
  } else {
    return <PersonalCardDisplay card={card as PersonalCard} />;
  }
}

