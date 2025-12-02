import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as chatAPI from '../chat';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllChats', () => {
    it('fetches all chats', async () => {
      const mockResponse = { data: [{ _id: 'chat1' }, { _id: 'chat2' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await chatAPI.getAllChats();

      expect(apiClient.get).toHaveBeenCalledWith('/api/chat');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('accessChat', () => {
    it('creates or accesses a chat', async () => {
      const mockResponse = { data: { _id: 'chat1' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chatAPI.accessChat('user1');

      expect(apiClient.post).toHaveBeenCalledWith('/api/chat', { userId: 'user1' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createGroupChat', () => {
    it('creates a group chat', async () => {
      const mockResponse = { data: { _id: 'group1', chatName: 'Test Group' } };
      const users = [{ _id: 'user1' }, { _id: 'user2' }];
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chatAPI.createGroupChat('Test Group', users);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/chat/group',
        expect.objectContaining({
          name: 'Test Group',
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('renameGroupChat', () => {
    it('renames a group chat', async () => {
      const mockResponse = { data: { _id: 'group1', chatName: 'New Name' } };
      apiClient.put.mockResolvedValue(mockResponse);

      const result = await chatAPI.renameGroupChat('group1', 'New Name');

      expect(apiClient.put).toHaveBeenCalledWith('/api/chat/rename', {
        chatId: 'group1',
        chatName: 'New Name',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});

