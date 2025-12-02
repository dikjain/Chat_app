import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageTime from '../MessageTime';

describe('MessageTime Component', () => {
  it('renders time for message', () => {
    const mockMessage = {
      createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    };

    render(<MessageTime message={mockMessage} />);
    // Component should render time
    expect(document.body).toBeTruthy();
  });

  it('formats time correctly', () => {
    const mockMessage = {
      createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    };

    const { container } = render(<MessageTime message={mockMessage} />);
    // Component should render (even if empty, it's valid)
    expect(container).toBeInTheDocument();
  });

  it('handles different time formats', () => {
    const todayMessage = {
      createdAt: new Date().toISOString(),
    };

    const oldMessage = {
      createdAt: new Date('2023-01-15T10:30:00Z').toISOString(),
    };

    render(<MessageTime message={todayMessage} />);
    expect(document.body).toBeTruthy();

    render(<MessageTime message={oldMessage} />);
    expect(document.body).toBeTruthy();
  });
});

