import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFileUpload from '../useFileUpload';

describe('useFileUpload Hook', () => {
  const mockHandleFileSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns file input ref', () => {
    const { result } = renderHook(() => useFileUpload(mockHandleFileSelect));
    expect(result.current.fileInputRef).toBeDefined();
  });

  it('returns file upload handler', () => {
    const { result } = renderHook(() => useFileUpload(mockHandleFileSelect));
    expect(result.current.handleFileUpload).toBeDefined();
    expect(typeof result.current.handleFileUpload).toBe('function');
  });

  it('calls handleFileSelect when file is selected', () => {
    const { result } = renderHook(() => useFileUpload(mockHandleFileSelect));
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    act(() => {
      result.current.handleFileUpload(mockFile);
    });

    expect(mockHandleFileSelect).toHaveBeenCalledWith(mockFile);
  });
});

