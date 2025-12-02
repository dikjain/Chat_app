import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as messageAPI from '../message';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Message API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMessages', () => {
    it('fetches messages for a chat', async () => {
      const mockResponse = { data: [{ _id: 'msg1', content: 'Hello' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await messageAPI.getMessages('chat1');

      expect(apiClient.get).toHaveBeenCalledWith('/api/message/chat1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('sendMessage', () => {
    it('sends a text message', async () => {
      const mockResponse = { data: { _id: 'msg1', content: 'Hello' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await messageAPI.sendMessage('Hello', 'chat1', 'text');

      expect(apiClient.post).toHaveBeenCalledWith('/api/message', {
        content: 'Hello',
        chatId: 'chat1',
        type: 'text',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('sends a location message', async () => {
      const mockResponse = { data: { _id: 'msg1', type: 'location' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await messageAPI.sendMessage('location-url', 'chat1', 'location');

      expect(apiClient.post).toHaveBeenCalledWith('/api/message', {
        content: 'location-url',
        chatId: 'chat1',
        type: 'location',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('uploadFile', () => {
    it('uploads a file', async () => {
      const mockFormData = new FormData();
      const mockResponse = { data: { url: 'https://example.com/file.jpg' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await messageAPI.uploadFile(mockFormData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/message/upload',
        mockFormData,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteMessage', () => {
    it('deletes a message', async () => {
      const mockResponse = { data: { success: true } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await messageAPI.deleteMessage('msg1');

      expect(apiClient.post).toHaveBeenCalledWith('/api/Message/delete', {
        messageId: 'msg1',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});

