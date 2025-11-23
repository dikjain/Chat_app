import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getSender } from "@/utils/chatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "@/components/Modals/GroupChatModal";
import { Button } from "@/components/ui/button";
import { useAuthStore, useChatStore, useThemeStore } from "@/stores";
import { useSocket, useChat } from "@/hooks";



const MyChats = ({ fetchAgain }) => {
  // Custom hooks - single source of truth
  const { socket, on, off, emit, isConnected } = useSocket();
  const { fetchChats, chats } = useChat();
  
  const [loggedUser, setLoggedUser] = useState();
  const [onlinepeople, setonlinepeople] = useState([]);

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for online users
    const handleOnlineUsers = (dat) => {
      setonlinepeople(dat);
    };

    // Emit "dedi" event when requested
    const handleDetailde = () => {
      emit("dedi", user);
    };

    // Handle user disconnection
    const handleDisconnect = () => {
      emit("userDisconnected", user);
    };

    on("onlineUsers", handleOnlineUsers);
    on("detailde", handleDetailde);

    // Add event listeners
    window.addEventListener("beforeunload", handleDisconnect);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleDisconnect();
      } else if (document.visibilityState === "visible") {
        if (!isConnected && socket) {
          socket.connect();
        }
        emit("userReconnected", user);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      off("onlineUsers");
      off("detailde");
      window.removeEventListener("beforeunload", handleDisconnect);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, isConnected, user, on, off, emit]);
  

  
  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);



  return (
    <div
    className={`${selectedChat ? "hidden" : "flex"} md:flex flex-col items-center p-3 bg-black w-full md:w-[31%] rounded-lg border`}
    >
      <div
        className="pb-3 px-3 text-[28px] md:text-[30px] flex w-full justify-around items-center font-['Atomic_Age']"
        style={{ color: primaryColor }}
      >
        My Chats
        <GroupChatModal>
          <Button
            className="flex text-[17px] md:text-[10px] lg:text-[17px] font-['Roboto']"
          >
            New Group Chat
            <Plus className="ml-1 h-4 w-4" />
          </Button>
        </GroupChatModal>
      </div>
      <div
        className="flex flex-col p-3 bg-[#020202] w-full h-full rounded-lg overflow-y-scroll border-2 shadow-[0px_0px_10px_5px_#10b981]"
        style={{ borderColor: primaryColor }}
      >
        {chats ? (
            chats.map((chat) => (
              <div
              className={`cursor-pointer transition-all duration-200 px-3 py-2 mx-[7px] my-[2px] rounded-lg relative font-['Roboto'] font-light z-30 border-2 border-[#10b981] ${
                selectedChat && selectedChat._id === chat._id 
                  ? "shadow-[#10b981_0px_0px_12px_5px]" 
                  : "shadow-[#10b981_0px_0px_7px_2px]"
              }`}
              style={{
                backgroundColor: selectedChat ? (selectedChat._id === chat._id ? primaryColor : "#E8E8E8") : "#E8E8E8",
              }}
              onClick={() => setSelectedChat(chat)}
              key={chat._id}
              >
                {!chat.isGroupChat && chat.users[0] && chat.users[1] && (chat.users[0]._id == user._id ? onlinepeople.includes(chat.users[1]._id) :onlinepeople.includes(chat.users[0]._id)) && (
                  <div className="absolute right-[5%] top-[40%] w-[10px] h-[10px] rounded-full bg-[#10b981] shadow-[#48bb78_0px_0px_5px_1px]"></div>
                )}
                <p className="font-medium" style={{ color: selectedChat ? (selectedChat._id === chat._id ? "white" : "black") : "black" }}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>

                {chat.latestMessage && (
                  <p className="text-xs" style={{ color: selectedChat ? (selectedChat._id === chat._id ? "white" : "black") : "black" }}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content 
                      ? (chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content)
                      : "File"}
                  </p>
                )}
              </div>
            ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
