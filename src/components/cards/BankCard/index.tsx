import { BankCard } from '@/types/card';
import StyleOne from './StyleOne';
import StyleTwo from './StyleTwo';
import StyleThree from './StyleThree';

interface BankCardDisplayProps {
  card: BankCard;
}

export default function BankCardDisplay({ card }: BankCardDisplayProps) {
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

