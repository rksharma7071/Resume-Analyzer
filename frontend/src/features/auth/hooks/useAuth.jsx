import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout } from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ name, email, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Invalid email or password",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      return { success: true };
    } catch {
      setUser(null); // clear locally even if the server call fails
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleRegister, handleLogin, handleLogout };
};