import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BankCardForm from '../BankCardForm';

// Mock next/navigation
const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe('BankCardForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockRouterPush.mockClear();
  });

  it('renders all form fields', () => {
    render(<BankCardForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Account Holder Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bank Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/IFSC Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Routing Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/UPI ID/i)).toBeInTheDocument();
  });

  it('renders style selector options', () => {
    render(<BankCardForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/Classic Bank/i)).toBeInTheDocument();
    expect(screen.getByText(/Glass Morphism/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark Mode/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<BankCardForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /Create Card/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Account holder name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('validates IFSC code format', async () => {
    const user = userEvent.setup();
    render(<BankCardForm onSubmit={mockOnSubmit} />);

    const ifscInput = screen.getByLabelText(/IFSC Code/i);
    await user.type(ifscInput, 'invalid');

    const submitButton = screen.getByRole('button', { name: /Create Card/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid IFSC code/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<BankCardForm onSubmit={mockOnSubmit} />);

    // Fill in required fields
    await user.type(screen.getByLabelText(/Account Holder Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Bank Name/i), 'First National Bank');
    await user.type(screen.getByLabelText(/Account Number/i), '1234567890');

    const submitButton = screen.getByRole('button', { name: /Create Card/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          accountHolder: 'John Doe',
          bankName: 'First National Bank',
          accountNumber: '1234567890',
        })
      );
    });
  });
});

