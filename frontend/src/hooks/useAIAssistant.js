import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as appConfig } from "@/constants/config";

const useAIAssistant = (options = {}) => {
  const { debounceMs = 250 } = options;
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const debounceTimerRef = useRef(null);
  const currentPromptRef = useRef("");
  const abortControllerRef = useRef(null);

  // Groq API implementation with streaming
  const generateContentGroq = useCallback(async (prompt) => {
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

      const apiKey = import.meta.env.VITE_GROQ_AI_API_KEY;
      if (!apiKey) {
        console.error("VITE_GROQ_AI_API_KEY is not set");
        setAITyping(false);
        return "";
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "Please complete the following message along with the user's input naturally as if it were sent by the user. Ensure the response feels like a continuation of the user's input and match the language used. Only provide the completed message without any additional text. Here's the message: " + prompt
            }
          ],
          model: "openai/gpt-oss-20b",
          temperature: 1,
          max_completion_tokens: 8192,
          top_p: 1,
          stream: true,
          reasoning_effort: "medium",
          stop: null
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                fullText += content;
                
                // Only update if this is still the current prompt
                if (currentPromptRef.current === prompt) {
                  setAIMessage(fullText);
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

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
      console.error("Groq AI generation error:", error);
      setAITyping(false);
      // Only clear if this is still the current prompt
      if (currentPromptRef.current === prompt) {
        setAIMessage("");
      }
      return "";
    }
  }, [aiTyping]);

  // Original Gemini implementation (kept for testing)
  const generateContentGemini = useCallback(async (prompt) => {
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
      const genAI = new GoogleGenerativeAI(appConfig.GOOGLE_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const result = await model.generateContent(
        "Please complete the following message along with the user's input naturally as if it were sent by the user. Ensure the response feels like a continuation of the user's input and match the language used. Only provide the completed message without any additional text. Here's the message: " +
          prompt
      );
      
      const generatedText = result.response.text();
      
      // Only update if this is still the current prompt
      if (currentPromptRef.current === prompt) {
        setAIMessage(generatedText);
      }
      
      setAITyping(false);
      return generatedText;
    } catch (error) {
      console.error("AI generation error:", error);
      setAITyping(false);
      // Only clear if this is still the current prompt
      if (currentPromptRef.current === prompt) {
        setAIMessage("");
      }
      return "";
    }
  }, [aiTyping]);

  // Use Groq by default, fallback to Gemini if Groq key not available
  const generateContent = useCallback(async (prompt) => {
    const groqKey = import.meta.env.VITE_GROQ_AI_API_KEY;
    if (groqKey) {
      return generateContentGroq(prompt);
    } else {
      return generateContentGemini(prompt);
    }
  }, [generateContentGroq, generateContentGemini]);

  const handleTyping = useCallback((value) => {
    // Clear existing timer
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

