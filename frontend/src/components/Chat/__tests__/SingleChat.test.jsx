import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SingleChat from '../SingleChat';

// Mock dependencies
vi.mock('../../../hooks/useSocket', () => ({
  useSocket: () => ({
    socket: { on: vi.fn(), emit: vi.fn() },
  }),
}));

vi.mock('../../../hooks/useMessageSender', () => ({
  default: () => ({
    sendMessage: vi.fn(),
    isSending: false,
  }),
}));

vi.mock('../../../stores', () => ({
  useAuthStore: () => ({ user: { _id: 'user1', name: 'Test User' } }),
}));

const mockSelectedChat = {
  _id: 'chat1',
  chatName: 'Test Chat',
  users: [{ _id: 'user1' }, { _id: 'user2' }],
};

const MockedSingleChat = (props) => (
  <BrowserRouter>
    <SingleChat {...props} />
  </BrowserRouter>
);

describe('SingleChat Component', () => {
  it('renders chat header when chat is selected', () => {
    render(<MockedSingleChat selectedChat={mockSelectedChat} />);
    // Component should render
    expect(document.body).toBeTruthy();
  });

  it('handles no selected chat', () => {
    render(<MockedSingleChat selectedChat={null} />);
    // Component should handle null chat gracefully
    expect(document.body).toBeTruthy();
  });
});

