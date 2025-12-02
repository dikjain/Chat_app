import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import * as useAuthHook from '../../../hooks/useAuth';

vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/useToast', () => ({
  default: () => ({
    toast: vi.fn(),
    toasts: [],
    removeToast: vi.fn(),
  }),
}));

const MockedLogin = ({ onSwitchToSignup }) => (
  <BrowserRouter>
    <Login onSwitchToSignup={onSwitchToSignup} />
  </BrowserRouter>
);

describe('Login Component', () => {
  const mockHandleLogin = vi.fn();
  const mockOnSwitchToSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthHook.default = vi.fn(() => ({
      handleLogin: mockHandleLogin,
      loading: false,
    }));
  });

  it('renders email and password inputs', () => {
    render(<MockedLogin />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<MockedLogin />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates email input value', () => {
    render(<MockedLogin />);
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input value', () => {
    render(<MockedLogin />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('calls handleLogin on form submission', async () => {
    render(<MockedLogin />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled();
    });
  });

  it('shows switch to signup link when onSwitchToSignup is provided', () => {
    render(<MockedLogin onSwitchToSignup={mockOnSwitchToSignup} />);
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('calls onSwitchToSignup when link is clicked', () => {
    render(<MockedLogin onSwitchToSignup={mockOnSwitchToSignup} />);
    const signupLink = screen.getByText(/don't have an account/i);
    fireEvent.click(signupLink);
    expect(mockOnSwitchToSignup).toHaveBeenCalled();
  });
});

