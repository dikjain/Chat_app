import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const navigate = useNavigate()
  const [a, seta] = useState(true)
  const [videocall, setVideocall] = useState(false)
  const [enableAnimation, setEnableAnimation] = useState(true)
  const [isOneOnOneCall, setIsOneOnOneCall] = useState(true)
  const [videoCallUser, setVideoCallUser] = useState([])
  const [chatsVideo, setChatsVideo] = useState([])
  const [primaryColor, setPrimaryColor] = useState("#48bb78")
  const [secondaryColor, setSecondaryColor] = useState("green")


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/")
  }, []);

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
        a,
        seta,
        enableAnimation,
        setEnableAnimation,
        videocall,
        setVideocall,
        isOneOnOneCall,
        setIsOneOnOneCall,
        videoCallUser,
        setVideoCallUser,
        chatsVideo,
        setChatsVideo,
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor
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