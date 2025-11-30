import { Input } from "react-chat-elements";
import { SendHorizontal as Send } from "lucide-react";
import { FiFile } from "react-icons/fi";
import { MdLocationOn, MdMic } from "react-icons/md";
import { useEffect } from "react";
import useMessageInput from "../../hooks/useMessageInput";
import MessageActionBar from "./MessageActionBar";

const MessageInput = ({ selectedChat, sendMessage, sendFile }) => {
  const {
    newMessage,
    aiMessage,
    isListening,
    isGettingLocation,
    inputRef,
    fileInputRef,
    typingHandler,
    onKeyDown,
    handleAISuggestionClick,
    handleFileUpload,
    toggleListening,
    handleSendLocation,
    getTextarea,
    updateTextareaValue,
  } = useMessageInput(selectedChat, sendMessage, sendFile);

  // Attach keydown handler and sync textarea value
  useEffect(() => {
    const textarea = getTextarea();
    if (!textarea) return;

    textarea.addEventListener('keydown', onKeyDown);
    const timeoutId = setTimeout(() => updateTextareaValue(textarea, newMessage), 0);

    return () => {
      textarea.removeEventListener('keydown', onKeyDown);
      clearTimeout(timeoutId);
    };
  }, [inputRef, onKeyDown, newMessage]);

  // Enhanced AI suggestion click handler
  const handleAIClick = () => {
    handleAISuggestionClick();
    setTimeout(() => {
      const textarea = getTextarea();
      if (textarea && aiMessage) updateTextareaValue(textarea, aiMessage);
    }, 0);
  };

  if (!selectedChat) return null;

  const rightButtons = (
    <button
      onClick={() => onKeyDown({ key: 'Enter' })}
      className="px-3 py-1  flex bg-black/70   rounded-md shadow-[inset_-1px_1px_2px_0_rgba(255,255,255,0.6),inset_1px_-1px_2px_0_rgba(0,0,0,0.4),0_1px_2px_0_rgba(0,0,0,0.3)]  items-center justify-center     transition-colors "
      aria-label="Send Message"
      disabled={!newMessage.trim()}
    >
      <Send className="h-4 w-4 text-white" />
    </button>
  );

  return (
    <div className="px-2 py-1 bg-neutral-100 border-t border-neutral-200">
      <div
        style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)" }}
        className="flex flex-col items-center mb-1 relative border rounded-lg overflow-hidden mt-1"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,audio/*,application/pdf"
          className="hidden"
        />

        {/* React Chat Elements Input */}
        <div className="w-full bg-white">
          <Input
            referance={inputRef}
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
            multiline={true}
            autoHeight={true}
            minHeight={25}
            maxHeight={120}
            rightButtons={rightButtons}
            inputStyle={{
              padding: "8px 12px",
              fontSize: "14px",
              lineHeight: "1.4",
            }}
          />
        </div>

        {/* AI Assistant Suggestion with Action Buttons */}
        <MessageActionBar
          aiMessage={aiMessage}
          isListening={isListening}
          isGettingLocation={isGettingLocation}
          handleAISuggestionClick={handleAIClick}
          handleFileUpload={handleFileUpload}
          toggleListening={toggleListening}
          handleSendLocation={handleSendLocation}
        />
      </div>
    </div>
  );
};

export default MessageInput;

