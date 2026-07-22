"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAdminAuth, roleLabels } from "@/lib/admin-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const demoAccounts = [
  { role: "super_admin", email: "admin@ihf.com", password: "admin123" },
  { role: "operations_manager", email: "ops@ihf.com", password: "ops123" },
  { role: "content_editor", email: "editor@ihf.com", password: "editor123" },
  { role: "auditor", email: "audit@ihf.com", password: "audit123" },
  { role: "viewer", email: "viewer@ihf.com", password: "viewer123" },
] as const;

export default function AdminLoginPage() {
  const { login, isLoggedIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/admin";
      window.location.href = redirect;
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "登录失败，请重试");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/admin";
    window.location.href = redirect;
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">IHF 运营管理后台</h1>
          <p className="text-sm text-slate-400">国际清真食品产业平台 · 管理员登录</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700">
                邮箱
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入管理员邮箱"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 pl-9"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-700">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pl-9 pr-9"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-white font-medium gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  登录
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3 text-center">
              演示账号 · 点击快速填充
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account.email, account.password)}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-200 group-hover:bg-brand-100 flex items-center justify-center shrink-0 transition-colors">
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-brand-600">
                        {roleLabels[account.role].slice(0, 1)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-700 truncate">
                        {roleLabels[account.role]}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {account.email} / {account.password}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 International Halal Food · 仅供授权管理人员访问
        </p>
      </div>
    </div>
  );
}
