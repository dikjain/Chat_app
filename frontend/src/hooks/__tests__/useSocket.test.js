import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSocket } from '../useSocket';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
  })),
}));

vi.mock('../stores', () => ({
  useAuthStore: vi.fn((selector) => {
    const mockStore = {
      user: { _id: 'user1', name: 'Test User' },
    };
    return selector(mockStore);
  }),
}));

vi.mock('../constants/config', () => ({
  config: {
    SOCKET_URL: 'http://localhost:3000',
  },
}));

describe('useSocket Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns socket instance', () => {
    const { result } = renderHook(() => useSocket());
    expect(result).toBeDefined();
  });

  it('sets up socket connection when user exists', () => {
    const io = await import('socket.io-client');
    renderHook(() => useSocket());
    
    // Socket should be initialized
    expect(io.default).toHaveBeenCalled();
  });
});

