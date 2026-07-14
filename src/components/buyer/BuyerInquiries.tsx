"use client";

import { useState } from "react";
import { MessageSquare, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useAuth } from "@/lib/auth-context";
import { useInquiry } from "@/lib/inquiry-context";
import { InquiryDetailModal } from "@/components/inquiry/InquiryDetailModal";

const statusConfig = {
  replied: { icon: CheckCircle2, color: "text-trust-600 bg-trust-50" },
  pending: { icon: Clock, color: "text-gold-600 bg-gold-50" },
  closed: { icon: AlertCircle, color: "text-muted-foreground bg-muted" },
};

const statusTextMap: Record<string, string> = {
  pending: "待回复",
  replied: "已回复",
  closed: "已关闭",
};

function formatDate(iso: string): string {
  return new Date(iso).toISOString().split("T")[0];
}

function getInquiryType(subject: string, message: string): string {
  const text = subject + message;
  if (text.includes("批量")) return "批量询价";
  if (text.includes("定向") || text.includes("需求发布")) return "需求定向发布";
  return "单品询价";
}

export function BuyerInquiries() {
  const { user } = useAuth();
  const { getBuyerInquiries, loading } = useInquiry();
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const inquiries = getBuyerInquiries(user?.name || "测试采购商");

  return (
    <section id="inquiries" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="询盘记录"
          subtitle="单品询价 · 批量询价 · 需求定向发布 — 全流程跟踪与管理"
          theme="trust"
        />

        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="text-center py-16 text-muted-foreground">加载中...</div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="text-center py-16 text-muted-foreground">
                暂无询盘记录，去产品大厅发送询盘吧！
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-2">询盘编号</div>
                <div className="col-span-3">产品</div>
                <div className="col-span-2">供应商</div>
                <div className="col-span-1">类型</div>
                <div className="col-span-1">数量</div>
                <div className="col-span-2">状态</div>
                <div className="col-span-1">日期</div>
              </div>

              {/* Table rows */}
              {inquiries.map((inquiry) => {
                const status = statusConfig[inquiry.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedInquiryId(inquiry.id)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-border/40 hover:bg-[#F2FAF8] transition-colors cursor-pointer"
                  >
                    <div className="md:col-span-2">
                      <span className="text-xs font-mono text-trust-600 font-medium">{inquiry.id}</span>
                    </div>
                    <div className="md:col-span-3">
                      <span className="text-sm text-foreground font-medium">{inquiry.productName}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-muted-foreground">{inquiry.supplier}</span>
                    </div>
                    <div className="md:col-span-1">
                      <span className="text-xs px-2 py-0.5 bg-trust-50 text-trust-700 rounded font-medium">
                        {getInquiryType(inquiry.subject, inquiry.message)}
                      </span>
                    </div>
                    <div className="md:col-span-1">
                      <span className="text-sm text-muted-foreground">{inquiry.quantity}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusTextMap[inquiry.status]}
                      </span>
                    </div>
                    <div className="md:col-span-1 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(inquiry.createdAt)}</span>
                      <button className="text-trust-500 hover:text-trust-700 md:hidden">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Inquiry types explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-trust-600" />
                <span className="text-sm font-bold text-trust-900">单品询价</span>
              </div>
              <p className="text-xs text-muted-foreground">针对单个产品发起询价，获取供应商报价与规格信息</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-trust-600" />
                <span className="text-sm font-bold text-trust-900">批量询价</span>
              </div>
              <p className="text-xs text-muted-foreground">同时向多个产品发起批量询价，提升采购效率</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-bold text-trust-900">需求定向发布</span>
              </div>
              <p className="text-xs text-muted-foreground">发布采购需求，系统基于品类、地区、资质智能匹配供应商（二期）</p>
            </div>
          </div>
        </div>
      </div>

      <InquiryDetailModal
        inquiryId={selectedInquiryId}
        open={!!selectedInquiryId}
        onClose={() => setSelectedInquiryId(null)}
        viewerRole="buyer"
        viewerName={user?.name || "测试采购商"}
      />
    </section>
  );
}
