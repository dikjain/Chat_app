import { describe, it, expect } from 'vitest';
import {
  isSameSenderMargin,
  isSameSender,
  isLastMessage,
  isSameUser,
  getSender,
  getSenderFull,
} from '../chatLogics';

describe('Chat Logic Utils', () => {
  const mockUserId = 'user1';
  const mockUser2 = 'user2';
  const mockUser3 = 'user3';

  const createMessage = (senderId, index) => ({
    _id: `msg${index}`,
    sender: { _id: senderId, name: `User ${senderId}` },
    content: `Message ${index}`,
  });

  describe('isSameSenderMargin', () => {
    it('returns 33 when next message is from same sender and current is not from user', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser2, 1),
      ];
      const result = isSameSenderMargin(messages, messages[0], 0, mockUserId);
      expect(result).toBe(33);
    });

    it('returns 0 when next message is from different sender', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser3, 1),
      ];
      const result = isSameSenderMargin(messages, messages[0], 0, mockUserId);
      expect(result).toBe(0);
    });

    it('returns "auto" when message is from current user', () => {
      const messages = [
        createMessage(mockUserId, 0),
        createMessage(mockUser2, 1),
      ];
      const result = isSameSenderMargin(messages, messages[0], 0, mockUserId);
      expect(result).toBe('auto');
    });
  });

  describe('isSameSender', () => {
    it('returns true for first message from other user', () => {
      const messages = [createMessage(mockUser2, 0)];
      const result = isSameSender(messages, messages[0], 0, mockUserId);
      expect(result).toBe(true);
    });

    it('returns true when previous message is from different sender', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser3, 1),
      ];
      const result = isSameSender(messages, messages[1], 1, mockUserId);
      expect(result).toBe(true);
    });

    it('returns false when previous message is from same sender', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser2, 1),
      ];
      const result = isSameSender(messages, messages[1], 1, mockUserId);
      expect(result).toBe(false);
    });
  });

  describe('isLastMessage', () => {
    it('returns sender id for last message from other user', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser2, 1),
      ];
      const result = isLastMessage(messages, 1, mockUserId);
      expect(result).toBe(mockUser2);
    });

    it('returns false for last message from current user', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUserId, 1),
      ];
      const result = isLastMessage(messages, 1, mockUserId);
      expect(result).toBe(false);
    });
  });

  describe('isSameUser', () => {
    it('returns true when previous message is from same sender', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser2, 1),
      ];
      const result = isSameUser(messages, messages[1], 1);
      expect(result).toBe(true);
    });

    it('returns false when previous message is from different sender', () => {
      const messages = [
        createMessage(mockUser2, 0),
        createMessage(mockUser3, 1),
      ];
      const result = isSameUser(messages, messages[1], 1);
      expect(result).toBe(false);
    });
  });

  describe('getSender', () => {
    it('returns second user name when first user is logged in', () => {
      const loggedUser = { _id: mockUserId };
      const users = [
        { _id: mockUserId, name: 'User 1' },
        { _id: mockUser2, name: 'User 2' },
      ];
      const result = getSender(loggedUser, users);
      expect(result).toBe('User 2');
    });

    it('returns first user name when second user is logged in', () => {
      const loggedUser = { _id: mockUser2 };
      const users = [
        { _id: mockUserId, name: 'User 1' },
        { _id: mockUser2, name: 'User 2' },
      ];
      const result = getSender(loggedUser, users);
      expect(result).toBe('User 1');
    });
  });

  describe('getSenderFull', () => {
    it('returns second user object when first user is logged in', () => {
      const loggedUser = { _id: mockUserId };
      const users = [
        { _id: mockUserId, name: 'User 1' },
        { _id: mockUser2, name: 'User 2' },
      ];
      const result = getSenderFull(loggedUser, users);
      expect(result._id).toBe(mockUser2);
    });
  });
});

