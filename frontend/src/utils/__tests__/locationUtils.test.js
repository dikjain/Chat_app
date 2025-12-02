import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentLocation, isGeolocationSupported } from '../locationUtils';

describe('Location Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isGeolocationSupported', () => {
    it('returns true when geolocation is supported', () => {
      expect(isGeolocationSupported()).toBe(true);
    });

    it('returns false when geolocation is not supported', () => {
      const originalGeolocation = navigator.geolocation;
      delete navigator.geolocation;
      
      expect(isGeolocationSupported()).toBe(false);
      
      navigator.geolocation = originalGeolocation;
    });
  });

  describe('getCurrentLocation', () => {
    it('creates Google Maps URL from coordinates', async () => {
      const mockPosition = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      navigator.geolocation.getCurrentPosition = vi.fn((success) => {
        success(mockPosition);
      });

      const url = await getCurrentLocation();
      expect(url).toContain('google.com/maps');
      expect(url).toContain('37.7749');
      expect(url).toContain('-122.4194');
    });

    it('handles permission denied error', async () => {
      const mockError = { code: 1, message: 'Permission denied' };
      navigator.geolocation.getCurrentPosition = vi.fn((success, error) => {
        error(mockError);
      });

      await expect(getCurrentLocation()).rejects.toThrow('permission denied');
    });

    it('handles position unavailable error', async () => {
      const mockError = { code: 2, message: 'Position unavailable' };
      navigator.geolocation.getCurrentPosition = vi.fn((success, error) => {
        error(mockError);
      });

      await expect(getCurrentLocation()).rejects.toThrow();
    });

    it('handles timeout error', async () => {
      const mockError = { code: 3, message: 'Timeout' };
      navigator.geolocation.getCurrentPosition = vi.fn((success, error) => {
        error(mockError);
      });

      await expect(getCurrentLocation()).rejects.toThrow('timed out');
    });
  });
});

