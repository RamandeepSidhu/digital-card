import { render, screen } from '@testing-library/react';
import CardTypeSelector from '../CardTypeSelector';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('CardTypeSelector', () => {
  it('renders both card type options', () => {
    render(<CardTypeSelector />);
    
    expect(screen.getByText('Business Card')).toBeInTheDocument();
    expect(screen.getByText('Bank Card')).toBeInTheDocument();
  });

  it('displays correct descriptions', () => {
    render(<CardTypeSelector />);
    
    expect(
      screen.getByText(/Create a professional digital business card/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Share your payment details securely/i)
    ).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(<CardTypeSelector />);
    
    const businessLink = screen.getByRole('link', { name: /Business Card/i });
    expect(businessLink).toHaveAttribute('href', '/create/business');
    
    const bankLink = screen.getByRole('link', { name: /Bank Card/i });
    expect(bankLink).toHaveAttribute('href', '/create/bank');
  });

  it('displays icons for each card type', () => {
    const { container } = render(<CardTypeSelector />);
    
    // Check for emoji icons (💼 and 🏦)
    expect(container.textContent).toContain('💼');
    expect(container.textContent).toContain('🏦');
  });

  it('has "Get Started" text in each card', () => {
    render(<CardTypeSelector />);
    
    const getStartedTexts = screen.getAllByText('Get Started');
    expect(getStartedTexts).toHaveLength(2);
  });
});

