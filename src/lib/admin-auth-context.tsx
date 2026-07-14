"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// ===== Admin Role System =====

export type AdminRole = "super_admin" | "operations_manager" | "content_editor" | "auditor" | "viewer";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  avatar?: string;
  lastLogin?: string;
}

// ===== Permission Matrix =====

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

const rolePermissions: Record<AdminRole, Permission[]> = {
  super_admin: [
    "dashboard.view", "products.review", "products.approve", "products.reject",
    "suppliers.view", "suppliers.verify", "suppliers.suspend",
    "buyers.view", "buyers.suspend",
    "inquiries.view", "inquiries.close",
    "content.news", "content.banner", "content.publish",
    "settings.users", "settings.roles", "settings.system", "settings.logs",
  ],
  operations_manager: [
    "dashboard.view", "products.review", "products.approve", "products.reject",
    "suppliers.view", "suppliers.verify", "suppliers.suspend",
    "buyers.view", "buyers.suspend",
    "inquiries.view", "inquiries.close",
    "content.news", "content.banner", "content.publish",
  ],
  content_editor: [
    "dashboard.view", "content.news", "content.banner", "content.publish",
    "products.review",
  ],
  auditor: [
    "dashboard.view", "products.review", "products.approve", "products.reject",
    "suppliers.view", "suppliers.verify",
    "inquiries.view",
  ],
  viewer: [
    "dashboard.view", "suppliers.view", "buyers.view", "inquiries.view",
  ],
};

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "超级管理员",
  operations_manager: "运营主管",
  content_editor: "内容编辑",
  auditor: "审核员",
  viewer: "只读查看员",
};

export const roleColors: Record<AdminRole, string> = {
  super_admin: "bg-red-100 text-red-700",
  operations_manager: "bg-brand-100 text-brand-700",
  content_editor: "bg-trust-100 text-trust-700",
  auditor: "bg-gold-100 text-gold-700",
  viewer: "bg-muted text-muted-foreground",
};

// ===== Demo Admin Accounts =====

const demoAdmins: (AdminUser & { password: string })[] = [
  {
    id: "ADM-001",
    name: "系统管理员",
    email: "admin@ihf.org",
    password: "admin123",
    role: "super_admin",
    department: "技术部",
  },
  {
    id: "ADM-002",
    name: "运营张经理",
    email: "ops@ihf.org",
    password: "ops123",
    role: "operations_manager",
    department: "运营部",
  },
  {
    id: "ADM-003",
    name: "编辑小李",
    email: "editor@ihf.org",
    password: "editor123",
    role: "content_editor",
    department: "内容部",
  },
  {
    id: "ADM-004",
    name: "审核员王工",
    email: "audit@ihf.org",
    password: "audit123",
    role: "auditor",
    department: "审核部",
  },
  {
    id: "ADM-005",
    name: "观察员赵老师",
    email: "viewer@ihf.org",
    password: "viewer123",
    role: "viewer",
    department: "监督部",
  },
];

// ===== Context =====

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  hasPermission: (perm: Permission) => boolean;
  hasAnyPermission: (perms: Permission[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = "ihf_admin_user";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = demoAdmins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) {
      return { success: false, error: "邮箱或密码错误" };
    }
    const { password: _, ...userWithoutPassword } = found;
    const loggedIn: AdminUser = {
      ...userWithoutPassword,
      lastLogin: new Date().toISOString(),
    };
    setUser(loggedIn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasPermission = (perm: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(perm) ?? false;
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    return perms.some((p) => hasPermission(p));
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, login, logout, hasPermission, hasAnyPermission }}
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
  permission: Permission;
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
            您当前角色（{roleLabels[user.role]}）无权访问此页面，请联系超级管理员分配相应权限。
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
