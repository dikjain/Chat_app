import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../AuthPage';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../stores', () => ({
  useAuthStore: () => ({ user: null }),
}));

vi.mock('../../components/ErrorBoundary/AuthErrorBoundary', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../../components/Authentication/LeftSection', () => ({
  default: () => <div data-testid="left-section">Left</div>,
}));

vi.mock('../../components/Authentication/LogoSection', () => ({
  default: () => <div data-testid="logo-section">Logo</div>,
}));

vi.mock('../../components/Authentication/AuthFormContainer', () => ({
  default: () => <div data-testid="auth-form">Form</div>,
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

const MockedAuthPage = () => (
  <BrowserRouter>
    <AuthPage />
  </BrowserRouter>
);

describe('AuthPage Component', () => {
  it('renders authentication form', () => {
    render(<MockedAuthPage />);
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('renders left section', () => {
    render(<MockedAuthPage />);
    expect(screen.getByTestId('left-section')).toBeInTheDocument();
  });

  it('renders logo section when on login tab', () => {
    render(<MockedAuthPage />);
    expect(screen.getByTestId('logo-section')).toBeInTheDocument();
  });
});

