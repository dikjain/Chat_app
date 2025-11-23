import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

const useSpeechRecognition = (options = {}) => {
  const {
    lang = "en-US",
    continuous = true,
    interimResults = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const isSupported = useCallback(() => {
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported()) {
      toast.error("Speech Recognition Not Supported", {
        description: "Your browser does not support speech recognition.",
      });
      return;
    }

    if (isListening) {
      return; // Already listening
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Build cumulative transcript from all results
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            fullTranscript += transcript + " ";
          } else {
            fullTranscript += transcript;
          }
        }

        setTranscript(fullTranscript.trim());
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        
        if (event.error === "aborted") {
          setIsListening(false);
        } else {
          toast.error("Speech Recognition Error", {
            description: `An error occurred: ${event.error}`,
          });
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          // Restart if still supposed to be listening
          try {
            recognition.start();
          } catch (error) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast.error("Failed to start speech recognition", {
        description: error.message,
      });
      setIsListening(false);
    }
  }, [isSupported, isListening, continuous, interimResults, lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    isSupported: isSupported(),
  };
};

export default useSpeechRecognition;

