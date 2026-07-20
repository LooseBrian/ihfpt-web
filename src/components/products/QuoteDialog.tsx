"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  User,
  TrendingUp,
  Clock,
  MapPin,
  Package,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useQuote } from "@/lib/quote-context";
import { hasSensitiveContent } from "@/lib/sensitive-words";

export interface QuoteInquiryData {
  id: string;
  productName: string;
  productImage: string;
  productSpec: string;
  category: string;
  quantity: string;
  unit: string;
  targetMarket: string;
  buyerName: string;
  buyerCountry: string;
  buyerLevel: string;
  status: "active" | "closing-soon" | "quoted" | "closed";
  quotesCount: number;
  budget?: string;
  certRequired?: string;
  description: string;
}

interface QuoteDialogProps {
  open: boolean;
  onClose: () => void;
  inquiry: QuoteInquiryData | null;
}

const unitOptions = ["kg", "箱", "盒", "袋", "瓶", "个"];

export function QuoteDialog({ open, onClose, inquiry }: QuoteDialogProps) {
  const { user } = useAuth();
  const { createQuote, hasSupplierQuoted } = useQuote();

  const [unitPrice, setUnitPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [moq, setMoq] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [validDays, setValidDays] = useState("30");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open && inquiry) {
      setUnitPrice("");
      setUnit("kg");
      setMoq(inquiry.quantity + " " + inquiry.unit);
      setDeliveryDays("");
      setValidDays("30");
      setMessage("");
      setSubmitted(false);
      setQuoteId("");
    }
  }, [open, inquiry]);

  // Lock body scroll when open
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

  const isSupplier = user?.type === "supplier";
  const alreadyQuoted =
    isSupplier && user ? hasSupplierQuoted(inquiry.id, user.email) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupplier || !user) return;
    if (!unitPrice.trim() || !moq.trim() || !message.trim()) return;

    // Sensitive word check
    if (
      hasSensitiveContent(message) ||
      hasSensitiveContent(unitPrice) ||
      hasSensitiveContent(moq)
    ) {
      alert("检测到敏感内容，请修改后重新提交");
      return;
    }

    const id = createQuote({
      inquiryId: inquiry.id,
      inquiryProductName: inquiry.productName,
      inquiryProductImage: inquiry.productImage,
      inquiryBuyerName: inquiry.buyerName,
      supplier: user.name,
      supplierEmail: user.email,
      unitPrice: unitPrice.trim(),
      unit,
      moq: moq.trim(),
      deliveryDays: deliveryDays.trim() || "面议",
      validDays: validDays.trim() || "30",
      message: message.trim(),
    });

    setQuoteId(id);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-foreground">提交报价</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Inquiry Info */}
        <div className="p-5 bg-muted/30 border-b">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border">
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
              <p className="text-xs text-muted-foreground mt-0.5">
                {inquiry.productSpec}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge variant="secondary" className="text-[10px] py-0">
                  <Package className="h-2.5 w-2.5 mr-0.5" />
                  {inquiry.quantity} {inquiry.unit}
                </Badge>
                <Badge variant="secondary" className="text-[10px] py-0">
                  <MapPin className="h-2.5 w-2.5 mr-0.5" />
                  {inquiry.targetMarket}
                </Badge>
                {inquiry.certRequired && (
                  <Badge className="text-[10px] py-0 bg-brand-50 text-brand-700">
                    {inquiry.certRequired}
                  </Badge>
                )}
              </div>
              {inquiry.budget && (
                <p className="text-xs mt-1.5">
                  <span className="text-muted-foreground">采购预算：</span>
                  <span className="font-bold text-brand-600">{inquiry.budget}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-brand-600">
                {inquiry.buyerName.charAt(0)}
              </span>
            </div>
            <span className="text-xs font-medium truncate">{inquiry.buyerName}</span>
            <span className="text-[10px] text-muted-foreground truncate">
              {inquiry.buyerCountry} · {inquiry.buyerLevel}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Not logged in */}
          {!user && (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-brand-50 flex items-center justify-center mb-4">
                <LogIn className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                请先登录供应商账号
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                登录供应商账号后即可向采购商提交报价
              </p>
              <Link href="/login?tab=supplier&mode=login">
                <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
                  <LogIn className="h-4 w-4" />
                  立即登录
                </Button>
              </Link>
            </div>
          )}

          {/* Logged in as buyer - cannot quote */}
          {user?.type === "buyer" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold-50 flex items-center justify-center mb-4">
                <User className="h-7 w-7 text-gold-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                当前为采购商账号
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                报价功能面向供应商，如需提交报价请切换至供应商账号
              </p>
              <Link href="/login?tab=supplier&mode=login">
                <Button variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  切换供应商账号
                </Button>
              </Link>
            </div>
          )}

          {/* Already quoted */}
          {isSupplier && alreadyQuoted && !submitted && (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                您已对此询盘报价
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                请等待采购商查看您的报价，您可在供应商工作台查看报价状态
              </p>
              <Link href="/supplier#quotes">
                <Button variant="outline" className="gap-2">
                  查看我的报价
                </Button>
              </Link>
            </div>
          )}

          {/* Supplier form */}
          {isSupplier && !alreadyQuoted && !submitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    报价单价 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                      placeholder="如 85 或 $2.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    计价单位
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                  >
                    {unitOptions.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    最低起订量 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                    placeholder="如 100 箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    交货期（天）
                  </label>
                  <input
                    type="text"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                    placeholder="如 7-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  报价有效期（天）
                </label>
                <input
                  type="text"
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                  placeholder="如 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  报价说明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors resize-none"
                  placeholder="请描述您的产品优势、认证情况、冷链方案、出口经验等..."
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-brand-50/50 rounded-lg p-3">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                <span>
                  您的报价将直接发送至{inquiry.buyerName}，采购商可在询盘管理中查看并联系您
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand-600 hover:bg-brand-700 gap-2"
                disabled={!unitPrice.trim() || !moq.trim() || !message.trim()}
              >
                <Send className="h-4 w-4" />
                提交报价
              </Button>
            </form>
          )}

          {/* Success state */}
          {isSupplier && submitted && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                报价已提交！
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                报价编号：
                <span className="font-mono text-brand-600 font-medium">
                  {quoteId}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                采购商将尽快查看您的报价，如有意向会主动与您联系，您可在供应商工作台查看报价记录
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/supplier#quotes">
                <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
                  <Package className="h-4 w-4" />
                  查看我的报价
                </Button>
              </Link>
                <Button variant="outline" onClick={onClose}>
                  继续浏览询盘
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
