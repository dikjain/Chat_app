import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FiFile } from "react-icons/fi";
import { MdLocationOn, MdMic } from "react-icons/md";
import useMessageInput from "@/hooks/useMessageInput";

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
  } = useMessageInput(selectedChat, sendMessage, sendFile);

  if (!selectedChat) return null;

  return (
    <div onKeyDown={onKeyDown} className="px-2 pb-1 bg-neutral-100 border-t border-neutral-200">
      <div style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)"}} className="flex flex-col items-center mb-1 relative border  rounded-lg overflow-hidden mt-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,audio/*,application/pdf"
          className="hidden"
        />
        
        {/* Main Input Area - Full Width */}
        <div className="relative w-full focus:outline-none outline-none  ">
          <input
            className="w-full px-3 pr-10 text-neutral-600 py-2  rounded-none focus:outline-none outline-none focus:ring-0 focus-visible:outline-none active:outline-none focus-visible:ring-0"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
            ref={inputRef}
          />
          {/* Send Button */}
          <button
            onClick={() => onKeyDown({ key: 'Enter' })}
            className="absolute  right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send Message"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4 text-[#a3a3a3]" />
          </button>
        </div>
        
        {/* AI Assistant Suggestion with Action Buttons */}
        <div className="relative py-1  w-full focus:outline-none outline-none  bg-white   shadow-sm ">
          {/* Action Buttons */}
          <div className="absolute left-2 top-1/2 gap-1 -translate-y-1/2 flex items-center z-10">
            {/* File Upload Button */}
            <button
              className="h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors"
              aria-label="Upload File"
              onClick={handleFileUpload}
            >
              <FiFile className="h-4 w-4 text-[#a3a3a3] hover:text-green-400" />
            </button>
            
            {/* Separator */}
            <div className="w-px h-4 bg-stone-300"></div>
            
            {/* Speech Recognition Button */}
            <button
              className="h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors"
              aria-label="Toggle Speech Recognition"
              onClick={toggleListening}
            >
              <MdMic 
                className={`h-4 w-4 ${isListening ? 'text-red-500' : 'text-neutral-400 hover:text-green-400'}`}
              />
            </button>
            
            {/* Separator */}
            <div className="w-px h-4 bg-stone-300"></div>
            
            {/* Location Button */}
            <button
              className="h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send Location"
              onClick={handleSendLocation}
              disabled={isGettingLocation}
            >
              <MdLocationOn className="h-4 w-4 text-[#a3a3a3] hover:text-green-400" />
            </button>
            <div className="w-px h-4 bg-stone-300"></div>
          </div>
          {/* AI Assistant Input */}
          <div className="relative flex items-center ml-28   rounded-md">
            <input
              onClick={handleAISuggestionClick}
              className="   text-sm   w-full  px-2  mr-4 pr-12 bg-neutral-200 rounded-md  text-neutral-400  cursor-pointer   focus:outline-none outline-none focus:ring-0 focus-visible:outline-none active:outline-none focus-visible:ring-0"
              // value={aiMessage}
              value="Hello, how are you?dsfjk sdfiug rewg reih ruewhkrehkiu djshfkds afsdg wr ger g erwg rew g d g wedg few gf weu"
              readOnly
            />
            <div style={{ boxShadow: "inset 0 1.5px 3px 0 rgba(255, 255, 255, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3)"}} className="absolute bg-[#121212] rounded-md h-full px-1 py-0.5 right-3 top-1/2 -translate-y-1/2 text-xs flex text-neutral-400 font-light">
             Tab
              <svg  width="16" height="16" viewBox="0 0 24 24" fill="#a3a3a3" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 9.00001V15H8.5M8.5 15L9.5 14M8.5 15L9.5 16M13 5H17.5C18.0523 5 18.5 5.44772 18.5 6V18C18.5 18.5523 18.0523 19 17.5 19H6.5C5.94772 19 5.5 18.5523 5.5 18V12C5.5 11.4477 5.94772 11 6.5 11H12V6C12 5.44771 12.4477 5 13 5Z" stroke="#464455" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

