import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatListItem from '../ChatListItem';

const MockedChatListItem = (props) => (
  <BrowserRouter>
    <ChatListItem {...props} />
  </BrowserRouter>
);

describe('ChatListItem Component', () => {
  const mockChat = {
    _id: 'chat1',
    chatName: 'Test Chat',
    isGroupChat: false,
    users: [
      { _id: 'user1', name: 'User 1', pic: 'pic1.jpg' },
      { _id: 'user2', name: 'User 2', pic: 'pic2.jpg' },
    ],
    latestMessage: {
      content: 'Latest message',
      sender: { name: 'User 2' },
    },
  };

  it('renders chat name', () => {
    render(<MockedChatListItem chat={mockChat} />);
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
  });

  it('renders latest message when available', () => {
    render(<MockedChatListItem chat={mockChat} />);
    expect(screen.getByText('Latest message')).toBeInTheDocument();
  });

  it('applies selected styling when chat is selected', () => {
    const { container } = render(
      <MockedChatListItem chat={mockChat} selectedChat={{ _id: 'chat1' }} />
    );
    const item = container.querySelector('.bg-white');
    expect(item).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<MockedChatListItem chat={mockChat} onClick={mockOnClick} />);
    const item = screen.getByText('Test Chat').closest('div');
    fireEvent.click(item);
    expect(mockOnClick).toHaveBeenCalled();
  });
});

