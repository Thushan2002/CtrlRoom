import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const saveAuth = useCallback((nextToken, nextUser, nextRole) => {
    if (nextToken) {
      localStorage.setItem("auth_token", nextToken);
    } else {
      localStorage.removeItem("auth_token");
    }
    setToken(nextToken);
    setUser(nextUser);
    setRole(nextRole);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!localStorage.getItem("auth_token")) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get("/user");
      setUser(data.user || null);
      setRole(data.role || null);
    } catch (error) {
      // invalid token, clear it
      saveAuth(null, null, null);
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(
    async ({ email, password }) => {
      const { data } = await API.post("/login", { email, password });
      saveAuth(data.token, data.user, data.role);
      return data;
    },
    [saveAuth]
  );

  const signupStudent = useCallback(
    async ({ name, email, password, password_confirmation }) => {
      const { data } = await API.post("/register/student", {
        name,
        email,
        password,
        password_confirmation,
      });
      return data;
    },
    []
  );

  const signupAdmin = useCallback(
    async ({ name, email, password, password_confirmation }) => {
      const { data } = await API.post("/register/admin", {
        name,
        email,
        password,
        password_confirmation,
      });
      return data;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await API.post("/logout");
      navigate("/");
    } catch (_) {
      // ignore
    }
    saveAuth(null, null, null);
  }, [saveAuth]);

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      loading,
      login,
      signupStudent,
      signupAdmin,
      logout,
      fetchCurrentUser,
    }),
    [
      user,
      role,
      token,
      loading,
      login,
      signupStudent,
      signupAdmin,
      logout,
      fetchCurrentUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};