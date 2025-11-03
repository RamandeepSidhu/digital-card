import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QRCodeDisplay from '../QRCodeDisplay';
import { BusinessCard } from '@/types/card';

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123',
}));

// Mock qrcode.react
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value, id }: { value: string; id: string }) => (
    <svg id={id} data-testid="qrcode-svg" data-value={value}>
      QR Code
    </svg>
  ),
}));

describe('QRCodeDisplay', () => {
  const mockCard: BusinessCard = {
    id: 'test-card-id-123',
    type: 'business',
    style: 'style1',
    data: {
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Corp',
      email: 'john@example.com',
      phone: '1234567890',
    },
    createdAt: new Date(),
  };

  it('renders QR code display', () => {
    render(<QRCodeDisplay card={mockCard} />);
    
    expect(screen.getByText(/Your Card is Ready!/i)).toBeInTheDocument();
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
  });

  it('displays the card URL', () => {
    render(<QRCodeDisplay card={mockCard} />);
    
    const urlInput = screen.getByDisplayValue(new RegExp(`/card/${mockCard.id}`));
    expect(urlInput).toBeInTheDocument();
  });

  it('has copy button', () => {
    render(<QRCodeDisplay card={mockCard} />);
    
    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument();
  });

  it('has download QR button', () => {
    render(<QRCodeDisplay card={mockCard} />);
    
    expect(screen.getByRole('button', { name: /Download QR/i })).toBeInTheDocument();
  });

  it('has view card link', () => {
    render(<QRCodeDisplay card={mockCard} />);
    
    const viewLink = screen.getByRole('link', { name: /View Card/i });
    expect(viewLink).toHaveAttribute('href', expect.stringContaining(`/card/${mockCard.id}`));
  });

  it('has share buttons', () => {
    render(<QRCodeDisplay card={mockCard} />);
    
    expect(screen.getByRole('button', { name: /WhatsApp/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Facebook/i })).toBeInTheDocument();
  });
});

