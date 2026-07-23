"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, type UserInfo, setTokens, clearTokens, clearStoredAdmin, getAccessToken } from "@/lib/api-client";
import { generateSupplierCode, generateBuyerCode } from "@/lib/code-generator";

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
  // Backend JWT user info
  id?: string;
  company_name?: string;
  tier?: string;
  location?: string;
  logo?: string | null;
  /**
   * ASIN-like user code: `SR` + 8 chars (supplier) or `BR` + 8 chars (buyer).
   * Sourced from the backend `user_code` field; for buyer mock login a
   * temporary `BR` code is generated locally.
   */
  userCode?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  /** Login with backend JWT — returns true on success */
  loginWithBackend: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  loginWithBackend: async () => false,
  logout: () => {},
  updateUser: () => {},
  loading: true,
});

const STORAGE_KEY = "ihf_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a JWT token exists, try to restore user info from it
    const token = getAccessToken();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restoredUser: AuthUser = {
          ...parsed,
          emailVerified: parsed.emailVerified ?? false,
          phoneVerified: parsed.phoneVerified ?? false,
          phone: parsed.phone ?? "",
          password: parsed.password ?? "",
        };
        setUser(restoredUser);
      } catch {
        // ignore parse errors
      }
    } else if (token) {
      // Token exists but no local user — clear stale tokens
      clearTokens();
    }
    setLoading(false);
  }, []);

  const login = (authUser: AuthUser) => {
    const u: AuthUser = {
      ...authUser,
      emailVerified: authUser.emailVerified ?? false,
      phoneVerified: authUser.phoneVerified ?? false,
      phone: authUser.phone ?? "",
      password: authUser.password ?? "",
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const loginWithBackend = async (email: string, password: string): Promise<boolean> => {
    try {
      const resp = await authApi.userLogin(email, password);
      setTokens(resp.access_token, resp.refresh_token);
      // Clear any stale admin session data so AdminAuthProvider won't
      // try to restore an admin session with the supplier's token.
      clearStoredAdmin();

      const u: UserInfo = resp.user;
      const userType: "supplier" | "buyer" = u.type === "supplier" ? "supplier" : "buyer";
      // Prefer the ASIN-like user_code returned by the backend. During the
      // backend transition the field may be absent — generate a temporary
      // code by type so dashboards always have something to display. The
      // backend value takes over on the next login once it is available.
      const userCode = u.user_code || (userType === "supplier"
        ? generateSupplierCode()
        : generateBuyerCode());
      const authUser: AuthUser = {
        id: u.id,
        type: userType,
        name: u.name,
        email: u.email,
        phone: u.phone ?? "",
        company_name: u.company_name,
        tier: u.tier,
        location: u.location,
        logo: u.logo,
        role: u.tier === "verified" ? "已认证" : u.tier,
        emailVerified: u.email_verified === "1" || u.email_verified === "true",
        phoneVerified: u.phone_verified === "1" || u.phone_verified === "true",
        userCode,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return true;
    } catch (err) {
      console.error("Backend login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    clearTokens();
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
        loginWithBackend,
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
