import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from '../MessageInput';

// Mock hooks
vi.mock('../../../hooks/useMessageInput', () => ({
  default: () => ({
    message: '',
    setMessage: vi.fn(),
    handleSendMessage: vi.fn(),
    handleKeyPress: vi.fn(),
  }),
}));

vi.mock('../../../hooks/useMessageSender', () => ({
  default: () => ({
    sendMessage: vi.fn(),
    isSending: false,
  }),
}));

describe('MessageInput Component', () => {
  it('renders input field', () => {
    render(<MessageInput />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders send button', () => {
    render(<MessageInput />);
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<MessageInput />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input.value).toBe('Test message');
  });

  it('calls send handler when send button is clicked', () => {
    const mockSendMessage = vi.fn();
    vi.mocked(require('../../../hooks/useMessageSender').default).mockReturnValue({
      sendMessage: mockSendMessage,
      isSending: false,
    });

    render(<MessageInput />);
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    expect(mockSendMessage).toHaveBeenCalled();
  });
});

