"use client";

import { useState } from "react";
import { Send, User, Building2, Mail, Phone, Tag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inquiryTypes = [
    "供应商入驻咨询",
    "采购商寻源需求",
    "合规认证代办",
    "跨境物流服务",
    "海外渠道拓展",
    "金融配套服务",
    "媒体合作",
    "其他咨询",
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="在线咨询表单"
          subtitle="提交您的需求，我们的专业团队将在 1 个工作日内与您取得联系"
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-brand-600" />
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="请输入您的姓名"
                      required
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-brand-600" />
                      企业名称
                    </label>
                    <Input
                      placeholder="请输入企业名称"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-brand-600" />
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-brand-600" />
                      联系电话
                    </label>
                    <Input
                      type="tel"
                      placeholder="+86 1XX-XXXX-XXXX"
                      className="h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-brand-600" />
                    咨询类型 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inquiryTypes.map((type) => (
                      <label
                        key={type}
                        className="cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type}
                          className="peer sr-only"
                          required
                        />
                        <span className="inline-block px-3 py-1.5 text-sm rounded-lg border border-input bg-background hover:bg-brand-50 hover:border-brand-300 transition-colors peer-checked:bg-brand-500 peer-checked:text-white peer-checked:border-brand-500">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-brand-600" />
                    留言内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="请描述您的需求或问题..."
                    required
                    rows={5}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-muted-foreground">
                    提交即表示您同意我们的隐私政策与服务条款
                  </p>
                  <Button
                    type="submit"
                    className="h-10 px-6 bg-gold-500 hover:bg-gold-600 text-white font-semibold shadow-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    提交咨询
                  </Button>
                </div>

                {submitted && (
                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-center text-brand-700 text-sm">
                    您的咨询已成功提交！我们的团队将在 1 个工作日内与您联系。
                  </div>
                )}
              </form>
            </div>

            {/* Side info */}
            <div className="space-y-6">
              <div className="bg-brand-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">为什么选择 IHFTP？</h3>
                <ul className="space-y-3 text-sm text-brand-100">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                    国家级协会背书，权威公信保障
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                    覆盖东盟、中东、北非、中亚四大市场
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                    合规认证 + 跨境物流 + 渠道拓展一站式服务
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                    线下实体市场 + 线上数字平台双轨联动
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-bold text-brand-900 text-base mb-3">快速响应承诺</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground">在线咨询表单</span>
                    <span className="text-brand-700 font-semibold">1 个工作日</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground">商务微信</span>
                    <span className="text-brand-700 font-semibold">2 小时内</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <span className="text-muted-foreground">咨询热线</span>
                    <span className="text-brand-700 font-semibold">即时响应</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">邮件咨询</span>
                    <span className="text-brand-700 font-semibold">24 小时内</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
