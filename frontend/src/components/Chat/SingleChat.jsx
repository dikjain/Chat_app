import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { getSender, getSenderFull } from "@/utils/chatLogics";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import ProfileModal from "@/components/Modals/ProfileModal";
import ScrollableChat from "./ScrollableChats";
import { FiFile } from "react-icons/fi";
import { MdLocationOn, MdMic } from "react-icons/md";

import UpdateGroupChatModal from "@/components/Modals/UpdateGroupChatModal";
import { useAuthStore, useChatStore, useNotificationStore, useThemeStore } from "@/stores";
import { 
  useChat, 
  useSocket, 
  useAIAssistant, 
  useSpeechRecognition, 
  useLocation,
  useFileUpload,
  useMessageSender,
  useMessageNotifications
} from "@/hooks";

import Notification from "@/assets/notification.mp3";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // Store references
  const inputRef = useRef(null);
  const sound = useRef(new Audio(Notification));
  const lastFetchedChatId = useRef(null);

  // Store state
  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const getMessages = useChatStore((state) => state.getMessages);
  const messages = selectedChat ? getMessages(selectedChat._id) : [];
  const notifications = useNotificationStore((state) => state.notifications);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  // Core hooks
  const { 
    fetchMessages, 
    sendMessage: sendMessageHook, 
    sendFile,
    fetchChats,
    loading: chatLoading
  } = useChat();
  const { socket, isConnected } = useSocket();
  
  // Feature hooks
  const { handleTyping, aiMessage, clearMessage: clearAIMessage } = useAIAssistant({ debounceMs: 500 });
  const { 
    isListening, 
    transcript, 
    toggleListening, 
    clearTranscript 
  } = useSpeechRecognition();
  const { sendLocation: getLocation } = useLocation();
  
  // Message sending hook
  const { handleSendMessage, resetSent } = useMessageSender(
    sendMessageHook,
    clearAIMessage,
    clearTranscript
  );

  // File upload hook
  const handleFileSelect = async (file) => {
    if (!selectedChat) throw new Error("No chat selected");
    return await sendFile(file, selectedChat._id);
  };
  const { handleFileUpload, fileInputRef } = useFileUpload(handleFileSelect);

  // Local UI state
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages when chat changes
  useEffect(() => {
    const chatId = selectedChat?._id;
    if (chatId && chatId !== lastFetchedChatId.current) {
      lastFetchedChatId.current = chatId;
      fetchMessages(chatId);
    }
  }, [selectedChat?._id, fetchMessages]);

  // Handle location sending
  const handleSendLocation = async () => {
    if (!selectedChat) return;
    
    const locationUrl = await getLocation();
    if (locationUrl) {
      try {
        await sendMessageHook(locationUrl, selectedChat._id, "location");
      } catch (error) {
        // Error handling is done by interceptor
      }
    }
  };

  // Message notifications hook
  useMessageNotifications({
    selectedChat,
    notifications,
    fetchChats,
    setFetchAgain,
    sound: sound.current,
  });

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
  const typingHandler = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    handleTyping(value); // This handles debounced AI generation
  };

  // Send message handler
  const onKeyDown = (event) => {
    if (selectedChat) {
      handleSendMessage(event, newMessage, selectedChat._id);
      if (event.key === "Enter" && newMessage.trim()) {
        setNewMessage("");
        resetSent();
      }
    }
  };



  return (
    <>
      {selectedChat ? (
        <>
          <div
            className="text-[28px] md:text-[30px] pb-3 px-2 w-full flex justify-between items-center font-['Atomic_Age']"
            style={{ color: primaryColor }}
          >
            <Button
              className={`${window.innerWidth < 768 ? "flex" : "hidden"} md:hidden`}
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChat("")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <div className="flex gap-4 items-center" style={{ color: primaryColor }}>
                    {getSender(user, selectedChat.users).length > 7 && window.innerWidth < 550 ? (
                      <Avatar className="h-8 w-8 border" style={{ borderColor: primaryColor }}>
                        <AvatarImage src={getSenderFull(user, selectedChat.users).pic} alt={getSender(user, selectedChat.users)} />
                        <AvatarFallback>{getSender(user, selectedChat.users)?.charAt(0)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      getSender(user, selectedChat.users)
                    )}
                    <ProfileModal profileUser={getSenderFull(user, selectedChat.users)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4 items-center" style={{ color: primaryColor }}>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </div>
                </>
              ))}
          </div>
          <div
            id="msgdabba"
            className="flex flex-col justify-end p-3 bg-[#020202] w-full h-full rounded-lg overflow-y-hidden border-2 shadow-[0px_0px_10px_5px_#10b981]"
            style={{ borderColor: primaryColor }}
          >
            {chatLoading ? (
              <div className="flex justify-center items-center m-auto">
                <Spinner className="h-10 w-10" style={{ color: primaryColor }} />
              </div>
            ) : (
              <div className="flex flex-col overflow-y-scroll scrollbar-none relative overflow-x-hidden max-w-full">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <div onKeyDown={onKeyDown} className="mt-3">
              <div className="flex items-center mt-5 relative">
                <Input
                  onClick={() => {
                    setNewMessage(aiMessage);
                    clearAIMessage();
                  }}
                  className="absolute -top-[70%] z-50 bg-black cursor-pointer h-fit"
                  style={{ color: primaryColor }}
                  placeholder="Ai Assistant..."
                  value={aiMessage}
                  readOnly
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*,application/pdf"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 p-0 m-0 ml-2"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Upload File"
                  onClick={handleFileUpload}
                >
                  <FiFile />
                </Button>
                <Input
                  className="bg-[#E0E0E0]"
                  style={{ color: primaryColor }}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  ref={inputRef}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 p-0 m-0 ml-2"
                  style={{ backgroundColor: isListening ? "red" : primaryColor }}
                  aria-label="Toggle Speech Recognition"
                  onClick={toggleListening}
                >
                  <MdMic />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 p-0 m-0 ml-2"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Send Location"
                  onClick={handleSendLocation}
                >
                  <MdLocationOn />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // to get socket.io on same page
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl pb-3 font-['Atomic_Age']" style={{ color: primaryColor }}>
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
