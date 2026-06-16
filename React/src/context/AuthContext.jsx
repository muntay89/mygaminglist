import { createContext, useContext, useState, useEffect} from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsLoggedIn(!!res.data.user);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(username, password) {
    const res = await api.post("/auth/login", { username, password });
    setUser(res.data.user);
    setIsLoggedIn(true);
    // return res.data.user;
  }
  async function signup(username, password) {
    const res = await api.post("/auth/signup", {username, password})
    setUser(res.data.user)
    setIsLoggedIn(true)
  }
  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setIsLoggedIn(false);
  }
  return (
    <AuthContext.Provider
      value={{user, isLoggedIn, 
        loading, login, signup, logout,}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

