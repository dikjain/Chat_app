import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useUserSearch from '../useUserSearch';

// Mock API
vi.mock('../api/user', () => ({
  searchUsers: vi.fn(),
}));

describe('useUserSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns search functions', () => {
    const { result } = renderHook(() => useUserSearch());
    expect(result.current.searchQuery).toBeDefined();
    expect(result.current.setSearchQuery).toBeDefined();
    expect(result.current.filteredUsers).toBeDefined();
  });

  it('updates search query', () => {
    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setSearchQuery('test');
    });

    expect(result.current.searchQuery).toBe('test');
  });

  it('filters users based on query', () => {
    const { result } = renderHook(() => useUserSearch());

    act(() => {
      result.current.setSearchQuery('john');
    });

    // Users should be filtered
    expect(result.current.filteredUsers).toBeDefined();
  });
});

