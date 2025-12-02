import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMessageSender from '../useMessageSender';

describe('useMessageSender Hook', () => {
  const mockSendMessage = vi.fn();
  const mockClearAIMessage = vi.fn();
  const mockClearTranscript = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns message sender functions', () => {
    const { result } = renderHook(() =>
      useMessageSender(mockSendMessage, mockClearAIMessage, mockClearTranscript)
    );

    expect(result.current.handleSendMessage).toBeDefined();
    expect(result.current.resetSent).toBeDefined();
  });

  it('sends message when handleSendMessage is called', async () => {
    const { result } = renderHook(() =>
      useMessageSender(mockSendMessage, mockClearAIMessage, mockClearTranscript)
    );

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      await result.current.handleSendMessage(mockEvent, 'Hello', 'chat1');
    });

    expect(mockSendMessage).toHaveBeenCalledWith('Hello', 'chat1', 'text');
  });

  it('clears AI message after sending', async () => {
    const { result } = renderHook(() =>
      useMessageSender(mockSendMessage, mockClearAIMessage, mockClearTranscript)
    );

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      await result.current.handleSendMessage(mockEvent, 'Hello', 'chat1');
    });

    expect(mockClearAIMessage).toHaveBeenCalled();
  });
});

