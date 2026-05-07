import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { useGetMe } from "@workspace/api-client-react";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  walletBalance: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem("techofy_token"); } catch { return null; }
  });

  useEffect(() => {
    setAuthTokenGetter(() => {
      try { return localStorage.getItem("techofy_token"); } catch { return null; }
    });
  }, []);

  const { data: user, isLoading } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  const handleLogin = (newToken: string) => {
    try { localStorage.setItem("techofy_token", newToken); } catch {}
    setToken(newToken);
    setAuthTokenGetter(() => newToken);
  };

  const handleLogout = () => {
    try { localStorage.removeItem("techofy_token"); } catch {}
    setToken(null);
    setAuthTokenGetter(() => null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user: (user as User) ?? null,
        isLoading: !!token && isLoading,
        isAuthenticated: !!user && !!token,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
