import { useCallback, useEffect } from "react";
import { useSocket } from "./useSocket";
import { useChatStore, useNotificationStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { 
  useSendMessage, 
  useUploadFile, 
  useDeleteMessage,
  useAccessChat,
} from "./mutations/useChatMutations";

export const useChat = () => {
  const { socket, on, off, isConnected, emitJoinChat, emitNewMessage } = useSocket();
  const queryClient = useQueryClient();
  
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const addMessage = useChatStore((state) => state.addMessage);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Mutations
  const sendMessageMutation = useSendMessage();
  const uploadFileMutation = useUploadFile();
  const deleteMessageMutation = useDeleteMessage();
  const accessChatMutation = useAccessChat();

  // Join chat room when selected chat changes
  useEffect(() => {
    if (selectedChat?._id && isConnected) {
      emitJoinChat(selectedChat._id);
    }
  }, [selectedChat?._id, isConnected, emitJoinChat]);

  // Update Zustand store when queries update
  useEffect(() => {
    const chatsData = queryClient.getQueryData(queryKeys.chats.list());
    if (chatsData) {
      setChats(chatsData);
    }
  }, [queryClient, setChats]);

  const sendMessage = useCallback(async (content, chatId, type = "text") => {
    if (!content || !chatId) return null;

    sendMessageMutation.mutate(
      { content, chatId, type },
      {
        onSuccess: (message) => {
          if (isConnected) {
            emitNewMessage(message);
          }
          addMessage(chatId, message);
        },
      }
    );
  }, [sendMessageMutation, emitNewMessage, isConnected, addMessage]);

  const sendFile = useCallback(async (file, chatId) => {
    if (!file || !chatId) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId);

    uploadFileMutation.mutate(formData, {
      onSuccess: (message) => {
        if (isConnected) {
          emitNewMessage(message);
        }
        addMessage(chatId, message);
      },
    });
  }, [uploadFileMutation, emitNewMessage, isConnected, addMessage]);

  const deleteMessage = useCallback(async (messageId, chatId) => {
    if (!messageId || !chatId) return;
    deleteMessageMutation.mutate({ messageId, chatId });
  }, [deleteMessageMutation]);

  const fetchChats = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.chats.list() });
  }, [queryClient]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessageReceived = (newMessage) => {
      const chatId = newMessage.chat._id;
      
      // Optimistically add message to cache
      queryClient.setQueryData(
        queryKeys.messages.list(chatId),
        (oldMessages = []) => {
          // Check if message already exists
          if (oldMessages.some(msg => msg._id === newMessage._id)) {
            return oldMessages;
          }
          return [...oldMessages, newMessage];
        }
      );
      
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
  }, [socket, isConnected, selectedChat, on, off, addMessage, addNotification, queryClient]);

  return {
    chats,
    selectedChat,
    loading: sendMessageMutation.isPending || uploadFileMutation.isPending || deleteMessageMutation.isPending,
    
    sendMessage,
    sendFile,
    deleteMessage,
    fetchChats,
    setSelectedChat,
    accessChat: accessChatMutation.mutate,
    
    socket,
    isConnected,
  };
};
