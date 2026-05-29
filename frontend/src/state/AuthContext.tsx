import { createContext, ReactNode, useContext, useState } from "react";

import { AuthUser, UserRole } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  login: (token: string, role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as UserRole | null;
    const name = localStorage.getItem("name") || "";

    return token && role ? { token, role, name } : null;
  });

  function login(token: string, role: UserRole, name: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    setUser({ token, role, name });
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}

