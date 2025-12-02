import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMessageNotifications from '../useMessageNotifications';

// Mock notification API
const mockNotification = {
  requestPermission: vi.fn().mockResolvedValue('granted'),
};

global.Notification = vi.fn(() => mockNotification);

describe('useMessageNotifications Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns notification functions', () => {
    const { result } = renderHook(() => useMessageNotifications());
    expect(result.current.showNotification).toBeDefined();
    expect(result.current.requestPermission).toBeDefined();
  });

  it('requests notification permission', async () => {
    const { result } = renderHook(() => useMessageNotifications());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockNotification.requestPermission).toHaveBeenCalled();
  });

  it('shows notification when permission granted', () => {
    const { result } = renderHook(() => useMessageNotifications());

    act(() => {
      result.current.showNotification('New message', 'You have a new message');
    });

    // Notification should be created
    expect(global.Notification).toHaveBeenCalled();
  });

  it('handles browser not supporting notifications', () => {
    delete global.Notification;

    const { result } = renderHook(() => useMessageNotifications());
    
    // Should handle gracefully
    expect(result.current.showNotification).toBeDefined();
  });
});

