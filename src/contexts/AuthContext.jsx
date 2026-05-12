import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const stored = () => {
  try {
    const u = localStorage.getItem("mth_user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(stored);

  const login = (userData, token) => {
    if (token) localStorage.setItem("mth_token", token);
    localStorage.setItem("mth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("mth_token");
    localStorage.removeItem("mth_user");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
