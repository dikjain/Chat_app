import apiClient from "./client";

export const getMessages = async (chatId) => {
  const { data } = await apiClient.get(`/api/message/${chatId}`);
  return data;
};

export const sendMessage = async (content, chatId, type = "text") => {
  const { data } = await apiClient.post("/api/message", {
    content,
    chatId,
    type,
  });
  return data;
};

export const uploadFile = async (formData) => {
  const { data } = await apiClient.post("/api/message/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await apiClient.post("/api/Message/delete", { messageId });
  return data;
};

export const updateLatestMessage = async (chatId, latestMessage) => {
  const { data } = await apiClient.post("/api/message/ChangeLatestMessage", {
    chatId,
    latestMessage,
  });
  return data;
};
