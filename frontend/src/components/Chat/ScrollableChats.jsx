import { TooltipProvider } from "../UI/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useState, useEffect, useCallback, useMemo } from "react";
import { isSameSender } from "../../utils/chatLogics";
import { useAuthStore, useChatStore } from "../../stores";
import { toast } from "sonner";
import { useChat, useTranslation, useTextToSpeech } from "../../hooks";
import { formatMessageTime, getTodayIST } from "../../utils/dateUtils";
import LoadMoreButton from "./LoadMoreButton";
import MessageItem from "./MessageItem";


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

  // Custom hooks - single source of truth
  const { deleteMessage: deleteMessageHook } = useChat();
  const { speak, isSpeaking, speakingIndex } = useTextToSpeech();
  const { translateMessage, isTranslating } = useTranslation(user.TranslateLanguage || "English");

  const todayIST = useMemo(() => getTodayIST(), []);

  const handleDragEnd = useCallback((event, info, index) => {
    if (!visibleMessages || !visibleMessages[index] || !visibleMessages[index].sender) return;
    
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
  
     


  const handleLoadMore = useCallback(() => {
    const remainingCount = messages.length - visibleMessageCount;
    if (remainingCount > LOAD_MORE_INCREMENT) {
      setVisibleMessageCount(prev => prev + LOAD_MORE_INCREMENT);
    } else {
      setVisibleMessageCount(messages.length);
    }
  }, [messages.length, visibleMessageCount]);

  return (
    <TooltipProvider>
    <div className="flex flex-col  px-1 sm:px-3 overflow-y-scroll scrollbar-none relative overflow-x-hidden  from-transparent to-transparent bg-[repeating-linear-gradient(45deg,transparent,transparent_19px,rgba(0,0,0,0.025)_19px,rgba(0,0,0,0.025)_20px)]">
      <ScrollableFeed
       className="flex flex-col gap-6 max-w-full overflow-hidden">
        <LoadMoreButton
          onLoadMore={handleLoadMore}
          remainingCount={messages.length - visibleMessageCount}
          loadMoreIncrement={LOAD_MORE_INCREMENT}
        />
        {visibleMessages &&
          visibleMessages.map((m, i) => {
            const isCurrentUser = m.sender?._id === user._id;
            const showAvatar = isSameSender(visibleMessages, m, i, user._id) && m.sender;
            
            return (
              <MessageItem
                key={m._id}
                message={m}
                index={i}
                visibleMessages={visibleMessages}
                user={user}
                selectedChat={selectedChat}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
                formattedTime={getFormattedTime(m.createdAt)}
                speakVisible={speakVisible}
                isSpeaking={isSpeaking}
                speakingIndex={speakingIndex}
                onDragEnd={handleDragEnd}
                onTranslate={handleTranslate}
                onSpeak={speak}
                onDelete={deleteMessage}
              />
            );
          })}
      </ScrollableFeed>
      </div>
    </TooltipProvider>
  );
};

export default ScrollableChat;

