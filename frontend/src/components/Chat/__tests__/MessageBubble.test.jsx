import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageBubble from '../MessageBubble';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('MessageBubble Component', () => {
  const mockMessage = {
    _id: 'msg1',
    content: 'Test message',
    sender: {
      _id: 'user1',
      name: 'Test User',
      pic: 'test.jpg',
    },
    createdAt: new Date().toISOString(),
  };

  it('renders message content', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders sender name when provided', () => {
    render(<MessageBubble message={mockMessage} isGroupChat />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('applies correct styling for sent messages', () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isSent />
    );
    const bubble = container.querySelector('.bg-blue-500');
    expect(bubble).toBeInTheDocument();
  });

  it('applies correct styling for received messages', () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isSent={false} />
    );
    const bubble = container.querySelector('.bg-white');
    expect(bubble).toBeInTheDocument();
  });
});

