import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const navigate = useNavigate()
  const location = useLocation()
  const [videocall, setVideocall] = useState(false)
  const [isOneOnOneCall, setIsOneOnOneCall] = useState(true)
  const [videoCallUser, setVideoCallUser] = useState([])
  const [chatsVideo, setChatsVideo] = useState([])
  const [primaryColor, setPrimaryColor] = useState("#48bb78")


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo && location.pathname !== "/" && location.pathname !== "/auth") {
      navigate("/")
    }
  }, [location.pathname, navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        videocall,
        setVideocall,
        isOneOnOneCall,
        setIsOneOnOneCall,
        videoCallUser,
        setVideoCallUser,
        chatsVideo,
        setChatsVideo,
        primaryColor,
        setPrimaryColor
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;