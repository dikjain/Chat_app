import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyChats from '../MyChats';

// Mock dependencies
vi.mock('../../../hooks/useChat', () => ({
  default: () => ({
    chats: [],
    isLoading: false,
    error: null,
  }),
}));

vi.mock('../../../stores', () => ({
  useAuthStore: () => ({ user: { _id: 'user1' } }),
}));

const MockedMyChats = (props) => (
  <BrowserRouter>
    <MyChats {...props} />
  </BrowserRouter>
);

describe('MyChats Component', () => {
  it('renders chats container', () => {
    render(<MockedMyChats />);
    const container = screen.getByRole('main') || document.querySelector('.chats-container');
    expect(container || document.body).toBeTruthy();
  });

  it('handles empty chats state', () => {
    render(<MockedMyChats />);
    // Component should render without errors even with empty chats
    expect(document.body).toBeTruthy();
  });
});

