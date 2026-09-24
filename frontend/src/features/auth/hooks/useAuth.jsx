import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async ({ name, email, password }) => {
    setLoading(true);

    try {
      const data = await register({ name, email, password });

      setUser(data.user);
    } catch (error) {

    }
    finally {
      setLoading(false);
    }
  }

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      setUser(data.user);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    setLoading(true);

    try {
      const data = await logout();

      setUser(null);

    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getAndSendUser = async () => {
      const data = await getMe();
      setUser(data.user);
      setLoading(false);
    }

    getAndSendUser();
  }, [])


  return { user, loading, handleRegister, handleLogin, handleLogout }
}