import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import ChatListItem from "./ChatListItem";
import MyChatsHeader from "./MyChatsHeader";
import { useAuthStore, useChatStore } from "@/stores";
import { useSocket } from "@/hooks";
import { useChats } from "@/hooks/queries";

const MyChats = () => {
  const { socket, on, off, isConnected, emitUserDisconnected, emitUserReconnected, reconnect } = useSocket();
  const { data: chats = [], isLoading } = useChats();
  
  const [loggedUser, setLoggedUser] = useState();
  const [onlinepeople, setonlinepeople] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

  useEffect(() => {
    setLoggedUser(user);
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOnlineUsers = (dat) => {
      setonlinepeople(dat);
    };

    const handleDisconnect = () => {
      emitUserDisconnected();
    };

    on("onlineUsers", handleOnlineUsers);

    window.addEventListener("beforeunload", handleDisconnect);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleDisconnect();
      } else if (document.visibilityState === "visible") {
        reconnect();
        emitUserReconnected();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      off("onlineUsers");
      window.removeEventListener("beforeunload", handleDisconnect);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, isConnected, on, off, emitUserDisconnected, emitUserReconnected, reconnect]);



  return (
    <div
    style={{ flex: isMobile ? '1 1 100%' : '0 1 30%' }}
    className={`${selectedChat ? "hidden" : "flex"} ring-neutral-300 relative ring-2 md:flex h-full flex-col items-center p-3 bg-white rounded-lg border overflow-hidden`}
    >
      <MyChatsHeader />
      <div className="bottom-0 w-full h-full absolute bg-white z-[40] pointer-events-none" style={{ mask: 'linear-gradient(to top,white, transparent, transparent, transparent, transparent)' }} />
      <div
        className="flex pb-32  relative flex-col p-2 gap-2  bg-stone-100 w-full h-full rounded-md overflow-y-scroll border-2 shadow-inner"
      >
        {isLoading ? (
          <ChatLoading />
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              loggedUser={loggedUser}
              user={user}
              selectedChat={selectedChat}
              onlinepeople={onlinepeople}
              setSelectedChat={setSelectedChat}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyChats;
