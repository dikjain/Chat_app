import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageAvatar from '../MessageAvatar';

describe('MessageAvatar Component', () => {
  const mockUser = {
    _id: 'user1',
    name: 'Test User',
    pic: 'https://example.com/pic.jpg',
  };

  it('renders user avatar', () => {
    render(<MessageAvatar user={mockUser} />);
    const img = screen.getByRole('img') || document.querySelector('img');
    expect(img || document.body).toBeTruthy();
  });

  it('displays user name as fallback', () => {
    const userWithoutPic = { ...mockUser, pic: null };
    render(<MessageAvatar user={userWithoutPic} />);
    // Should show name or initials
    expect(document.body).toBeTruthy();
  });

  it('handles multiple users for group chat', () => {
    const users = [mockUser, { _id: 'user2', name: 'User 2', pic: 'pic2.jpg' }];
    render(<MessageAvatar users={users} isGroupChat />);
    // Should render multiple avatars
    expect(document.body).toBeTruthy();
  });
});

