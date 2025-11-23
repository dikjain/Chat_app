import { useCallback, useEffect } from "react";
import { useSocket } from "./useSocket";
import { useApi } from "./useApi";
import { 
  getMessages, 
  sendMessage as sendMessageAPI, 
  uploadFile, 
  getAllChats,
  deleteMessage as deleteMessageAPI,
  updateLatestMessage 
} from "@/api";
import { useChatStore, useNotificationStore } from "@/stores";
import { toast } from "sonner";

export const useChat = () => {
  const { socket, on, off, emit, isConnected } = useSocket();
  
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);
  const removeMessage = useChatStore((state) => state.removeMessage);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const fetchMessagesApi = useApi(getMessages);
  const sendMessageApi = useApi(sendMessageAPI);
  const fetchChatsApi = useApi(getAllChats);
  const uploadFileApi = useApi(uploadFile);

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return;

    try {
      const messages = await fetchMessagesApi.execute(chatId);
      setMessages(chatId, messages);
      
      if (isConnected) {
        emit("join chat", chatId);
      }
      
      return messages;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages", {
        description: error?.message || "Please try again",
      });
      return [];
    }
  }, [fetchMessagesApi, setMessages, emit, isConnected]);

  const sendMessage = useCallback(async (content, chatId, type = "text") => {
    if (!content || !chatId) return null;

    try {
      const message = await sendMessageApi.execute(content, chatId, type);
      
      if (isConnected) {
        emit("new message", message);
      }
      
      addMessage(chatId, message);
      
      await fetchChatsApi.execute();
      
      return message;
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message", {
        description: error?.message || "Please try again",
      });
      return null;
    }
  }, [sendMessageApi, emit, isConnected, addMessage, fetchChatsApi]);

  const sendFile = useCallback(async (file, chatId) => {
    if (!file || !chatId) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId);

    try {
      const message = await uploadFileApi.execute(formData);
      
      if (isConnected) {
        emit("new message", message);
      }
      
      addMessage(chatId, message);
      
      await fetchChatsApi.execute();
      
      return message;
    } catch (error) {
      console.error("Failed to send file:", error);
      toast.error("Failed to send file", {
        description: error?.message || "Please try again",
      });
      return null;
    }
  }, [uploadFileApi, emit, isConnected, addMessage, fetchChatsApi]);

  const messages = useChatStore((state) => state.messages);

  const deleteMessage = useCallback(async (messageId, chatId) => {
    if (!messageId || !chatId) return;

    try {
      const currentMessages = messages[chatId] || [];
      const latestMessageId = messageId === currentMessages[currentMessages.length - 1]?._id
        ? (currentMessages[currentMessages.length - 2]?._id || null)
        : currentMessages[currentMessages.length - 1]?._id;

      await Promise.all([
        deleteMessageAPI(messageId),
        updateLatestMessage(chatId, latestMessageId)
      ]);

      removeMessage(chatId, messageId);
      
      await fetchChatsApi.execute();
      
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message", {
        description: error?.message || "Please try again",
      });
    }
  }, [removeMessage, fetchChatsApi, messages]);

  const fetchChats = useCallback(async () => {
    try {
      const chatsData = await fetchChatsApi.execute();
      setChats(chatsData);
      return chatsData;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      // Don't show toast for fetchChats as it's called frequently
      return [];
    }
  }, [fetchChatsApi, setChats]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessageReceived = (newMessage) => {
      const chatId = newMessage.chat._id;
      
      if (selectedChat?._id === chatId) {
        addMessage(chatId, newMessage);
      } else {
        addNotification(newMessage);
      }
    };

    on("message received", handleMessageReceived);

    return () => {
      off("message received");
    };
  }, [socket, isConnected, selectedChat, on, off, addMessage, addNotification]);

  return {
    chats,
    selectedChat,
    loading: fetchMessagesApi.loading || sendMessageApi.loading,
    
    fetchMessages,
    sendMessage,
    sendFile,
    deleteMessage,
    fetchChats,
    setSelectedChat,
    
    socket,
    isConnected,
    emit,
  };
};
