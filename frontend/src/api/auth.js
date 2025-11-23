import apiClient from "./client";

export const login = async (email, password) => {
  const { data } = await apiClient.post("/api/user/login", { email, password });
  return data;
};

export const signup = async (name, email, password, pic) => {
  const { data } = await apiClient.post("/api/user", { name, email, password, pic });
  return data;
};

export const updateUser = async (userId, name, pic) => {
  const { data } = await apiClient.post("/api/user/update", { UserId: userId, name, pic });
  return data;
};
