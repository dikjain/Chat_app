import { useEffect, useState, useRef } from "react";
import ChatLoading from "./ChatLoading";
import ChatListItem from "./ChatListItem";
import MyChatsHeader from "./MyChatsHeader";
import { useAuthStore, useChatStore } from "@/stores";
import { useSocket, useChat } from "@/hooks";



const MyChats = ({ fetchAgain }) => {
  const { socket, on, off, isConnected, emitUserDisconnected, emitUserReconnected, reconnect } = useSocket();
  const { fetchChats, chats } = useChat();
  
  console.log(chats);
  const [loggedUser, setLoggedUser] = useState();
  const [onlinepeople, setonlinepeople] = useState([]);

  const user = useAuthStore((state) => state.user);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

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
  

  
  const lastFetchRef = useRef(null);
  
  useEffect(() => {
    setLoggedUser(user);
    
    const fetchKey = `${fetchAgain}-${user?._id}`;
    if (lastFetchRef.current !== fetchKey) {
      lastFetchRef.current = fetchKey;
      fetchChats();
    }
  }, [fetchAgain, user?._id, fetchChats]);



  return (
    <div
    style={{ flex: '0 1 30%' }}
    className={`${selectedChat ? "hidden" : "flex"} ring-neutral-300 relative ring-2 md:flex h-full flex-col items-center p-3 bg-white rounded-lg border overflow-hidden`}
    >
      <MyChatsHeader />
      <div className="bottom-0 w-full h-full absolute bg-white z-[40] pointer-events-none" style={{ mask: 'linear-gradient(to top,white, transparent, transparent, transparent, transparent)' }} />
      <div
        className="flex pb-32  relative flex-col p-2 gap-2  bg-stone-100 w-full h-full rounded-md overflow-y-scroll border-2 shadow-inner"
      >
        {chats ? (
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
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
