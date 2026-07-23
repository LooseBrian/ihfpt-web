"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  authApi,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  getStoredAdmin,
  setStoredAdmin,
  ApiError,
  type AdminInfo,
} from "./api-client";

// ===== Helpers =====

/**
 * Check if the JWT currently in localStorage belongs to an admin session.
 * Used to guard against a race condition where a supplier/buyer logs in
 * while AdminAuthProvider.restoreSession() is still running an async
 * adminMe()/adminRefresh() call — in that case the token has already been
 * replaced and we must NOT clear it.
 */
function isCurrentTokenAdmin(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.guard === "admin";
  } catch {
    return false;
  }
}

// ===== Admin Role System =====

export type AdminRole = "super_admin" | "operations_manager" | "content_editor" | "auditor" | "viewer";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  roleLabels: string[];
  permissions: string[];
  department: string;
  avatar?: string;
  lastLogin?: string;
}

// ===== Permission Matrix (fallback for offline/legacy) =====

export type Permission =
  | "dashboard.view"
  | "products.review"
  | "products.approve"
  | "products.reject"
  | "suppliers.view"
  | "suppliers.verify"
  | "suppliers.suspend"
  | "buyers.view"
  | "buyers.suspend"
  | "inquiries.view"
  | "inquiries.close"
  | "content.news"
  | "content.banner"
  | "content.publish"
  | "settings.users"
  | "settings.roles"
  | "settings.system"
  | "settings.logs";

export const roleLabels: Record<string, string> = {
  super_admin: "超级管理员",
  operations_manager: "运营主管",
  content_editor: "内容编辑",
  auditor: "审核员",
  viewer: "只读查看员",
};

export const roleColors: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700",
  operations_manager: "bg-brand-100 text-brand-700",
  content_editor: "bg-trust-100 text-trust-700",
  auditor: "bg-gold-100 text-gold-700",
  viewer: "bg-muted text-muted-foreground",
};

// ===== Context =====

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  hasAnyPermission: (perms: string[]) => boolean;
  /** Force re-fetch admin info from backend */
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage tokens
  useEffect(() => {
    const restoreSession = async () => {
      const token = getAccessToken();
      const storedAdmin = getStoredAdmin();

      // Only restore admin session if the JWT actually belongs to an admin.
      // If the current token is a supplier/buyer token (guard="user"), skip
      // admin restore entirely — otherwise adminRefresh() would fail and
      // clearTokens() would destroy the supplier's session.
      const isAdminToken = (() => {
        if (!token) return false;
        try {
          const parts = token.split(".");
          if (parts.length < 2) return false;
          const payload = JSON.parse(
            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          return payload.guard === "admin";
        } catch {
          return false;
        }
      })();

      if (isAdminToken && storedAdmin) {
        // We have a token and cached admin data - restore immediately
        setUser(mapAdminInfo(storedAdmin));

        // Validate token is still valid by calling /me
        try {
          const freshAdmin = await authApi.adminMe();
          const mappedAdmin = mapAdminInfo(freshAdmin);
          setUser(mappedAdmin);
          setStoredAdmin(freshAdmin);
        } catch {
          // Token might be expired - try refresh
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const result = await authApi.adminRefresh(refreshToken);
              setTokens(result.access_token, result.refresh_token);
              // Fetch admin info with new token
              const freshAdmin = await authApi.adminMe();
              const mappedAdmin = mapAdminInfo(freshAdmin);
              setUser(mappedAdmin);
              setStoredAdmin(freshAdmin);
            } catch {
              // Refresh failed. CRITICAL: only clear tokens if the current
              // token is STILL an admin token. If a supplier/buyer logged in
              // while this async restore was in flight, the token has been
              // replaced and clearing it would destroy their session.
              if (isCurrentTokenAdmin()) {
                clearTokens();
              }
              setUser(null);
            }
          } else {
            // No refresh token — same guard applies.
            if (isCurrentTokenAdmin()) {
              clearTokens();
            }
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const loginResp = await authApi.adminLogin(email, password);

        // Store tokens
        setTokens(loginResp.access_token, loginResp.refresh_token);

        // Map and store admin data
        const adminInfo = loginResp.admin;
        setStoredAdmin(adminInfo);

        const mappedAdmin = mapAdminInfo(adminInfo);
        setUser(mappedAdmin);

        return { success: true };
      } catch (err) {
        if (err instanceof ApiError) {
          return { success: false, error: err.message };
        }
        return { success: false, error: "登录失败，请检查网络连接" };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    // Notify backend to invalidate tokens
    try {
      await authApi.adminLogout();
    } catch {
      // Even if backend logout fails, clear local state
    }

    clearTokens();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const freshAdmin = await authApi.adminMe();
      const mappedAdmin = mapAdminInfo(freshAdmin);
      setUser(mappedAdmin);
      setStoredAdmin(freshAdmin);
    } catch {
      // Silent fail - keep existing user data
    }
  }, []);

  const hasPermission = useCallback(
    (perm: string): boolean => {
      if (!user) return false;
      // Use backend-provided permissions (dynamic, not hardcoded)
      return user.permissions.includes(perm);
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (perms: string[]): boolean => {
      if (!user || perms.length === 0) return false;
      return perms.some((p) => user.permissions.includes(p));
    },
    [user]
  );

  return (
    <AdminAuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, login, logout, hasPermission, hasAnyPermission, refreshUser }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

// ===== Admin Guard =====

export function AdminGuard({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { user, loading, hasPermission } = useAdminAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      window.location.href = "/admin/login";
    }
  }, [user, loading]);

  if (loading || redirecting) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-muted-foreground">
            {redirecting ? "正在跳转登录页..." : "加载中..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!hasPermission(permission)) {
    const userRoleLabel = user.roleLabels?.[0] || user.roles?.[0] || "未知角色";
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">权限不足</h3>
          <p className="text-sm text-muted-foreground">
            您当前角色（{userRoleLabel}）无权访问此页面，请联系超级管理员分配相应权限。
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ===== Helpers =====

function mapAdminInfo(info: AdminInfo): AdminUser {
  return {
    id: info.id,
    name: info.name,
    email: info.email,
    roles: info.roles?.map((r) => r.name) || [],
    roleLabels: info.role_labels || info.roles?.map((r) => r.label || r.name) || [],
    permissions: info.permissions || [],
    department: info.department || "",
    avatar: info.avatar,
    lastLogin: info.last_login_at,
  };
}
