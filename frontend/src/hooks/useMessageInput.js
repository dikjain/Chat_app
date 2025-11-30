import { useState, useEffect, useRef, useCallback } from "react";
import { 
  useAIAssistant, 
  useSpeechRecognition, 
  useLocation,
  useFileUpload,
  useMessageSender
} from ".";

const useMessageInput = (selectedChat, sendMessage, sendFile) => {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);
  const aiMessageRef = useRef("");
  
  // Helper to find textarea element
  const getTextarea = useCallback(() => {
    if (!inputRef.current) return null;
    return inputRef.current.tagName === 'TEXTAREA' || inputRef.current.tagName === 'INPUT'
      ? inputRef.current
      : inputRef.current.querySelector('textarea') || inputRef.current.querySelector('input');
  }, []);

  // Helper to update textarea value using native setter
  const updateTextareaValue = useCallback((textarea, value) => {
    if (!textarea || textarea.value === value) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set ||
                   Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    if (setter) {
      setter.call(textarea, value);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, []);
  
  // AI Assistant
  const { handleTyping, aiMessage, clearMessage: clearAIMessage } = useAIAssistant({ 
    debounceMs: 250 
  });
  
  // Keep ref in sync with aiMessage
  useEffect(() => {
    aiMessageRef.current = aiMessage || "";
  }, [aiMessage]);
  
  // Speech Recognition
  const { 
    isListening, 
    transcript, 
    toggleListening, 
    clearTranscript 
  } = useSpeechRecognition();
  
  // Location
  const { sendLocation: getLocation, isGettingLocation } = useLocation();
  
  // Message Sender
  const { handleSendMessage, resetSent } = useMessageSender(
    sendMessage,
    clearAIMessage,
    clearTranscript
  );
  
  // File Upload
  const handleFileSelect = useCallback(async (file) => {
    if (!selectedChat) throw new Error("No chat selected");
    return await sendFile(file, selectedChat._id);
  }, [selectedChat, sendFile]);
  
  const { handleFileUpload, fileInputRef } = useFileUpload(handleFileSelect);
  
  // Sync transcript with newMessage when listening
  useEffect(() => {
    if (isListening && transcript) {
      setNewMessage(transcript);
      // Ensure caret moves with the text
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.scrollLeft = inputRef.current.scrollWidth;
        }, 0);
      }
    }
  }, [transcript, isListening]);
  
  // Typing handler with debounced AI
  const typingHandler = useCallback((e) => {
    const value = e.target.value;
    setNewMessage(value);
    handleTyping(value);
  }, [handleTyping]);
  
  // Send message handler
  const onKeyDown = useCallback((event) => {
    // Handle Tab key to accept AI suggestion
    if (event.key === "Tab") {
      const currentAIMessage = aiMessageRef.current;
      if (currentAIMessage && currentAIMessage.trim()) {
        event.preventDefault();
        event.stopPropagation();
        
        const textarea = getTextarea();
        if (textarea) {
          updateTextareaValue(textarea, currentAIMessage);
          typingHandler({ target: { value: currentAIMessage } });
          
          setTimeout(() => {
            textarea.focus();
            const length = currentAIMessage.length;
            if (textarea.setSelectionRange) {
              textarea.setSelectionRange(length, length);
            }
          }, 10);
        } else {
          setNewMessage(currentAIMessage);
        }
        
        clearAIMessage();
      }
      return;
    }

    // Handle Enter key
    if (event.key === "Enter") {
      // Shift+Enter: Allow newline (don't prevent default)
      if (event.shiftKey) {
        return; // Allow default behavior (newline)
      }

      // Enter alone: Send message and prevent newline
      if (selectedChat && newMessage.trim()) {
        event.preventDefault();
        event.stopPropagation();
        
        // Send the message
        handleSendMessage(event, newMessage, selectedChat._id);
        
        // Clear the message state
        setNewMessage("");
        resetSent();
        
        // Also clear the textarea value directly to ensure it's cleared
        const textarea = getTextarea();
        if (textarea) {
          updateTextareaValue(textarea, "");
        }
      } else {
        // If no message or no chat, prevent default to avoid newline
        event.preventDefault();
      }
    }
  }, [selectedChat, handleSendMessage, newMessage, resetSent, clearAIMessage, typingHandler, getTextarea, updateTextareaValue]);
  
  // Handle AI suggestion click
  const handleAISuggestionClick = useCallback(() => {
    setNewMessage(aiMessage);
    clearAIMessage();
  }, [aiMessage, clearAIMessage]);
  
  // Handle location sending
  const handleSendLocation = useCallback(async () => {
    if (!selectedChat) return;
    
    const locationUrl = await getLocation();
    if (locationUrl) {
      try {
        await sendMessage(locationUrl, selectedChat._id, "location");
      } catch (error) {
        console.error("Failed to send location:", error);
      }
    }
  }, [selectedChat, getLocation, sendMessage]);
  
  return {
    // State
    newMessage,
    aiMessage,
    isListening,
    isGettingLocation,
    
    // Refs
    inputRef,
    fileInputRef,
    
    // Helpers
    getTextarea,
    updateTextareaValue,
    
    // Handlers
    typingHandler,
    onKeyDown,
    handleAISuggestionClick,
    handleFileUpload,
    toggleListening,
    handleSendLocation,
  };
};

export default useMessageInput;

