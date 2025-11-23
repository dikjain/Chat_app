import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

const useTextToSpeech = (options = {}) => {
  const {
    lang = "hi-IN",
    rate = 0.9,
    pitch = 1.2,
    timeout = 7500,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const timeoutRef = useRef(null);
  const utteranceRef = useRef(null);

  const isSupported = useCallback(() => {
    return "speechSynthesis" in window;
  }, []);

  const speak = useCallback((text, index = null) => {
    if (!isSupported()) {
      toast.error("Text-to-Speech Not Supported", {
        description: "Your browser does not support text-to-speech.",
      });
      return;
    }

    if (!text || text.trim().length === 0) {
      return;
    }

    // Stop any current speech
    stop();

    setIsSpeaking(true);
    setSpeakingIndex(index);

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      // Try to find a voice matching the language
      const voices = speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => voice.lang === lang);
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingIndex(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
        setSpeakingIndex(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        toast.error("Speech Error", {
          description: `An error occurred: ${event.error}`,
        });
      };

      // Set timeout as fallback
      timeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
        setSpeakingIndex(null);
        speechSynthesis.cancel();
      }, timeout);

      utteranceRef.current = utterance;
      speechSynthesis.cancel(); // Cancel any previous speech
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Failed to speak text:", error);
      setIsSpeaking(false);
      setSpeakingIndex(null);
      toast.error("Failed to speak text", {
        description: error.message,
      });
    }
  }, [isSupported, lang, rate, pitch, timeout]);

  const stop = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsSpeaking(false);
    setSpeakingIndex(null);
    utteranceRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    speak,
    stop,
    isSpeaking,
    speakingIndex,
    isSupported: isSupported(),
  };
};

export default useTextToSpeech;

