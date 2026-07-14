"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  User,
  Calendar,
  ShieldCheck,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useInquiry } from "@/lib/inquiry-context";
import { InquiryChat } from "./InquiryChat";

interface InquiryDetailModalProps {
  inquiryId: string | null;
  open: boolean;
  onClose: () => void;
  viewerRole: "buyer" | "supplier";
  viewerName: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "待回复",
    color: "text-gold-600 bg-gold-50 border-gold-200",
  },
  replied: {
    icon: CheckCircle2,
    label: "已回复",
    color: "text-brand-600 bg-brand-50 border-brand-200",
  },
  closed: {
    icon: AlertCircle,
    label: "已关闭",
    color: "text-muted-foreground bg-muted border-border",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InquiryDetailModal({
  inquiryId,
  open,
  onClose,
  viewerRole,
  viewerName,
}: InquiryDetailModalProps) {
  const { getInquiry, markMessagesRead, closeInquiry } = useInquiry();

  const inquiry = inquiryId ? getInquiry(inquiryId) : undefined;

  // Mark messages as read when opening
  useEffect(() => {
    if (open && inquiryId && inquiry) {
      // Small delay to ensure the modal renders first
      const timer = setTimeout(() => {
        markMessagesRead(inquiryId, viewerRole);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, inquiryId, inquiry, markMessagesRead, viewerRole]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !inquiry) return null;

  const status = statusConfig[inquiry.status];
  const StatusIcon = status.icon;
  const counterparty =
    viewerRole === "buyer"
      ? { label: "供应商", name: inquiry.supplier }
      : { label: "采购商", name: inquiry.buyer };

  const handleCloseInquiry = () => {
    if (window.confirm("确定要关闭此询盘吗？关闭后将无法继续发送消息。")) {
      closeInquiry(inquiry.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0 md:hidden"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-brand-600">
                  {inquiry.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${status.color}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>
              <h2 className="text-sm text-muted-foreground mt-0.5 truncate">
                {inquiry.subject}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Product info bar */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 border-b shrink-0">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0 border">
            <Image
              src={inquiry.productImage}
              alt={inquiry.productName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
              {inquiry.productName}
            </h3>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
              {inquiry.productSpec && (
                <span className="flex items-center gap-0.5">
                  <Package className="h-3 w-3" />
                  {inquiry.productSpec}
                </span>
              )}
              {inquiry.productPrice && (
                <span className="font-medium text-brand-700">
                  {inquiry.productPrice}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <ShieldCheck className="h-3 w-3" />
                采购量：{inquiry.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Participant info */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{counterparty.label}：</span>
            <span className="font-medium text-foreground">{counterparty.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Calendar className="h-3 w-3" />
              创建于 {formatDate(inquiry.createdAt)}
            </span>
            <span className="hidden sm:flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              更新于 {formatDate(inquiry.updatedAt)}
            </span>
          </div>
        </div>

        {/* Initial inquiry message */}
        <div className="px-4 py-3 bg-brand-50/30 border-b shrink-0">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-medium text-foreground">
                  {inquiry.buyer}
                </span>
                <Badge className="text-[10px] py-0 px-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100">
                  采购商
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  询盘内容
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {inquiry.message}
              </p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <InquiryChat
            key={`${inquiry.id}-${inquiry.messages.length}`}
            inquiry={inquiry}
            viewerRole={viewerRole}
            viewerName={viewerName}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-3 border-t bg-white shrink-0">
          <div className="text-xs text-muted-foreground">
            {inquiry.status !== "closed" ? (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {inquiry.messages.length} 条消息 · 最后活动{" "}
                {formatDate(inquiry.updatedAt)}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                询盘已关闭
              </span>
            )}
          </div>
          {inquiry.status !== "closed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseInquiry}
              className="text-muted-foreground hover:text-red-600 hover:border-red-300"
            >
              关闭询盘
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
