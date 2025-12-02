import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTranslation from '../useTranslation';

// Mock translation API
vi.mock('../api/ai', () => ({
  translateMessage: vi.fn(),
}));

describe('useTranslation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns translation functions', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.translate).toBeDefined();
    expect(result.current.isTranslating).toBeDefined();
  });

  it('translates text to target language', async () => {
    const { translateMessage } = await import('../api/ai');
    translateMessage.mockResolvedValue('Hola');

    const { result } = renderHook(() => useTranslation());

    let translatedText;
    await act(async () => {
      translatedText = await result.current.translate('Hello', 'es');
    });

    expect(translateMessage).toHaveBeenCalledWith('Hello', 'es');
    expect(translatedText).toBe('Hola');
  });

  it('handles translation errors', async () => {
    const { translateMessage } = await import('../api/ai');
    translateMessage.mockRejectedValue(new Error('Translation failed'));

    const { result } = renderHook(() => useTranslation());

    await act(async () => {
      const translated = await result.current.translate('Hello', 'es');
      expect(translated).toBeNull();
    });
  });
});

