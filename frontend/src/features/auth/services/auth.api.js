import { api } from "./api.js";

export const register = (body) => api.post("/api/auth/register", body).then((res) => res.data);
export const login = (body) => api.post("/api/auth/login", body).then((res) => res.data);
export const logout = () => api.post("/api/auth/logout").then((res) => res.data);
export const getMe = () => api.get("/api/auth/me").then((res) => res.data);