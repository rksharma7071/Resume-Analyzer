import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getMe();
        if (!cancelled) setUser(data?.user ?? null);
      } catch (error) {
        // 401 = guest, don't spam the console
        if (error?.response?.status !== 401) {
          console.error("getMe failed:", error);
        }
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};