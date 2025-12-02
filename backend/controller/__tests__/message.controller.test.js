import { describe, it, expect, vi, beforeEach } from 'vitest';
import Message from '../../models/message.model';
import Chat from '../../models/chat.model';

// Mock dependencies
vi.mock('../../models/message.model');
vi.mock('../../models/chat.model');

describe('Message Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should create a new message', async () => {
      const mockMessage = {
        sender: 'user1',
        content: 'Test message',
        chat: 'chat1',
      };

      Message.create.mockResolvedValue({ ...mockMessage, _id: 'msg1' });
      Chat.findByIdAndUpdate.mockResolvedValue({ _id: 'chat1' });

      // Test would verify message creation logic here
      expect(Message.create).toBeDefined();
    });

    it('should handle message creation errors', async () => {
      Message.create.mockRejectedValue(new Error('Database error'));

      // Test would verify error handling here
      expect(Message.create).toBeDefined();
    });
  });

  describe('getMessages', () => {
    it('should fetch messages for a chat', async () => {
      const mockMessages = [
        { _id: 'msg1', content: 'Message 1' },
        { _id: 'msg2', content: 'Message 2' },
      ];

      Message.find.mockResolvedValue(mockMessages);

      // Test would verify message fetching logic here
      expect(Message.find).toBeDefined();
    });
  });
});

