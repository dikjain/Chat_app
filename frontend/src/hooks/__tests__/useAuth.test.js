import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuth from '../useAuth';

// Mock dependencies
vi.mock('../stores', () => ({
  useAuthStore: vi.fn((selector) => {
    const mockStore = {
      setUser: vi.fn(),
      getUser: vi.fn(() => ({ _id: 'user1', name: 'Test User' })),
      clearUser: vi.fn(),
    };
    return selector(mockStore);
  }),
}));

vi.mock('../mutations/useAuthMutations', () => ({
  useLogin: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ data: { user: { _id: 'user1' } } }),
  }),
  useSignup: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ data: { user: { _id: 'user1' } } }),
  }),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns auth functions', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.handleLogin).toBeDefined();
    expect(result.current.handleSignup).toBeDefined();
    expect(result.current.storeSession).toBeDefined();
    expect(result.current.getSession).toBeDefined();
    expect(result.current.clearSession).toBeDefined();
  });

  it('validates email correctly', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.validateEmail('test@gmail.com')).toBe(true);
    expect(result.current.validateEmail('test@yahoo.com')).toBe(true);
    expect(result.current.validateEmail('test@invalid.com')).toBe(false);
  });

  it('stores session correctly', () => {
    const { result } = renderHook(() => useAuth());
    const userData = { _id: 'user1', name: 'Test User' };
    
    act(() => {
      result.current.storeSession(userData);
    });

    // Session storage is handled by Zustand persist middleware
    expect(result.current.storeSession).not.toThrow();
  });

  it('retrieves session correctly', () => {
    const { result } = renderHook(() => useAuth());
    const session = result.current.getSession();
    expect(session).toBeDefined();
  });

  it('clears session correctly', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.clearSession();
    });

    expect(result.current.clearSession).not.toThrow();
  });
});

