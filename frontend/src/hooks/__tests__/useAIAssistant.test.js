import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useAIAssistant from '../useAIAssistant';

// Mock AI API
vi.mock('../api/ai', () => ({
  generateAISuggestion: vi.fn(),
}));

describe('useAIAssistant Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns AI assistant functions', () => {
    const { result } = renderHook(() => useAIAssistant());
    expect(result.current.handleTyping).toBeDefined();
    expect(result.current.aiMessage).toBeDefined();
    expect(result.current.clearMessage).toBeDefined();
  });

  it('debounces typing input', async () => {
    const { generateAISuggestion } = await import('../api/ai');
    generateAISuggestion.mockResolvedValue('Hello, how can I help?');

    const { result } = renderHook(() => useAIAssistant({ debounceMs: 500 }));

    act(() => {
      result.current.handleTyping('Hello');
    });

    // Should not call immediately
    expect(generateAISuggestion).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(generateAISuggestion).toHaveBeenCalled();
    });
  });

  it('clears AI message', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.clearMessage();
    });

    expect(result.current.aiMessage).toBe('');
  });
});

