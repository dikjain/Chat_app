import axios from "axios";

export const login = async (email, password) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const { data } = await axios.post("/api/user/login", { email, password }, config);
  return data;
};

export const signup = async (name, email, password, pic) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  console.log(name, email, password, pic);
  const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
  return data;
};

export const updateUser = async (userId, name, pic, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.post("/api/user/update", { UserId: userId, name, pic }, config);
  return data;
};
