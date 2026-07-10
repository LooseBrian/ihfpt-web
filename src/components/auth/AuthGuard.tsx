"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

type GuardType = "supplier" | "buyer";

export function AuthGuard({
  type,
  children,
  fallback = null,
}: {
  type: GuardType;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, loading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.type !== type) {
        setRedirecting(true);
        const loginUrl = `/login?tab=${type}&mode=login`;
        const redirect = window.location.pathname;
        window.location.href = `${loginUrl}&redirect=${encodeURIComponent(redirect)}`;
      }
    }
  }, [user, loading, type]);

  if (loading || redirecting) {
    return (
      fallback || (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-muted-foreground">
              {redirecting ? "正在跳转登录页..." : "加载中..."}
            </p>
          </div>
        </div>
      )
    );
  }

  if (!user || user.type !== type) {
    return fallback;
  }

  return <>{children}</>;
}
