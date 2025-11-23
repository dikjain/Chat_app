import { useEffect, useRef } from "react";
import { useSocket } from "./useSocket";

const useMessageNotifications = ({
  selectedChat,
  notifications,
  onMessageReceived,
  fetchChats,
  setFetchAgain,
  sound,
}) => {
  const { socket, on, off, isConnected } = useSocket();
  const selectedChatCompareRef = useRef(null);

  // Update ref when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      selectedChatCompareRef.current = selectedChat;
    }
  }, [selectedChat]);

  const fetchChatsRef = useRef(fetchChats);
  const setFetchAgainRef = useRef(setFetchAgain);
  const notificationsRef = useRef(notifications);
  const onMessageReceivedRef = useRef(onMessageReceived);
  const soundRef = useRef(sound);
  
  // Update refs when values change (without triggering effects)
  useEffect(() => {
    fetchChatsRef.current = fetchChats;
    setFetchAgainRef.current = setFetchAgain;
    notificationsRef.current = notifications;
    onMessageReceivedRef.current = onMessageReceived;
    soundRef.current = sound;
  }, [fetchChats, setFetchAgain, notifications, onMessageReceived, sound]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessageReceived = (newMessageReceived) => {
      const chatId = newMessageReceived.chat._id;
      
      // Call the callback if provided
      if (onMessageReceivedRef.current) {
        onMessageReceivedRef.current(newMessageReceived);
      }
      
      // If message is for different chat, play sound and refresh
      if (!selectedChatCompareRef.current || selectedChatCompareRef.current._id !== chatId) {
        if (!notificationsRef.current.find(n => n._id === newMessageReceived._id)) {
          setFetchAgainRef.current?.((prevFetchAgain) => !prevFetchAgain);
          fetchChatsRef.current?.();
          if (soundRef.current) {
            soundRef.current.play().catch(error => {
              console.error("Failed to play notification sound:", error);
            });
          }
        }
      } else {
        // Message is for current chat - UI update handled by useChat
        fetchChatsRef.current?.();
      }
    };

    on("message received", handleMessageReceived);

    return () => {
      off("message received");
    };
  }, [socket, isConnected, on, off]);
};

export default useMessageNotifications;

