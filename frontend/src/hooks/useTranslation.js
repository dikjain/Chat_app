import { useState, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as appConfig } from "../constants/config";
import { toast } from "sonner";

const useTranslation = (targetLanguage = "English") => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  const translateMessage = useCallback(async (message) => {
    if (!message || message.trim().length === 0) {
      return message;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const genAI = new GoogleGenerativeAI(appConfig.GOOGLE_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(
        `You are given a message. Translate it into ${targetLanguage} without any additional text. Return only the translated message. If you are unable to translate it, return the same message. Here's the message: ${message}`
      );
      
      const translatedText = result.response.text().trim();
      setIsTranslating(false);
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      setIsTranslating(false);
      const errorMsg = error?.response?.data?.message || error.message || "Translation failed";
      setTranslationError(errorMsg);
      toast.error("Error Translating", {
        description: errorMsg,
      });
      return message; // Return original message on error
    }
  }, [targetLanguage]);

  const clearError = useCallback(() => {
    setTranslationError(null);
  }, []);

  return {
    translateMessage,
    isTranslating,
    translationError,
    clearError,
  };
};

export default useTranslation;

