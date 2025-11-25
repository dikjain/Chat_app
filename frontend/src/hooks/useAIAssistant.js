import { useState, useCallback, useRef, useEffect } from "react";
import { generateContent as generateContentAPI } from "@/api/ai";

const useAIAssistant = (options = {}) => {
  const { debounceMs = 250 } = options;
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const debounceTimerRef = useRef(null);
  const currentPromptRef = useRef("");
  const abortControllerRef = useRef(null);

  // Generate content using API
  const generateContent = useCallback(async (prompt) => {
    if (!prompt || prompt.trim().length === 0) {
      setAIMessage("");
      return "";
    }

    // Don't generate if already typing
    if (aiTyping) {
      return "";
    }

    try {
      setAITyping(true);
      
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Callback to update message as chunks arrive (for streaming)
      const onChunk = (fullText) => {
        // Only update if this is still the current prompt
        if (currentPromptRef.current === prompt) {
          setAIMessage(fullText);
        }
      };

      const fullText = await generateContentAPI(
        prompt,
        abortControllerRef.current.signal,
        onChunk
      );

      // Only update if this is still the current prompt
      if (currentPromptRef.current === prompt) {
        setAIMessage(fullText);
      }

      setAITyping(false);
      return fullText;
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled, ignore
        return "";
      }
      console.error("AI generation error:", error);
      setAITyping(false);
      // Only clear if this is still the current prompt
      if (currentPromptRef.current === prompt) {
        setAIMessage("");
      }
      return "";
    }
  }, [aiTyping]);

  const handleTyping = useCallback((value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Clear message if input is empty
    if (!value || value.trim().length === 0) {
      setAIMessage("");
      currentPromptRef.current = "";
      return;
    }

    // Update current prompt
    currentPromptRef.current = value;

    // Set debounce timer
    debounceTimerRef.current = setTimeout(() => {
      generateContent(value);
    }, debounceMs);
  }, [generateContent, debounceMs]);

  const clearMessage = useCallback(() => {
    setAIMessage("");
    currentPromptRef.current = "";
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    generateContent,
    handleTyping,
    aiMessage,
    aiTyping,
    clearMessage,
  };
};

export default useAIAssistant;

