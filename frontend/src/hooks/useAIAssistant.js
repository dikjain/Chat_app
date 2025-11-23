import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as appConfig } from "@/constants/config";

const useAIAssistant = (options = {}) => {
  const { debounceMs = 500 } = options;
  const [aiMessage, setAIMessage] = useState("");
  const [aiTyping, setAITyping] = useState(false);
  const debounceTimerRef = useRef(null);
  const currentPromptRef = useRef("");

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

