import { useState, useEffect, useRef, useCallback } from "react";
import { 
  useAIAssistant, 
  useSpeechRecognition, 
  useLocation,
  useFileUpload,
  useMessageSender
} from "@/hooks";

const useMessageInput = (selectedChat, sendMessage, sendFile) => {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);
  
  // AI Assistant
  const { handleTyping, aiMessage, clearMessage: clearAIMessage } = useAIAssistant({ 
    debounceMs: 500 
  });
  
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
    if (selectedChat) {
      handleSendMessage(event, newMessage, selectedChat._id);
      if (event.key === "Enter" && newMessage.trim()) {
        setNewMessage("");
        resetSent();
      }
    }
  }, [selectedChat, handleSendMessage, newMessage, resetSent]);
  
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

