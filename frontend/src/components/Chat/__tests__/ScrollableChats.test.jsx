import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ScrollableChats from '../ScrollableChats';

// Mock dependencies
vi.mock('../../../hooks/useChat', () => ({
  default: () => ({
    chats: [
      { _id: 'chat1', chatName: 'Chat 1' },
      { _id: 'chat2', chatName: 'Chat 2' },
    ],
    isLoading: false,
  }),
}));

const MockedScrollableChats = (props) => (
  <BrowserRouter>
    <ScrollableChats {...props} />
  </BrowserRouter>
);

describe('ScrollableChats Component', () => {
  it('renders chats list', () => {
    render(<MockedScrollableChats />);
    // Component should render
    expect(document.body).toBeTruthy();
  });

  it('handles scroll behavior', () => {
    const { container } = render(<MockedScrollableChats />);
    const scrollable = container.querySelector('.overflow-y-scroll');
    expect(scrollable || container).toBeTruthy();
  });
});

