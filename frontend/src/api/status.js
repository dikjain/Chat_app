import apiClient from "./client";

export const createStatus = async (userId, content, mediaUrl) => {
  const { data } = await apiClient.post("/api/status", {
    id: userId,
    content,
    mediaUrl,
  });
  return data;
};

export const fetchStatus = async (userId) => {
  const { data } = await apiClient.post("/api/status/fetch", {
    id: userId,
  });
  return data;
};

export const deleteStatus = async (statusId) => {
  const { data } = await apiClient.post("/api/status/delete", {
    id: statusId,
  });
  return data;
};
