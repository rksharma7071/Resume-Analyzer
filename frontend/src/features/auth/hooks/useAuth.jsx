import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, logout, register } from "../services/auth.api.js";
import { getErrorMessage } from "../services/api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const { user, setUser, loading } = context;

  const authenticate = async (request, fallback) => {
    try {
      const data = await request();
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, fallback) };
    }
  };

  const handleRegister = (values) => authenticate(() => register(values), "Registration failed.");
  const handleLogin = (values) => authenticate(() => login(values), "Login failed.");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  };

  return { user, loading, handleRegister, handleLogin, handleLogout };
};