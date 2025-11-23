import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { getSender, getSenderFull } from "@/utils/chatLogics";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import ProfileModal from "@/components/Modals/ProfileModal";
import ScrollableChat from "./ScrollableChats";
import UpdateGroupChatModal from "@/components/Modals/UpdateGroupChatModal";
import MessageInput from "./MessageInput";
import { useAuthStore, useChatStore, useNotificationStore } from "@/stores";
import { useChat, useMessageNotifications } from "@/hooks";
import Notification from "@/assets/notification.mp3";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // Store references
  const sound = useRef(new Audio(Notification));
  const lastFetchedChatId = useRef(null);

  // Store state
  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const getMessages = useChatStore((state) => state.getMessages);
  const messages = selectedChat ? getMessages(selectedChat._id) : [];
  const notifications = useNotificationStore((state) => state.notifications);

  // Core hooks
  const { 
    fetchMessages, 
    sendMessage: sendMessageHook, 
    sendFile,
    fetchChats,
    loading: chatLoading
  } = useChat();

  // Fetch messages when chat changes
  useEffect(() => {
    const chatId = selectedChat?._id;
    if (chatId && chatId !== lastFetchedChatId.current) {
      lastFetchedChatId.current = chatId;
      fetchMessages(chatId);
    }
  }, [selectedChat?._id, fetchMessages]);

  // Message notifications hook
  useMessageNotifications({
    selectedChat,
    notifications,
    fetchChats,
    setFetchAgain,
    sound: sound.current,
  });



  return (
    <>
      {selectedChat ? (
        <>
          <div
            className="text-[28px] md:text-[30px] pb-3 px-2 w-full flex justify-between items-center font-['Atomic_Age']"
            style={{ color: "#10b981" }}
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
                  <div className="flex gap-4 items-center" style={{ color: "#10b981" }}>
                    {getSender(user, selectedChat.users).length > 7 && window.innerWidth < 550 ? (
                      <Avatar className="h-8 w-8 border" style={{ borderColor: "#10b981" }}>
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
                  <div className="flex gap-4 items-center" style={{ color: "#10b981" }}>
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
            className="flex flex-col justify-end bg-stone-100 shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.1)]  w-full h-full rounded-lg overflow-y-hidden border-2">
            {chatLoading ? (
              <div className="flex justify-center items-center m-auto">
                <Spinner className="h-10 w-10" style={{ color: "#10b981" }} />
              </div>
            ) : (
              <div className="flex flex-col max-h-[67vh] px-3 overflow-y-scroll scrollbar-none relative overflow-x-hidden ">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <MessageInput 
              selectedChat={selectedChat} 
              sendMessage={sendMessageHook} 
              sendFile={sendFile} 
            />
          </div>
        </>
      ) : (
        // to get socket.io on same page
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl pb-3 font-['Atomic_Age']" style={{ color: "#10b981" }}>
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
