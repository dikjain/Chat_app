import { FiFile } from "react-icons/fi";
import { MdLocationOn, MdMic } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MessageActionBar = ({
  aiMessage,
  isListening,
  isGettingLocation,
  handleAISuggestionClick,
  handleFileUpload,
  toggleListening,
  handleSendLocation,
}) => {
  const [displayText, setDisplayText] = useState(aiMessage || "");
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (!aiMessage && displayText) {
      setIsRemoving(true);
      const timer = setTimeout(() => {
        setDisplayText("");
        setIsRemoving(false);
      }, displayText.length * 10 + 100);
      
      return () => clearTimeout(timer);
    } else if (aiMessage) {
      setIsRemoving(false);
      setDisplayText(aiMessage);
    }
  }, [aiMessage, displayText]);
  return (
    <div className="relative py-1 w-full focus:outline-none outline-none bg-white shadow-sm">
      <div className="absolute left-2 top-1/2 gap-1 -translate-y-1/2 flex items-center z-10">
        <button
          className="h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors"
          aria-label="Upload File"
          onClick={handleFileUpload}
        >
          <FiFile className="h-4 w-4 text-[#a3a3a3] hover:text-green-500 transition-all duration-200" />
        </button>

        <div className="w-px h-4 bg-stone-300"></div>

        <button
          className="h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors"
          aria-label="Toggle Speech Recognition"
          onClick={toggleListening}
        >
          <MdMic
            className={`h-4 w-4 ${
              isListening
                ? "text-red-500"
                : "text-neutral-400 hover:text-green-500 transition-all duration-200"
            }`}
          />
        </button>

        <div className="w-px h-4 bg-stone-300"></div>

        <button
          className="h-6 w-6 flex items-center justify-center hover:bg-black/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send Location"
          onClick={handleSendLocation}
          disabled={isGettingLocation}
        >
          <MdLocationOn className="h-4 w-4 text-[#a3a3a3] hover:text-green-500 transition-all duration-200" />
        </button>
        <div className="w-px h-4 bg-stone-300"></div>
      </div>

      <div className="relative flex items-center ml-28 rounded-md bg pr-4">
        <div
          onClick={handleAISuggestionClick}
          style={{boxShadow : 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)'}}
          className="text-sm w-full px-2 pr-16  bg-neutral-100 rounded-md text-neutral-400 cursor-pointer min-h-[28px] flex items-center"
        >
          <AnimatePresence mode='popLayout'>
            {displayText ? (
              <motion.div
                key="text"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="truncate whitespace-nowrap overflow-hidden"
              >
                {displayText.split("").map((char, index) => (
                  <motion.span
                    key={`${displayText}-${index}`}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={
                      isRemoving
                        ? { opacity: 0, y: -4, scale: 0.8 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    transition={{
                      delay: isRemoving ? index * 0.003 : 0,
                      duration: 0.2,
                      ease: "easeInOut"
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            ) : (
              <motion.span
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-neutral-400"
              >
                AI suggestion will appear here...</motion.span>
            )}
          </AnimatePresence>
        </div>
        <div
          style={{
            boxShadow:
              "inset 0 1.5px 3px 0 rgba(255, 255, 255, 0.5), 0 2px 3px 0 rgba(0, 0, 0, 0.2)",
          }}
          className="absolute bg-white  rounded-sm h-fit  px-1 right-5 top-1/2 -translate-y-1/2 text-xs flex items-center text-neutral-500 font-medium border border-neutral-200 "
        >
          Tab
          <img 
            src="https://static.thenounproject.com/png/enter-icon-3552033-512.png" 
            alt="enter icon" 
            width="18" 
            height="18" 
            fetchPriority="high"
            className="object-contain opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default MessageActionBar;
