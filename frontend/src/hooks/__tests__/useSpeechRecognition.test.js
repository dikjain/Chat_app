import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSpeechRecognition from '../useSpeechRecognition';

// Mock Web Speech API
const mockSpeechRecognition = {
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

global.window.SpeechRecognition = vi.fn(() => mockSpeechRecognition);
global.window.webkitSpeechRecognition = vi.fn(() => mockSpeechRecognition);

describe('useSpeechRecognition Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns speech recognition functions', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isListening).toBeDefined();
    expect(result.current.transcript).toBeDefined();
    expect(result.current.toggleListening).toBeDefined();
    expect(result.current.clearTranscript).toBeDefined();
  });

  it('toggles listening state', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.toggleListening();
    });

    expect(mockSpeechRecognition.start).toHaveBeenCalled();
  });

  it('stops listening when toggled again', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.toggleListening();
      result.current.toggleListening();
    });

    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
  });

  it('clears transcript', () => {
    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.clearTranscript();
    });

    expect(result.current.transcript).toBe('');
  });

  it('handles browser not supporting speech recognition', () => {
    delete global.window.SpeechRecognition;
    delete global.window.webkitSpeechRecognition;

    const { result } = renderHook(() => useSpeechRecognition());
    
    // Should handle gracefully
    expect(result.current.toggleListening).toBeDefined();
  });
});

