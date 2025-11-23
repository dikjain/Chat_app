import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "@/utils/chatLogics";
import { useAuthStore, useChatStore, useThemeStore } from "@/stores";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useChat, useTranslation, useTextToSpeech } from "@/hooks";
import { formatMessageTime, getTodayIST } from "@/utils/dateUtils";


// Constants
const INITIAL_MESSAGE_COUNT = 15;
const LOAD_MORE_INCREMENT = 10;
const TRANSLATE_CLICK_TIMEOUT = 700;

const ScrollableChat = ({ messages }) => {
  const [speakVisible, setSpeakVisible] = useState(null);
  const [visibleMessages, setVisibleMessages] = useState(null);
  const [visibleMessageCount, setVisibleMessageCount] = useState(INITIAL_MESSAGE_COUNT);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [originalMessages, setOriginalMessages] = useState({});

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  // Custom hooks - single source of truth
  const { deleteMessage: deleteMessageHook, fetchChats } = useChat();
  const { speak, isSpeaking, speakingIndex } = useTextToSpeech();
  const { translateMessage, isTranslating } = useTranslation(user.TranslateLanguage || "English");

  // Memoize today's date to avoid recalculating on every render
  const todayIST = useMemo(() => getTodayIST(), []);

  const handleDragEnd = useCallback((event, info, index) => {
    if (!visibleMessages || !visibleMessages[index]) return;
    
    if (visibleMessages[index].sender._id === user._id) {
      if (info.offset.x > 30 && speakVisible) {
        setSpeakVisible(null);
      }
      if (info.offset.x < -30) {
        setSpeakVisible(index);
      } 
      } else {
        if (info.offset.x < -30 && speakVisible) {
          setSpeakVisible(null);
        }
        if (info.offset.x > 30) {
          setSpeakVisible(index);
        }
      }
    }, [visibleMessages, user._id, speakVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (speakVisible !== null) {
        const clickedElement = event.target.closest(".allmsg");
        if (!clickedElement) {
          setSpeakVisible(null);
        }
      }
    };

    if (speakVisible !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [speakVisible]);

  // Format message time using utility function
  const getFormattedTime = useCallback((createdAt) => {
    return formatMessageTime(createdAt, todayIST);
  }, [todayIST]);
  
  useEffect(() => {
    if (messages.length < INITIAL_MESSAGE_COUNT + 1) {
      setVisibleMessages(messages);
    } else {
      setVisibleMessages(messages.slice(messages.length - visibleMessageCount, messages.length));
    }
  }, [messages, visibleMessageCount, selectedChat]);





  

  const deleteMessage = useCallback(async (messageId) => {
    if (!selectedChat) return;
    
    try {
      await deleteMessageHook(messageId, selectedChat._id);
      setSpeakVisible(null);
    } catch (error) {
      toast.error("Failed to delete message", {
        description: error?.response?.data?.message || error.message,
      });
    }
  }, [selectedChat, deleteMessageHook]);

  const handleTranslate = useCallback(async (i, msg) => {
    if (!visibleMessages || !visibleMessages[i]) return;
    
    if (clickedIndex === null) {
      setClickedIndex(i);
      const timeoutId = setTimeout(() => setClickedIndex(null), TRANSLATE_CLICK_TIMEOUT);
      return timeoutId;
    }

    if (clickedIndex === i && !isTranslating && visibleMessages[i].type !== "location") {
      // Store original message if not already stored
      if (!originalMessages[i]) {
        setOriginalMessages(prev => ({ ...prev, [i]: msg }));
      }

      // Update state to show "translating..."
      setVisibleMessages(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], content: "translating..." };
        return updated;
      });
      
      try {
        const translatedText = await translateMessage(msg);
        
        // Update state with translated message
        setVisibleMessages(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], content: translatedText };
          return updated;
        });
        setClickedIndex(null);
      } catch (error) {
        // Revert to original message on error
        const originalMsg = originalMessages[i] || msg;
        setVisibleMessages(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], content: originalMsg };
          return updated;
        });
        setClickedIndex(null);
      }
    }
  }, [clickedIndex, isTranslating, visibleMessages, translateMessage, originalMessages]);
  
     


  return (
    <TooltipProvider>
      <ScrollableFeed>
      {messages.length - visibleMessageCount > 0 ? (
        <button 
          className="w-1/2 py-[3px] translate-x-1/2 rounded-full self-center text-white"
          style={{ backgroundColor: primaryColor }}
          onClick={() => {
            messages.length - visibleMessageCount > LOAD_MORE_INCREMENT
              ? setVisibleMessageCount(prev => prev + LOAD_MORE_INCREMENT)
              : setVisibleMessageCount(messages.length);
          }}
        >
          load more
        </button>
      ) : null}
        {visibleMessages &&
          visibleMessages.map((m, i) => (
            <div 
              className={`allmsg flex relative transition-opacity ${
                speakingIndex !== null && speakingIndex !== i ? "opacity-50" : "opacity-100"
              } ${speakVisible !== null && speakVisible !== i ? "opacity-50" : ""}`} 
              key={m._id}
            >
              {isSameSender(visibleMessages, m, i, user._id) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar
                    className={`messagee${m._id} mt-[7px] mr-1 h-8 w-8 cursor-pointer`}
                    id={`messagee${m.sender._id === user._id ? "R" : "L"}`}
                    >
                      <AvatarImage src={m.sender.pic} alt={m.sender.name} />
                      <AvatarFallback>{m.sender.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    {m.sender.name}
                  </TooltipContent>
                </Tooltip>
              )}
            <motion.span
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => handleDragEnd(event, info, i)}
              id={`messagee${m.sender._id === user._id ? "R" : "L"}`}
              className={`messagee${m._id} ${m.sender._id === user._id ? "ml-auto" : "ml-0"} mt-[10px] mb-[10px] rounded-[20px] px-[15px] py-2 max-w-[75%] relative z-[50] flex items-center justify-center flex-col break-words whitespace-pre-wrap bg-black font-['DynaPuff']`}
              style={{
                transition: "none",
                color: m.sender._id === user._id ? primaryColor : "#fff",
                border: m.sender._id === user._id ? "1px solid #fff" : `1px solid ${primaryColor}`,
              }}
              onClick={() => handleTranslate(i, m.content)}
              >
              {selectedChat.isGroupChat && <span className="font-bold" style={{color:primaryColor}}>{m.sender._id === user._id ? "" : m.sender.name + " : "}</span>} 
              {m.content ? (
                m.type === "location" ? (
                  <a href={m.content} target="_blank" rel="noopener noreferrer" className="underline text-blue-500 font-sans">{m.content}</a>
                ) : (
                  m.content
                )
              ) : (
                <div 
                  onClick={() => {
                    const newWindow = window.open(m.file, "_blank", "noopener,noreferrer");
                    if (newWindow) {
                      newWindow.opener = null;
                    }
                  }}
                  className="h-[150px] w-[150px] bg-gray-100 flex items-end justify-center rounded-[10px] opacity-80 bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url(${m.file})` }}
                >
                  <img
                    src={m.file}
                    alt="File thumbnail"
                    loading="lazy"
                    className="block h-full w-full object-cover rounded-[10px]"
                  />
                </div>
              )}
              {m.file && (
                <p className="text-[10px] max-w-[150px] text-center font-semibold" style={{color: m.sender._id === user._id ? primaryColor : "#fff"}}>
                  {m.file.split("/").pop()}
                </p>
              )}
              <span
              className={`text-[8px] p-[5px] whitespace-nowrap min-w-fit w-fit -bottom-5 opacity-45 md:text-[8px] md:p-[2px] md:opacity-52 sm:text-[6px] sm:p-[2px] sm:-bottom-[10px] sm:opacity-65 ${m.sender._id === user._id ? "right-0 rounded-tl-[99px] rounded-tr-none rounded-br-[99px] rounded-bl-[99px]" : "left-1/2 -translate-x-1/2 rounded-tl-none rounded-tr-[99px] rounded-br-[99px] rounded-bl-[99px]"} absolute z-[100] bg-[#10b981] text-white font-['Atomic_Age']`}
              >
                {getFormattedTime(m.createdAt)}
              </span>
              {m.content && speakVisible === i && !isSpeaking && (
                <span
                  onClick={() => speak(m.content, i)}
                  className={`absolute top-[30px] ${m.sender._id === user._id ? "left-[-50px]" : "right-[-50px]"} bg-gray-500 hover:bg-[#10b981] text-white rounded px-[5px] py-[2px] cursor-pointer text-xs z-[100] transition-colors`}
                >
                  Speak
                </span>
              )}
              {speakVisible === i && m.sender._id === user._id && !isSpeaking && (
                <span
                  onClick={() => deleteMessage(m._id)}
                  className={`absolute ${m.sender._id === user._id ? "left-[-92px]" : "right-[-92px]"} top-0 bg-gray-500 hover:bg-red-500 text-white rounded px-[5px] py-[2px] cursor-pointer text-xs transition-colors`}
                >
                  Delete For All
                </span>
              )}
            </motion.span>
          </div>
        ))}
      </ScrollableFeed>
    </TooltipProvider>
  );
};

export default ScrollableChat;

