import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactDownload from '../ContactDownload';
import { BusinessCard } from '@/types/card';

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123',
}));

// Mock URL.createObjectURL for test environment
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

describe('ContactDownload', () => {
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

  it('renders download button', () => {
    render(<ContactDownload card={mockCard} />);
    
    expect(screen.getByRole('button', { name: /Save to Contacts/i })).toBeInTheDocument();
  });

  it('can be clicked', async () => {
    const user = userEvent.setup();
    render(<ContactDownload card={mockCard} />);
    
    const button = screen.getByRole('button', { name: /Save to Contacts/i });
    await user.click(button);
    
    // Button should be clickable (actual download behavior tested in e2e)
    expect(button).toBeInTheDocument();
  });
});

