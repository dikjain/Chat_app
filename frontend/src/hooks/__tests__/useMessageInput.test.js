import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMessageInput from '../useMessageInput';

// Mock all dependencies
vi.mock('../useAIAssistant', () => ({
  useAIAssistant: () => ({
    handleTyping: vi.fn(),
    aiMessage: '',
    clearMessage: vi.fn(),
  }),
}));

vi.mock('../useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    isListening: false,
    transcript: '',
    toggleListening: vi.fn(),
    clearTranscript: vi.fn(),
  }),
}));

vi.mock('../useLocation', () => ({
  useLocation: () => ({
    sendLocation: vi.fn(),
    isGettingLocation: false,
  }),
}));

vi.mock('../useFileUpload', () => ({
  useFileUpload: () => ({
    handleFileUpload: vi.fn(),
    fileInputRef: { current: null },
  }),
}));

vi.mock('../useMessageSender', () => ({
  useMessageSender: () => ({
    handleSendMessage: vi.fn(),
    resetSent: vi.fn(),
  }),
}));

describe('useMessageInput Hook', () => {
  const mockSelectedChat = { _id: 'chat1' };
  const mockSendMessage = vi.fn();
  const mockSendFile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() =>
      useMessageInput(mockSelectedChat, mockSendMessage, mockSendFile)
    );

    expect(result.current.newMessage).toBe('');
    expect(result.current.aiMessage).toBe('');
    expect(result.current.isListening).toBe(false);
    expect(result.current.isGettingLocation).toBe(false);
  });

  it('returns input ref', () => {
    const { result } = renderHook(() =>
      useMessageInput(mockSelectedChat, mockSendMessage, mockSendFile)
    );

    expect(result.current.inputRef).toBeDefined();
    expect(result.current.fileInputRef).toBeDefined();
  });

  it('provides typing handler', () => {
    const { result } = renderHook(() =>
      useMessageInput(mockSelectedChat, mockSendMessage, mockSendFile)
    );

    expect(result.current.typingHandler).toBeDefined();
    expect(typeof result.current.typingHandler).toBe('function');
  });

  it('provides key down handler', () => {
    const { result } = renderHook(() =>
      useMessageInput(mockSelectedChat, mockSendMessage, mockSendFile)
    );

    expect(result.current.onKeyDown).toBeDefined();
    expect(typeof result.current.onKeyDown).toBe('function');
  });

  it('provides file upload handler', () => {
    const { result } = renderHook(() =>
      useMessageInput(mockSelectedChat, mockSendMessage, mockSendFile)
    );

    expect(result.current.handleFileUpload).toBeDefined();
    expect(typeof result.current.handleFileUpload).toBe('function');
  });

  it('provides location handler', () => {
    const { result } = renderHook(() =>
      useMessageInput(mockSelectedChat, mockSendMessage, mockSendFile)
    );

    expect(result.current.handleSendLocation).toBeDefined();
    expect(typeof result.current.handleSendLocation).toBe('function');
  });
});

