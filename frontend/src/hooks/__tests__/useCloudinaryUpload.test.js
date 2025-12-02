import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useCloudinaryUpload from '../useCloudinaryUpload';
import * as cloudinaryAPI from '../../api/cloudinary';

vi.mock('../../api/cloudinary');
vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCloudinaryUpload Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useCloudinaryUpload());
    expect(result.current.isUploading).toBe(false);
    expect(result.current.imageUrl).toBeNull();
    expect(result.current.uploadImage).toBeDefined();
    expect(result.current.reset).toBeDefined();
  });

  it('sets uploading state during upload', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    cloudinaryAPI.uploadImage.mockResolvedValue('https://example.com/image.jpg');

    const { result } = renderHook(() => useCloudinaryUpload());

    act(() => {
      result.current.uploadImage(mockFile);
    });

    expect(result.current.isUploading).toBe(true);

    await waitFor(() => {
      expect(result.current.isUploading).toBe(false);
    });
  });

  it('returns image URL after successful upload', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockUrl = 'https://example.com/image.jpg';
    cloudinaryAPI.uploadImage.mockResolvedValue(mockUrl);

    const { result } = renderHook(() => useCloudinaryUpload());

    let uploadResult;
    await act(async () => {
      uploadResult = await result.current.uploadImage(mockFile);
    });

    expect(uploadResult).toBe(mockUrl);
    expect(result.current.imageUrl).toBe(mockUrl);
  });

  it('handles invalid file type', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const { toast } = await import('sonner');

    const { result } = renderHook(() => useCloudinaryUpload());

    await act(async () => {
      await result.current.uploadImage(mockFile);
    });

    expect(toast.warning).toHaveBeenCalled();
    expect(result.current.imageUrl).toBeNull();
  });

  it('handles upload errors', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockError = new Error('Upload failed');
    cloudinaryAPI.uploadImage.mockRejectedValue(mockError);
    const { toast } = await import('sonner');

    const { result } = renderHook(() => useCloudinaryUpload());

    await act(async () => {
      await result.current.uploadImage(mockFile);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isUploading).toBe(false);
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useCloudinaryUpload());

    act(() => {
      result.current.reset();
    });

    expect(result.current.imageUrl).toBeNull();
    expect(result.current.isUploading).toBe(false);
  });
});

