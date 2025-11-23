import { useState, useCallback } from "react";
import { toast } from "sonner";

const useMessageSender = (sendMessageFn, clearAIMessage, clearTranscript) => {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = useCallback(async (event, message, chatId) => {
    if (event.key !== "Enter" || !message || !chatId) {
      return;
    }

    if (sent) {
      toast.error("Error Occurred!", {
        description: "Wait before sending another message",
      });
      return;
    }

    if (!message.trim()) {
      return;
    }

    setSent(true);
    setIsSending(true);
    clearAIMessage?.();
    
    try {
      const messageContent = message.trim();
      await sendMessageFn(messageContent, chatId);
      clearTranscript?.();
    } catch (error) {
      // Error handling is done by interceptor
      console.error("Failed to send message:", error);
    } finally {
      setSent(false);
      setIsSending(false);
    }
  }, [sent, sendMessageFn, clearAIMessage, clearTranscript]);

  const resetSent = useCallback(() => {
    setSent(false);
  }, []);

  return {
    handleSendMessage,
    isSending,
    sent,
    resetSent,
  };
};

export default useMessageSender;

