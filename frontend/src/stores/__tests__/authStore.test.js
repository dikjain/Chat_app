import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().clearUser();
  });

  it('initializes with null user', () => {
    const user = useAuthStore.getState().getUser();
    expect(user).toBeNull();
  });

  it('sets user correctly', () => {
    const userData = { _id: 'user1', name: 'Test User', email: 'test@example.com' };
    useAuthStore.getState().setUser(userData);
    const user = useAuthStore.getState().getUser();
    expect(user).toEqual(userData);
  });

  it('clears user correctly', () => {
    const userData = { _id: 'user1', name: 'Test User' };
    useAuthStore.getState().setUser(userData);
    useAuthStore.getState().clearUser();
    const user = useAuthStore.getState().getUser();
    expect(user).toBeNull();
  });

  it('updates user data', () => {
    const initialUser = { _id: 'user1', name: 'Test User' };
    useAuthStore.getState().setUser(initialUser);
    
    const updatedUser = { ...initialUser, name: 'Updated User' };
    useAuthStore.getState().setUser(updatedUser);
    
    const user = useAuthStore.getState().getUser();
    expect(user.name).toBe('Updated User');
  });
});

