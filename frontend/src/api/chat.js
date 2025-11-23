import apiClient from "./client";

/**
 * Chat API Service
 * Handles all chat-related API calls
 */

// Get all chats for the current user
export const getAllChats = async () => {
  const { data } = await apiClient.get("/api/chat");
  return data;
};

// Access or create a one-on-one chat
export const accessChat = async (userId) => {
  const { data } = await apiClient.post("/api/chat", { userId });
  return data;
};

// Create a group chat
export const createGroupChat = async (name, users) => {
  const { data } = await apiClient.post("/api/chat/group", {
    name,
    users: JSON.stringify(users.map((u) => u._id)),
  });
  return data;
};

// Rename a group chat
export const renameGroupChat = async (chatId, chatName) => {
  const { data } = await apiClient.put("/api/chat/rename", {
    chatId,
    chatName,
  });
  return data;
};

// Add user to group chat
export const addUserToGroup = async (chatId, userId) => {
  const { data } = await apiClient.put("/api/chat/groupadd", {
    chatId,
    userId,
  });
  return data;
};

// Remove user from group chat
export const removeUserFromGroup = async (chatId, userId) => {
  const { data } = await apiClient.put("/api/chat/groupremove", {
    chatId,
    userId,
  });
  return data;
};

