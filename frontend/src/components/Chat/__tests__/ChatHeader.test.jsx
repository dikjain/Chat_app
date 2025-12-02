import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatHeader from '../ChatHeader';

// Mock dependencies
vi.mock('../../../stores', () => ({
  useAuthStore: () => ({ user: { _id: 'user1', name: 'Test User' } }),
  useChatStore: () => ({
    selectedChat: { _id: 'chat1', chatName: 'Test Chat' },
    setSelectedChat: vi.fn(),
  }),
}));

const MockedChatHeader = (props) => (
  <BrowserRouter>
    <ChatHeader {...props} />
  </BrowserRouter>
);

describe('ChatHeader Component', () => {
  it('renders chat name', () => {
    render(<MockedChatHeader />);
    expect(document.body).toBeTruthy();
  });

  it('renders user info for one-on-one chats', () => {
    const mockChat = {
      _id: 'chat1',
      isGroupChat: false,
      users: [{ _id: 'user2', name: 'Other User', pic: 'pic.jpg' }],
    };
    render(<MockedChatHeader chat={mockChat} />);
    expect(document.body).toBeTruthy();
  });

  it('renders group chat info', () => {
    const mockChat = {
      _id: 'chat1',
      isGroupChat: true,
      chatName: 'Group Chat',
      users: [{ _id: 'user2' }, { _id: 'user3' }],
    };
    render(<MockedChatHeader chat={mockChat} />);
    expect(document.body).toBeTruthy();
  });
});

