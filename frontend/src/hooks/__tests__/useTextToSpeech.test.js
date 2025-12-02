import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTextToSpeech from '../useTextToSpeech';

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => [
    { name: 'Google US English', lang: 'en-US' },
    { name: 'Google UK English', lang: 'en-GB' },
  ]),
};

global.window.speechSynthesis = mockSpeechSynthesis;

describe('useTextToSpeech Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns text-to-speech functions', () => {
    const { result } = renderHook(() => useTextToSpeech());
    expect(result.current.speak).toBeDefined();
    expect(result.current.stop).toBeDefined();
    expect(result.current.isSpeaking).toBeDefined();
  });

  it('speaks text', () => {
    const { result } = renderHook(() => useTextToSpeech());

    act(() => {
      result.current.speak('Hello world');
    });

    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  it('stops speaking', () => {
    const { result } = renderHook(() => useTextToSpeech());

    act(() => {
      result.current.stop();
    });

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });

  it('handles browser not supporting speech synthesis', () => {
    delete global.window.speechSynthesis;

    const { result } = renderHook(() => useTextToSpeech());
    
    // Should handle gracefully
    expect(result.current.speak).toBeDefined();
  });
});

