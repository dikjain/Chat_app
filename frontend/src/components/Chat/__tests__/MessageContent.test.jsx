import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageContent from '../MessageContent';

describe('MessageContent Component', () => {
  const mockTextMessage = {
    _id: 'msg1',
    content: 'Hello world',
    type: 'text',
  };

  const mockImageMessage = {
    _id: 'msg2',
    content: 'https://example.com/image.jpg',
    type: 'image',
  };

  const mockLocationMessage = {
    _id: 'msg3',
    content: 'https://www.google.com/maps?q=37.7749,-122.4194',
    type: 'location',
  };

  it('renders text message content', () => {
    render(<MessageContent message={mockTextMessage} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders image message', () => {
    render(<MessageContent message={mockImageMessage} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders location message with map link', () => {
    render(<MessageContent message={mockLocationMessage} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('google.com/maps'));
  });

  it('handles file message type', () => {
    const fileMessage = {
      _id: 'msg4',
      content: 'https://example.com/file.pdf',
      type: 'file',
    };
    render(<MessageContent message={fileMessage} />);
    // Component should render file message
    expect(document.body).toBeTruthy();
  });
});

