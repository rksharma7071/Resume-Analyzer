import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const register = async ({ name, email, password }) => {
  const { data } = await api.post("/api/auth/register", { name, email, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.get("/api/auth/logout");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};