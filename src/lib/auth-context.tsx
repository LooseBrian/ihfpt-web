"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserType = "supplier" | "buyer" | null;

export interface AuthUser {
  type: UserType;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  password?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  loading: true,
});

const STORAGE_KEY = "ihf_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure verification flags default to false if not set
        const user: AuthUser = {
          ...parsed,
          emailVerified: parsed.emailVerified ?? false,
          phoneVerified: parsed.phoneVerified ?? false,
          phone: parsed.phone ?? "",
          password: parsed.password ?? "",
        };
        setUser(user);
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = (authUser: AuthUser) => {
    const user: AuthUser = {
      ...authUser,
      emailVerified: authUser.emailVerified ?? false,
      phoneVerified: authUser.phoneVerified ?? false,
      phone: authUser.phone ?? "",
      password: authUser.password ?? "",
    };
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
