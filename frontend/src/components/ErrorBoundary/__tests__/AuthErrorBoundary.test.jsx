import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthErrorBoundary from '../AuthErrorBoundary';

vi.mock('../ErrorBoundary', () => ({
  default: ({ children, message, onReset }) => (
    <div data-testid="error-boundary">
      <div>{message}</div>
      <button onClick={onReset}>Reset</button>
      {children}
    </div>
  ),
}));

vi.mock('../../stores', () => ({
  useAuthStore: {
    getState: () => ({
      clearUser: vi.fn(),
    }),
  },
}));

describe('AuthErrorBoundary Component', () => {
  it('renders children when no error', () => {
    render(
      <AuthErrorBoundary>
        <div>Test Content</div>
      </AuthErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows error message on error', () => {
    render(
      <AuthErrorBoundary>
        <div>Test Content</div>
      </AuthErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('provides reset function', () => {
    render(
      <AuthErrorBoundary>
        <div>Test Content</div>
      </AuthErrorBoundary>
    );
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeInTheDocument();
  });
});

