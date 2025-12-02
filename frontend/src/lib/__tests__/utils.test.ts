import { describe, it, expect } from 'vitest';
import { cn } from '../utils';
import { getUserPics } from '../utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('handles conditional classes', () => {
    const result = cn('base', true && 'conditional');
    expect(result).toContain('base');
    expect(result).toContain('conditional');
  });

  it('handles false conditional classes', () => {
    const result = cn('base', false && 'conditional');
    expect(result).toContain('base');
    expect(result).not.toContain('conditional');
  });

  it('merges Tailwind classes correctly', () => {
    const result = cn('p-2 p-4');
    expect(result).toBe('p-4'); // p-4 should override p-2
  });
});

describe('getUserPics utility function', () => {
  const mockCurrentUserId = 'user1';

  it('returns empty array when chat has no users', () => {
    const chat = {};
    const result = getUserPics(chat, mockCurrentUserId);
    expect(result).toEqual([]);
  });

  it('returns other user pic for one-on-one chat', () => {
    const chat = {
      isGroupChat: false,
      users: [
        { _id: 'user1', name: 'User 1', pic: 'pic1.jpg' },
        { _id: 'user2', name: 'User 2', pic: 'pic2.jpg' },
      ],
    };
    const result = getUserPics(chat, mockCurrentUserId);
    expect(result).toEqual(['pic2.jpg']);
  });

  it('returns up to 3 user pics for group chat', () => {
    const chat = {
      isGroupChat: true,
      users: [
        { _id: 'user1', name: 'User 1', pic: 'pic1.jpg' },
        { _id: 'user2', name: 'User 2', pic: 'pic2.jpg' },
        { _id: 'user3', name: 'User 3', pic: 'pic3.jpg' },
        { _id: 'user4', name: 'User 4', pic: 'pic4.jpg' },
      ],
    };
    const result = getUserPics(chat, mockCurrentUserId);
    expect(result).toHaveLength(3);
    expect(result).toEqual(['pic2.jpg', 'pic3.jpg', 'pic4.jpg']);
  });

  it('filters out users without pics', () => {
    const chat = {
      isGroupChat: true,
      users: [
        { _id: 'user1', name: 'User 1' },
        { _id: 'user2', name: 'User 2', pic: 'pic2.jpg' },
        { _id: 'user3', name: 'User 3' },
      ],
    };
    const result = getUserPics(chat, mockCurrentUserId);
    expect(result).toEqual(['pic2.jpg']);
  });
});

