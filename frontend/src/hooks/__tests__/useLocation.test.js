import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocation from '../useLocation';

// Mock geolocation API
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

global.navigator.geolocation = mockGeolocation;

describe('useLocation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns location functions', () => {
    const { result } = renderHook(() => useLocation());
    expect(result.current.sendLocation).toBeDefined();
    expect(result.current.isGettingLocation).toBeDefined();
  });

  it('handles successful location retrieval', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useLocation());

    let locationUrl;
    await act(async () => {
      locationUrl = await result.current.sendLocation();
    });

    expect(locationUrl).toBeDefined();
    expect(typeof locationUrl).toBe('string');
  });

  it('handles location errors', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ message: 'Location access denied' });
    });

    const { result } = renderHook(() => useLocation());

    await act(async () => {
      const locationUrl = await result.current.sendLocation();
      expect(locationUrl).toBeNull();
    });
  });
});

