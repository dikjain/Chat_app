import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authAPI from '../auth';
import apiClient from '../client';

// Mock apiClient
vi.mock('../client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login API', () => {
    it('calls login endpoint with correct data', async () => {
      const mockResponse = { data: { token: 'test-token', user: { _id: 'user1' } } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login('test@example.com', 'password');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/user/login',
        { email: 'test@example.com', password: 'password' }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('handles login errors', async () => {
      const mockError = { response: { data: { message: 'Invalid credentials' } } };
      apiClient.post.mockRejectedValue(mockError);

      await expect(
        authAPI.login('test@example.com', 'wrong')
      ).rejects.toEqual(mockError);
    });
  });

  describe('signup API', () => {
    it('calls signup endpoint with correct data', async () => {
      const mockResponse = { data: { token: 'test-token', user: { _id: 'user1' } } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authAPI.signup('Test User', 'test@example.com', 'password', 'pic.jpg');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/user',
        { name: 'Test User', email: 'test@example.com', password: 'password', pic: 'pic.jpg' }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

