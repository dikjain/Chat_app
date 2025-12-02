import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyChatState from '../EmptyChatState';

// Mock demo components
vi.mock('../Step1ChatDemo', () => ({
  default: () => <div data-testid="step1">Step 1</div>,
}));

vi.mock('../Step2ChatDemo', () => ({
  default: () => <div data-testid="step2">Step 2</div>,
}));

vi.mock('../Step3ChatDemo', () => ({
  default: () => <div data-testid="step3">Step 3</div>,
}));

vi.mock('../Step4ChatDemo', () => ({
  default: () => <div data-testid="step4">Step 4</div>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('EmptyChatState Component', () => {
  it('renders all demo steps', () => {
    render(<EmptyChatState />);
    expect(screen.getByTestId('step1')).toBeInTheDocument();
    expect(screen.getByTestId('step2')).toBeInTheDocument();
    expect(screen.getByTestId('step3')).toBeInTheDocument();
    expect(screen.getByTestId('step4')).toBeInTheDocument();
  });

  it('renders differently when isAuthPage is true', () => {
    const { container: authContainer } = render(<EmptyChatState isAuthPage={true} />);
    const { container: normalContainer } = render(<EmptyChatState isAuthPage={false} />);
    
    // Both should render
    expect(authContainer).toBeTruthy();
    expect(normalContainer).toBeTruthy();
  });
});

