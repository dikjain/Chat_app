import apiClient from "./client";


export const searchUsers = async (searchQuery) => {
  const { data } = await apiClient.get(`/api/user?search=${searchQuery}`);
  return data;
};

export const getUserDetails = async (email) => {
  const { data } = await apiClient.post("/api/user/getuserdetails", { email });
  return data;
};

export const updateUserLanguage = async (userId, language) => {
  const { data } = await apiClient.post("/api/user/updatelanguage", {
    UserId: userId,
    language,
  });
  return data;
};

