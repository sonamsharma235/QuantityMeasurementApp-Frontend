import API from "./api";

export const signup = async (data) => {
  const res = await API.post("/users/register", data);  // ✅ FIX
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/users/login", data);     // ✅ FIX
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/users/me")
  return res.data;
};