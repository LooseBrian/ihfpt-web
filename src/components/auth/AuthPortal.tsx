"use client";

import { useState, useEffect } from "react";
import {
  Factory,
  ShoppingCart,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  Globe,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Portal = "supplier" | "buyer";
type Mode = "login" | "signup";

export function AuthPortal() {
  const [portal, setPortal] = useState<Portal>("supplier");
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Read query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as Portal | null;
    const modeParam = params.get("mode") as Mode | null;
    if (tab === "supplier" || tab === "buyer") setPortal(tab);
    if (modeParam === "login" || modeParam === "signup") setMode(modeParam);
  }, []);

  const togglePortal = (p: Portal) => {
    setPortal(p);
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
  };

  const portalConfig = {
    supplier: {
      icon: Factory,
      title: "供应商入驻",
      subtitle: "生产工厂 · OEM/ODM 企业 · 贸易商",
      color: "brand",
      loginFields: [
        { label: "企业账号 / 邮箱", icon: Mail, type: "text", placeholder: "输入企业账号或邮箱", required: true },
        { label: "登录密码", icon: Lock, type: showPassword ? "text" : "password", placeholder: "输入登录密码", required: true },
      ],
      signupFields: [
        { group: "企业基本信息" },
        { label: "企业名称", icon: Building2, type: "text", placeholder: "请输入企业全称", required: true },
        { label: "统一社会信用代码", icon: FileText, type: "text", placeholder: "18 位信用代码", required: true },
        { label: "联系人姓名", icon: User, type: "text", placeholder: "请输入联系人姓名", required: true },
        { label: "联系电话", icon: Phone, type: "tel", placeholder: "+86 1XX-XXXX-XXXX", required: true },
        { label: "电子邮箱", icon: Mail, type: "email", placeholder: "your@company.com", required: true },
        { label: "登录密码", icon: Lock, type: showPassword ? "text" : "password", placeholder: "设置登录密码（至少 8 位）", required: true },
        { group: "资质文件上传" },
      ],
      requiredDocs: [
        "营业执照",
        "SC 认证（食品生产许可）",
        "HALAL 证书",
        "出口备案证明",
      ],
      ctaText: mode === "login" ? "供应商登录" : "提交入驻申请",
      benefits: [
        "店铺装修系统与产品管理",
        "询盘 / 订单全流程管理",
        "合规认证代办一站式服务",
        "覆盖东盟、中东、北非、中亚市场",
      ],
    },
    buyer: {
      icon: ShoppingCart,
      title: "采购商注册",
      subtitle: "经销商 · 商超 · 餐饮连锁 · 贸易公司",
      color: "trust",
      loginFields: [
        { label: "邮箱 / 账号", icon: Mail, type: "text", placeholder: "输入邮箱或账号", required: true },
        { label: "登录密码", icon: Lock, type: showPassword ? "text" : "password", placeholder: "输入登录密码", required: true },
      ],
      signupFields: [
        { group: "企业基本信息" },
        { label: "企业名称", icon: Building2, type: "text", placeholder: "请输入企业名称", required: true },
        { label: "联系人姓名", icon: User, type: "text", placeholder: "请输入联系人姓名", required: true },
        { label: "联系电话", icon: Phone, type: "tel", placeholder: "+86 1XX-XXXX-XXXX", required: true },
        { label: "电子邮箱", icon: Mail, type: "email", placeholder: "your@company.com", required: true },
        { label: "国家 / 地区", icon: Globe, type: "text", placeholder: "如：印度尼西亚", required: true },
        { label: "登录密码", icon: Lock, type: showPassword ? "text" : "password", placeholder: "设置登录密码（至少 8 位）", required: true },
      ],
      requiredDocs: [],
      ctaText: mode === "login" ? "采购商登录" : "完成注册",
      benefits: [
        "产品询盘与需求发布管理",
        "收藏夹与采购记录跟踪",
        "多语言多币种原生支持",
        "合规认证产品精准寻源",
      ],
    },
  };

  const config = portalConfig[portal];
  const Icon = config.icon;
  const isSupplier = portal === "supplier";

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Portal Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-white rounded-xl p-2 border shadow-sm">
            <button
              onClick={() => togglePortal("supplier")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                portal === "supplier"
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Factory className="h-5 w-5" />
              供应商入驻
            </button>
            <button
              onClick={() => togglePortal("buyer")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                portal === "buyer"
                  ? "bg-trust-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              采购商注册
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Form Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Header */}
                <div className={`p-6 ${isSupplier ? "bg-brand-50" : "bg-trust-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSupplier ? "bg-brand-100" : "bg-trust-100"}`}>
                      <Icon className={`h-6 w-6 ${isSupplier ? "text-brand-600" : "text-trust-600"}`} />
                    </div>
                    <div>
                      <h2 className={`font-bold text-lg ${isSupplier ? "text-brand-900" : "text-trust-900"}`}>
                        {config.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{config.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      mode === "login"
                        ? isSupplier
                          ? "text-brand-600 border-b-2 border-brand-500"
                          : "text-trust-600 border-b-2 border-trust-500"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    登录
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      mode === "signup"
                        ? isSupplier
                          ? "text-brand-600 border-b-2 border-brand-500"
                          : "text-trust-600 border-b-2 border-trust-500"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isSupplier ? "入驻申请" : "注册"}
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="p-6 space-y-4"
                >
                  {/* Login or Signup fields */}
                  {mode === "login"
                    ? config.loginFields.map((field) => (
                        <div key={field.label}>
                          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                            <field.icon className="h-3.5 w-3.5 text-brand-600" />
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="relative">
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="h-10 pr-10"
                            />
                            {field.label.includes("密码") && (
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    : config.signupFields.map((field, idx) => {
                        // Check if it's a group header
                        if ("group" in field) {
                          return (
                            <div key={`group-${idx}`} className="pt-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                                <span className={`w-1 h-4 rounded-full ${isSupplier ? "bg-brand-500" : "bg-trust-500"}`} />
                                <h3 className="text-sm font-bold text-foreground">{field.group}</h3>
                              </div>
                            </div>
                          );
                        }
                        const fieldTyped = field as {
                          label: string;
                          icon: typeof Mail;
                          type: string;
                          placeholder: string;
                          required: boolean;
                        };
                        const FieldIcon = fieldTyped.icon;
                        return (
                          <div key={fieldTyped.label}>
                            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                              <FieldIcon className="h-3.5 w-3.5 text-brand-600" />
                              {fieldTyped.label}
                              {fieldTyped.required && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                              <Input
                                type={fieldTyped.type}
                                placeholder={fieldTyped.placeholder}
                                required={fieldTyped.required}
                                className="h-10 pr-10"
                              />
                              {fieldTyped.label.includes("密码") && (
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                  {/* Supplier document upload section */}
                  {mode === "signup" && isSupplier && config.requiredDocs.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <Upload className="h-4 w-4 text-brand-600" />
                        <h3 className="text-sm font-bold text-foreground">资质文件上传</h3>
                      </div>
                      {config.requiredDocs.map((doc) => (
                        <div
                          key={doc}
                          className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{doc}</span>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1 text-xs bg-brand-50 text-brand-700 rounded-md hover:bg-brand-100 transition-colors font-medium"
                          >
                            点击上传
                          </button>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground pt-1">
                        支持 JPG / PNG / PDF 格式，单个文件不超过 10MB，提交后需人工审核
                      </p>
                    </div>
                  )}

                  {/* Remember & Forgot (login only) */}
                  {mode === "login" && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded accent-brand-600" />
                        <span className="text-muted-foreground">记住我</span>
                      </label>
                      <a href="#" className={`font-medium ${isSupplier ? "text-brand-600" : "text-trust-600"} hover:underline`}>
                        忘记密码？
                      </a>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    className={`w-full h-11 font-semibold shadow-sm ${
                      isSupplier
                        ? "bg-gold-500 hover:bg-gold-600 text-brand-900"
                        : "bg-trust-500 hover:bg-trust-600 text-white"
                    }`}
                  >
                    {config.ctaText}
                  </Button>

                  {/* Mode toggle link */}
                  <div className="text-center text-sm text-muted-foreground">
                    {mode === "login" ? (
                      <>
                        {isSupplier ? "还没有供应商账号？" : "还没有采购商账号？"}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className={`ml-1 font-medium ${isSupplier ? "text-brand-600" : "text-trust-600"} hover:underline`}
                        >
                          {isSupplier ? "立即入驻" : "立即注册"}
                        </button>
                      </>
                    ) : (
                      <>
                        {isSupplier ? "已有供应商账号？" : "已有采购商账号？"}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className={`ml-1 font-medium ${isSupplier ? "text-brand-600" : "text-trust-600"} hover:underline`}
                        >
                          立即登录
                        </button>
                      </>
                    )}
                  </div>

                  {/* Terms */}
                  {mode === "signup" && (
                    <div className="text-xs text-muted-foreground text-center border-t border-border/40 pt-4">
                      {isSupplier ? "提交入驻申请即表示您同意" : "注册即表示您同意"}
                      <a href="#" className="text-brand-600 hover:underline mx-1">服务条款</a>
                      和
                      <a href="#" className="text-brand-600 hover:underline mx-1">隐私政策</a>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Side Info Panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Benefits card */}
              <div className={`rounded-2xl p-6 text-white ${isSupplier ? "bg-brand-900" : "bg-trust-900"}`}>
                <h3 className="font-bold text-lg mb-4">
                  {isSupplier ? "供应商入驻权益" : "采购商注册权益"}
                </h3>
                <ul className="space-y-3 text-sm">
                  {config.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-brand-100">
                      <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-bold text-brand-900 text-sm mb-4">平台数据</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <div className="text-xl font-bold text-brand-700">50+</div>
                    <div className="text-xs text-muted-foreground">首批供应商</div>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <div className="text-xl font-bold text-brand-700">4</div>
                    <div className="text-xs text-muted-foreground">覆盖市场</div>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <div className="text-xl font-bold text-brand-700">6</div>
                    <div className="text-xs text-muted-foreground">核心品类</div>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <div className="text-xl font-bold text-brand-700">4</div>
                    <div className="text-xs text-muted-foreground">支持语言</div>
                  </div>
                </div>
              </div>

              {/* Switch portal hint */}
              <div className="bg-muted/30 rounded-xl p-4 text-center text-sm">
                <p className="text-muted-foreground">
                  {isSupplier
                    ? "您是采购商？"
                    : "您是供应商？"}
                </p>
                <button
                  onClick={() => togglePortal(isSupplier ? "buyer" : "supplier")}
                  className={`mt-1 font-bold ${isSupplier ? "text-trust-600" : "text-brand-600"} hover:underline`}
                >
                  切换到{isSupplier ? "采购商" : "供应商"}入口 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
