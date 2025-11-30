import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getSender, getSenderFull } from "@/utils/chatLogics";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import ProfileModal from "@/components/Modals/ProfileModal";
import ScrollableChat from "./ScrollableChats";
import UpdateGroupChatModal from "@/components/Modals/UpdateGroupChatModal";
import MessageInput from "./MessageInput";
import ChatFeaturesGrid from "./ChatFeaturesGrid";
import MessageSkeletons from "./MessageSkeleton";
import { useAuthStore, useChatStore, useNotificationStore } from "@/stores";
import { useChat, useMessageNotifications } from "@/hooks";
import { useMessages } from "@/hooks/queries";
import Notification from "@/assets/notification.mp3";
import { getUserPics } from "@/lib/utils";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const sound = useRef(new Audio(Notification));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const notifications = useNotificationStore((state) => state.notifications);

  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedChat?._id, { enabled: !!selectedChat?._id, }
  );

  const {
    sendMessage: sendMessageHook,
    sendFile,
    fetchChats,
  } = useChat();

  useMessageNotifications({
    selectedChat,
    notifications,
    fetchChats,
    setFetchAgain,
    sound: sound.current,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get group member pics (up to 3, excluding current user)
  const groupMemberPics = selectedChat?.isGroupChat
    ? getUserPics(selectedChat, user?._id)
    : [];

  // Get group member user objects (up to 3, excluding current user)
  const groupMembers = selectedChat?.isGroupChat && selectedChat?.users
    ? selectedChat.users
      .filter(u => u?._id?.toString() !== user?._id?.toString())
      .slice(0, 3)
    : [];

  return (
    <>
      {selectedChat ? (
        <>
          <div
            className="text-[28px] md:text-[30px] pb-3 px-2 w-full flex justify-start items-center gap-2 font-['Atomic_Age']"
            style={{ color: "#10b981" }}
          >
            <Button
              className={`${isMobile ? "flex" : "hidden"} md:hidden text-neutral-500 hover:text-neutral-600`}
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChat("")}
            >
              <ArrowLeft className="h-4 w-4 text-neutral-500" />
            </Button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <div className="flex gap-2 items-center" >
                    <Avatar className="h-8 w-8 border" style={{ borderColor: "#10b981" }}>
                      <AvatarImage
                        src={getSenderFull(user, selectedChat.users).pic}
                        alt={getSender(user, selectedChat.users)}
                        onError={(e) => {
                          e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
                        }}
                      />
                      <AvatarFallback className="bg-neutral-200 text-neutral-600">
                        {getSender(user, selectedChat.users)?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-neutral-500 font-semibold capitalize font-saira">{getSender(user, selectedChat.users)}</span>
                    <ProfileModal profileUser={getSenderFull(user, selectedChat.users)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-500 font-semibold capitalize font-saira">
                      {selectedChat.chatName}
                    </span>
                    {groupMemberPics.length > 0 && (
                      <div className="flex items-center shrink-0 -space-x-1">
                        {groupMembers.map((member, index) => (
                          <Avatar
                            key={member._id}
                            className="h-7 w-7 border-2 border-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)]"
                            style={{
                              zIndex: groupMembers.length - index,
                            }}
                          >
                            <AvatarImage
                              src={member.pic}
                              alt={member.name}
                              onError={(e) => {
                                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
                              }}
                            />
                            <AvatarFallback className="text-xs bg-neutral-200 text-neutral-600">
                              {member.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </div>
                </>
              ))}
          </div>
          <div
            className="flex flex-col justify-end bg-stone-100 shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.1)]  w-full h-full rounded-lg overflow-y-hidden border-2">
            {messagesLoading ? (
              <div className="flex flex-col overflow-y-scroll scrollbar-none relative overflow-x-hidden bg-gradient-to-b from-transparent to-transparent"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                       45deg,
                       transparent,
                       transparent 19px,
                       rgba(0, 0, 0, 0.025) 19px,
                       rgba(0, 0, 0, 0.025) 20px
                     )`
                }}>
                <MessageSkeletons />
              </div>
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <MessageInput
              selectedChat={selectedChat}
              sendMessage={sendMessageHook}
              sendFile={sendFile}
            />
          </div>
        </>
      ) : (
        <ChatFeaturesGrid />
      )}
    </>
  );
};

export default SingleChat;
