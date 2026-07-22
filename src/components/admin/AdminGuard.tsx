"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ShieldAlert, Lock } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
}

export function AdminGuard({
  children,
  requiredPermission,
  requiredPermissions,
}: AdminGuardProps) {
  const { user, loading, isLoggedIn, hasPermission, hasAnyPermission } = useAdminAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setRedirecting(true);
      const redirect = window.location.pathname;
      window.location.href = `/admin/login?redirect=${encodeURIComponent(redirect)}`;
    }
  }, [loading, isLoggedIn]);

  // Loading or redirecting to login
  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-slate-500">
            {redirecting ? "正在跳转登录页..." : "加载中..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  // Permission check
  const permissionsToCheck = requiredPermissions ?? (requiredPermission ? [requiredPermission] : []);
  const hasAccess =
    permissionsToCheck.length === 0 || hasAnyPermission(permissionsToCheck);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">无权限访问</h2>
            <p className="text-sm text-slate-500 mb-1">
              您当前的账户角色无权访问此页面。
            </p>
            {permissionsToCheck.length > 0 && (
              <p className="text-xs text-slate-400 mb-6">
                所需权限：<code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{permissionsToCheck.join(", ")}</code>
              </p>
            )}
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">请联系超级管理员授权</span>
            </div>
            <Button
              className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white"
              onClick={() => {
                window.location.href = "/admin";
              }}
            >
              返回管理后台首页
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
