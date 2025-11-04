import { BusinessCard } from '@/types/card';
import StyleOne from './StyleOne';
import StyleTwo from './StyleTwo';
import StyleThree from './StyleThree';
import StyleFour from './StyleFour';
import StyleFive from './StyleFive';
import StyleSix from './StyleSix';

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
    case 'style4':
      return <StyleFour card={card} />;
    case 'style5':
      return <StyleFive card={card} />;
    case 'style6':
      return <StyleSix card={card} />;
    default:
      return <StyleOne card={card} />;
  }
}

