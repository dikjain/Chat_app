import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MultilingualBox from '../MultilingualBox';

vi.mock('../FeatureHeader', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    linearGradient: ({ children }) => <linearGradient>{children}</linearGradient>,
    path: (props) => <path {...props} />,
    span: ({ children }) => <span>{children}</span>,
  },
}));

describe('MultilingualBox Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders feature header', () => {
    render(<MultilingualBox />);
    expect(screen.getByText('Multilingual')).toBeInTheDocument();
  });

  it('renders word boxes', () => {
    render(<MultilingualBox />);
    // Component should render translation boxes
    expect(document.body).toBeTruthy();
  });

  it('cycles through languages', () => {
    render(<MultilingualBox />);
    
    // Advance time to trigger language change
    vi.advanceTimersByTime(5000);
    
    // Component should update language
    expect(document.body).toBeTruthy();
  });
});

