import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useToast from '../useToast';

describe('useToast Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns toast function and toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeDefined();
    expect(result.current.toasts).toEqual([]);
    expect(result.current.removeToast).toBeDefined();
  });

  it('adds toast when toast is called', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
        status: 'success',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Title');
    expect(result.current.toasts[0].description).toBe('Test Description');
    expect(result.current.toasts[0].status).toBe('success');
  });

  it('removes toast when removeToast is called', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId;
    act(() => {
      toastId = result.current.toast({
        title: 'Test Title',
        status: 'info',
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-removes toast after duration', async () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Title',
        duration: 5000,
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(result.current.toasts).toHaveLength(0);
    });
  });

  it('does not auto-remove toast when duration is 0', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Title',
        duration: 0,
      });
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('generates unique id for each toast', () => {
    const { result } = renderHook(() => useToast());
    
    let id1, id2;
    act(() => {
      id1 = result.current.toast({ title: 'Toast 1' });
      id2 = result.current.toast({ title: 'Toast 2' });
    });

    expect(id1).not.toBe(id2);
  });
});

