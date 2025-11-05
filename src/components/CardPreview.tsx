'use client';

import { BusinessCard, BankCard, PersonalCard, Card } from '@/types/card';
import BusinessCardDisplay from './cards/BusinessCard';
import BankCardDisplay from './cards/BankCard';
import PersonalCardDisplay from './cards/PersonalCard';

interface CardPreviewProps {
  card: Card;
}

export default function CardPreview({ card }: CardPreviewProps | any) {
  if (card.type === 'business') {
    return <BusinessCardDisplay card={card as BusinessCard} />;
  } else if (card.type === 'bank') {
    return <BankCardDisplay card={card as BankCard} />;
  } else {
    return <PersonalCardDisplay card={card as PersonalCard} />;
  }
}

