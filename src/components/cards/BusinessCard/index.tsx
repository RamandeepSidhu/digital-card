import { BusinessCard } from '@/types/card';
import StyleOne from './StyleOne';
import StyleTwo from './StyleTwo';
import StyleThree from './StyleThree';

interface BusinessCardDisplayProps {
  card: BusinessCard;
}

export default function BusinessCardDisplay({ card }: BusinessCardDisplayProps) {
  switch (card.style) {
    case 'style1':
      return <StyleOne card={card} />;
    case 'style2':
      return <StyleTwo card={card} />;
    case 'style3':
      return <StyleThree card={card} />;
    default:
      return <StyleOne card={card} />;
  }
}

