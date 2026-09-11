"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "./api-client";

interface User {
  id: string;
  email: string;
  name: string | null;
  home_airport?: string | null;
  preferred_currency?: string;
  preferred_travel_style?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("tripsage_token");
    if (storedToken) {
      setToken(storedToken);
      apiClient<User>("/auth/me", { token: storedToken })
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("tripsage_token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("tripsage_token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("tripsage_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
