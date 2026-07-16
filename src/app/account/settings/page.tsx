"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
} from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  User as UserIcon,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type TabId = "profile" | "email" | "phone" | "password";

const tabs: { id: TabId; label: string; icon: typeof Mail }[] = [
  { id: "profile", label: "基本信息", icon: UserIcon },
  { id: "email", label: "邮箱验证", icon: Mail },
  { id: "phone", label: "手机验证", icon: Phone },
  { id: "password", label: "修改密码", icon: Lock },
];

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const isSupplier = user.type === "supplier";
  const themeColor = isSupplier ? "brand" : "trust";
  const accent = isSupplier ? "text-brand-600" : "text-trust-600";
  const accentBg = isSupplier ? "bg-brand-50" : "bg-trust-50";
  const accentBorder = isSupplier ? "border-brand-200" : "border-trust-200";
  const accentBtn = isSupplier
    ? "bg-brand-600 hover:bg-brand-700"
    : "bg-trust-600 hover:bg-trust-700";

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button
              onClick={() => router.push(isSupplier ? "/supplier" : "/buyer")}
              className="hover:text-brand-600"
            >
              {isSupplier ? "供应商工作台" : "采购商工作台"}
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-600 font-medium">账号设置</span>
          </div>

          {/* Page header */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold flex items-center gap-2 ${isSupplier ? "text-brand-900" : "text-trust-900"}`}>
              <ShieldCheck className={`h-6 w-6 ${accent}`} />
              账号设置
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理您的账户信息、安全验证方式与登录密码
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* ===== Sidebar Tabs ===== */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border shadow-sm p-2 sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? `${accentBg} ${accent} ${accentBorder} border`
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                      {tab.id === "email" && user.emailVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-auto" />
                      )}
                      {tab.id === "phone" && user.phoneVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===== Content Area ===== */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <ProfileTab user={user} updateUser={updateUser} accent={accent} accentBtn={accentBtn} />
              )}
              {activeTab === "email" && (
                <EmailVerifyTab
                  email={user.email}
                  verified={user.emailVerified ?? false}
                  updateUser={updateUser}
                  accent={accent}
                  accentBtn={accentBtn}
                />
              )}
              {activeTab === "phone" && (
                <PhoneVerifyTab
                  phone={user.phone ?? ""}
                  verified={user.phoneVerified ?? false}
                  updateUser={updateUser}
                  accent={accent}
                  accentBtn={accentBtn}
                />
              )}
              {activeTab === "password" && (
                <PasswordTab
                  currentPassword={user.password ?? ""}
                  updateUser={updateUser}
                  accent={accent}
                  accentBtn={accentBtn}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

// ===== Profile Tab =====

function ProfileTab({
  user,
  updateUser,
  accent,
  accentBtn,
}: {
  user: { name: string; email: string; type: string | null; role?: string; phone?: string; emailVerified?: boolean };
  updateUser: (updates: Record<string, unknown>) => void;
  accent: string;
  accentBtn: string;
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateUser({ name, phone });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${accent}`}>
          <Building2 className="h-5 w-5" />
          基本信息
        </CardTitle>
        <CardDescription>管理您的账户名称与联系方式</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {user.type === "supplier" ? "企业名称" : "账户名称"}
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">角色身份</Label>
            <div className="h-10 flex items-center gap-2 px-3 bg-muted/50 rounded-lg">
              <Badge variant="secondary" className={user.type === "supplier" ? "bg-brand-50 text-brand-700" : "bg-trust-50 text-trust-700"}>
                {user.type === "supplier" ? "供应商" : "采购商"}
              </Badge>
              {user.role && (
                <Badge className="bg-gold-50 text-gold-700">{user.role}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">电子邮箱</Label>
          <div className="flex items-center gap-2">
            <Input value={user.email} disabled className="h-10 flex-1 bg-muted/30" />
            <Badge className={user.emailVerified ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}>
              {user.emailVerified ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" /> 已验证
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" /> 未验证
                </>
              )}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">邮箱用于接收平台通知和找回密码，请前往「邮箱验证」完成验证</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">联系电话</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号码"
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">手机号用于接收验证码和安全通知，请前往「手机验证」完成验证</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className={`${accentBtn} text-white gap-2`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {saving ? "保存中..." : saved ? "已保存" : "保存修改"}
          </Button>
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              信息已更新
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Email Verification Tab =====

function EmailVerifyTab({
  email,
  verified,
  updateUser,
  accent,
  accentBtn,
}: {
  email: string;
  verified: boolean;
  updateUser: (updates: Record<string, unknown>) => void;
  accent: string;
  accentBtn: string;
}) {
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Demo verification code (in production this would be sent via email)
  const demoCode = "666888";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendCode = () => {
    setSending(true);
    setError("");
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleVerify = () => {
    setVerifying(true);
    setError("");
    setTimeout(() => {
      setVerifying(false);
      if (code.trim() === demoCode) {
        updateUser({ emailVerified: true });
        setSuccess(true);
      } else {
        setError("验证码不正确，请重新输入（演示验证码：666888）");
      }
    }, 800);
  };

  if (verified || success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            邮箱已验证
          </CardTitle>
          <CardDescription>您的邮箱已完成验证</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Mail className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-medium text-green-900">{email}</div>
              <div className="text-xs text-green-600 mt-0.5">已通过验证</div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500 ml-auto" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>邮箱验证完成后，您可以：</p>
            <div className="flex items-center gap-2 ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>接收平台审核通知、询盘提醒等邮件</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>使用邮箱找回登录密码</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>提升账户安全等级，获得更多平台信任</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${accent}`}>
          <Mail className="h-5 w-5" />
          邮箱验证
        </CardTitle>
        <CardDescription>验证您的电子邮箱以提升账户安全性</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current email display */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium">{email}</div>
            <div className="text-xs text-muted-foreground">验证邮箱地址</div>
          </div>
          <Badge className="bg-orange-50 text-orange-700">
            <AlertTriangle className="h-3 w-3 mr-1" /> 未验证
          </Badge>
        </div>

        {/* Send code section */}
        {!sent ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              点击下方按钮，我们将向您的邮箱发送一封包含验证码的邮件。
            </p>
            <Button onClick={handleSendCode} disabled={sending} className={`${accentBtn} text-white gap-2`}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? "发送中..." : "发送验证码"}
            </Button>
          </div>
        ) : (
          <>
            {/* Code input section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">输入验证码</Label>
              <div className="flex gap-3">
                <Input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  placeholder="请输入 6 位邮箱验证码"
                  className="h-10 flex-1 text-lg tracking-widest text-center"
                  maxLength={6}
                />
                <Button
                  onClick={handleSendCode}
                  disabled={countdown > 0 || sending}
                  variant="outline"
                  className="h-10 shrink-0"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : "重新发送"}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Send className="h-3.5 w-3.5" />
                <span>验证码已发送至 {email}</span>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  <XCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}
              <Button
                onClick={handleVerify}
                disabled={verifying || code.length !== 6}
                className={`${accentBtn} text-white gap-2 w-full`}
              >
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {verifying ? "验证中..." : "确认验证"}
              </Button>
              <div className="text-xs text-center text-muted-foreground bg-muted/30 rounded-lg p-2">
                演示环境验证码为：<span className="font-bold text-brand-600">{demoCode}</span>
              </div>
            </div>
          </>
        )}

        {/* Help text */}
        <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">为什么需要邮箱验证？</p>
          <p>邮箱验证可以保护您的账户安全，确保您可以及时收到平台重要通知（产品审核结果、询盘提醒等），并在忘记密码时通过邮箱快速找回。</p>
          <p>如果没有收到邮件，请检查垃圾邮件文件夹，或等待 1-2 分钟后重新发送。</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Phone Verification Tab =====

function PhoneVerifyTab({
  phone,
  verified,
  updateUser,
  accent,
  accentBtn,
}: {
  phone: string;
  verified: boolean;
  updateUser: (updates: Record<string, unknown>) => void;
  accent: string;
  accentBtn: string;
}) {
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Demo SMS code
  const demoCode = "888666";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Chinese phone number validation: starts with 1, 11 digits total
  const phoneValid = /^1[3-9]\d{9}$/.test(phoneNumber.replace(/\s/g, ""));

  const handleSendCode = () => {
    if (!phoneValid) {
      setError("请输入有效的中国大陆手机号码（11 位，以 1 开头）");
      return;
    }
    setSending(true);
    setError("");
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleVerify = () => {
    setVerifying(true);
    setError("");
    setTimeout(() => {
      setVerifying(false);
      if (code.trim() === demoCode) {
        updateUser({ phone: phoneNumber, phoneVerified: true });
        setSuccess(true);
      } else {
        setError("验证码不正确，请重新输入（演示验证码：888666）");
      }
    }, 800);
  };

  if (verified || success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            手机已验证
          </CardTitle>
          <CardDescription>您的手机号已完成验证</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Phone className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-medium text-green-900">+86 {phone}</div>
              <div className="text-xs text-green-600 mt-0.5">已通过验证</div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500 ml-auto" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>手机验证完成后，您可以：</p>
            <div className="flex items-center gap-2 ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>接收短信验证码进行身份验证</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>接收平台审核通知和紧急安全提醒</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>提升账户安全等级</span>
            </div>
          </div>
          {!success && (
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setSent(false);
                setCode("");
              }}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              更换手机号
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${accent}`}>
          <Phone className="h-5 w-5" />
          手机验证
        </CardTitle>
        <CardDescription>验证您的手机号码（目前支持中国大陆 +86 号码）</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Phone number input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">手机号码</Label>
          <div className="flex gap-3">
            <div className="h-10 flex items-center px-3 bg-muted/50 rounded-lg border text-sm font-medium text-muted-foreground">
              +86
            </div>
            <Input
              value={phoneNumber}
              onChange={(e) => {
                // Only allow digits, max 11
                const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                setPhoneNumber(val);
                setError("");
              }}
              placeholder="请输入 11 位手机号码"
              className="h-10 flex-1"
              maxLength={11}
              inputMode="numeric"
            />
          </div>
          {phoneNumber && !phoneValid && phoneNumber.length >= 11 && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              请输入有效的中国大陆手机号码
            </p>
          )}
          {phoneValid && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              手机号格式正确
            </p>
          )}
        </div>

        {/* Send code button */}
        {!sent ? (
          <Button
            onClick={handleSendCode}
            disabled={!phoneValid || sending}
            className={`${accentBtn} text-white gap-2 w-full`}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "发送中..." : "发送短信验证码"}
          </Button>
        ) : (
          <>
            {/* Code input section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">短信验证码</Label>
              <div className="flex gap-3">
                <Input
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(val);
                    setError("");
                  }}
                  placeholder="请输入 6 位短信验证码"
                  className="h-10 flex-1 text-lg tracking-widest text-center"
                  maxLength={6}
                  inputMode="numeric"
                />
                <Button
                  onClick={handleSendCode}
                  disabled={countdown > 0 || sending}
                  variant="outline"
                  className="h-10 shrink-0"
                >
                  {countdown > 0 ? `${countdown}s` : "重发"}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Send className="h-3.5 w-3.5" />
                <span>验证码已发送至 +86 {phoneNumber}</span>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  <XCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}
              <Button
                onClick={handleVerify}
                disabled={verifying || code.length !== 6}
                className={`${accentBtn} text-white gap-2 w-full`}
              >
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {verifying ? "验证中..." : "确认验证"}
              </Button>
              <div className="text-xs text-center text-muted-foreground bg-muted/30 rounded-lg p-2">
                演示环境验证码为：<span className="font-bold text-brand-600">{demoCode}</span>
              </div>
            </div>
          </>
        )}

        {/* Help text */}
        <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">手机验证说明</p>
          <p>当前阶段支持中国大陆手机号（+86），以 1 开头的 11 位号码。国际号码验证功能将在后续版本中开放。</p>
          <p>验证码有效期为 5 分钟，如未收到短信请等待 30 秒后重新发送。</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Password Change Tab =====

function PasswordTab({
  currentPassword,
  updateUser,
  accent,
  accentBtn,
}: {
  currentPassword: string;
  updateUser: (updates: Record<string, unknown>) => void;
  accent: string;
  accentBtn: string;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password strength check
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const strengthScore = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthInfo = {
    0: { label: "", color: "", bar: "" },
    1: { label: "弱", color: "text-red-600", bar: "bg-red-500 w-1/5" },
    2: { label: "较弱", color: "text-orange-600", bar: "bg-orange-500 w-2/5" },
    3: { label: "中等", color: "text-yellow-600", bar: "bg-yellow-500 w-3/5" },
    4: { label: "较强", color: "text-blue-600", bar: "bg-blue-500 w-4/5" },
    5: { label: "强", color: "text-green-600", bar: "bg-green-500 w-full" },
  };
  const strength = strengthInfo[strengthScore as keyof typeof strengthInfo];

  const handleChangePassword = () => {
    setError("");

    // Check old password (demo: any password works if currentPassword is empty, otherwise must match)
    if (currentPassword && oldPassword !== currentPassword) {
      setError("原密码不正确");
      return;
    }

    if (!hasLength) {
      setError("新密码长度至少 8 位");
      return;
    }

    if (strengthScore < 3) {
      setError("密码强度不足，请包含大写字母、小写字母、数字和特殊字符中的至少 3 种");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("两次输入的新密码不一致");
      return;
    }

    if (newPassword === oldPassword) {
      setError("新密码不能与原密码相同");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      updateUser({ password: newPassword });
      setSaving(false);
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 5000);
    }, 800);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${accent}`}>
          <Lock className="h-5 w-5" />
          修改密码
        </CardTitle>
        <CardDescription>定期修改密码以保障账户安全</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {success && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-900">密码修改成功</div>
              <div className="text-xs text-green-600">请使用新密码登录</div>
            </div>
          </div>
        )}

        {/* Old password */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            原密码 {!currentPassword && <span className="text-xs text-muted-foreground">（首次设置，可留空）</span>}
          </Label>
          <div className="relative">
            <Input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setError("");
              }}
              placeholder={currentPassword ? "请输入当前密码" : "首次设置密码，可留空"}
              className="h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">新密码</Label>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              placeholder="至少 8 位，包含大小写字母、数字、特殊字符"
              className="h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password strength bar */}
          {newPassword.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.bar}`} />
                </div>
                {strength.label && (
                  <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-1 text-xs">
                <div className={hasLength ? "text-green-600" : "text-muted-foreground"}>
                  {hasLength ? "✓" : "○"} 8+ 位
                </div>
                <div className={hasUpper ? "text-green-600" : "text-muted-foreground"}>
                  {hasUpper ? "✓" : "○"} 大写
                </div>
                <div className={hasLower ? "text-green-600" : "text-muted-foreground"}>
                  {hasLower ? "✓" : "○"} 小写
                </div>
                <div className={hasNumber ? "text-green-600" : "text-muted-foreground"}>
                  {hasNumber ? "✓" : "○"} 数字
                </div>
                <div className={hasSpecial ? "text-green-600" : "text-muted-foreground"}>
                  {hasSpecial ? "✓" : "○"} 特殊字符
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">确认新密码</Label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="请再次输入新密码"
              className="h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && newPassword === confirmPassword && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              两次密码一致
            </p>
          )}
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              两次密码不一致
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit button */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleChangePassword}
            disabled={saving || (!newPassword && !confirmPassword)}
            className={`${accentBtn} text-white gap-2`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {saving ? "保存中..." : "确认修改"}
          </Button>
        </div>

        {/* Security tips */}
        <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">密码安全建议</p>
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>密码长度至少 8 位，建议包含大写字母、小写字母、数字和特殊字符</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>不要使用与个人信息相关的简单密码（如手机号、生日、企业名等）</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>建议每 3 个月定期更换密码，不同平台使用不同密码</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
