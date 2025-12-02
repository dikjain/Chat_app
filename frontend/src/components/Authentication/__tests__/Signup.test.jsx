import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Signup';
import * as useAuthHook from '../../../hooks/useAuth';

vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/useToast', () => ({
  default: () => ({
    toast: vi.fn(),
    toasts: [],
    removeToast: vi.fn(),
  }),
}));
vi.mock('../../../hooks/useCloudinaryUpload', () => ({
  default: () => ({
    uploadImage: vi.fn(),
    isUploading: false,
  }),
}));

const MockedSignup = ({ onSwitchToLogin }) => (
  <BrowserRouter>
    <Signup onSwitchToLogin={onSwitchToLogin} />
  </BrowserRouter>
);

describe('Signup Component', () => {
  const mockHandleSignup = vi.fn();
  const mockOnSwitchToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthHook.default = vi.fn(() => ({
      handleSignup: mockHandleSignup,
      loading: false,
    }));
  });

  it('renders all form inputs', () => {
    render(<MockedSignup />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload your picture/i)).toBeInTheDocument();
  });

  it('renders signup button', () => {
    render(<MockedSignup />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('updates name input value', () => {
    render(<MockedSignup />);
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  it('updates email input value', () => {
    render(<MockedSignup />);
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('calls handleSignup on form submission', async () => {
    render(<MockedSignup />);
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockHandleSignup).toHaveBeenCalled();
    });
  });

  it('shows switch to login link when onSwitchToLogin is provided', () => {
    render(<MockedSignup onSwitchToLogin={mockOnSwitchToLogin} />);
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('renders random button', () => {
    render(<MockedSignup />);
    expect(screen.getByRole('button', { name: /random/i })).toBeInTheDocument();
  });
});

