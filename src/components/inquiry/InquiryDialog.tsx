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
  MessageSquare,
  Package,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useInquiry } from "@/lib/inquiry-context";

interface InquiryDialogProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    spec?: string;
    priceRange?: string;
    supplier: string;
    certType?: string;
  };
}

export function InquiryDialog({ open, onClose, product }: InquiryDialogProps) {
  const { user } = useAuth();
  const { createInquiry } = useInquiry();
  const [subject, setSubject] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSubject(`询价：${product.name}`);
      setQuantity("");
      setMessage("");
      setSubmitted(false);
      setInquiryId("");
    }
  }, [open, product.name]);

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

  if (!open) return null;

  const isBuyer = user?.type === "buyer";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBuyer || !user) return;
    if (!message.trim()) return;

    const id = createInquiry({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      productSpec: product.spec,
      productPrice: product.priceRange,
      supplier: product.supplier,
      buyer: user.name,
      buyerEmail: user.email,
      subject: subject || `询价：${product.name}`,
      message: message.trim(),
      quantity: quantity || "未指定",
    });

    setInquiryId(id);
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
              <MessageSquare className="h-4 w-4 text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-foreground">发送询盘</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-5 bg-muted/30 border-b">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                {product.name}
              </h3>
              {product.spec && (
                <p className="text-xs text-muted-foreground mt-1">
                  规格：{product.spec}
                </p>
              )}
              {product.priceRange && (
                <p className="text-sm font-bold text-brand-700 mt-1">
                  {product.priceRange}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground">
                  供应商：{product.supplier}
                </span>
                {product.certType && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-1.5 border-brand-300 text-brand-700"
                  >
                    <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                    {product.certType}
                  </Badge>
                )}
              </div>
            </div>
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
                请先登录采购商账号
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                登录后即可向供应商发送询盘，并进行在线沟通
              </p>
              <Link href="/login?tab=buyer&mode=login">
                <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
                  <LogIn className="h-4 w-4" />
                  立即登录
                </Button>
              </Link>
            </div>
          )}

          {/* Logged in as supplier - cannot send inquiry */}
          {user?.type === "supplier" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold-50 flex items-center justify-center mb-4">
                <User className="h-7 w-7 text-gold-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                当前为供应商账号
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                供应商账号用于接收和管理询盘，如需发送询盘请切换至采购商账号
              </p>
              <Link href="/login?tab=buyer&mode=login">
                <Button variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  切换采购商账号
                </Button>
              </Link>
            </div>
          )}

          {/* Logged in as buyer - show form or success */}
          {isBuyer && !submitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  询盘主题
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                  placeholder="请输入询盘主题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  采购数量
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors"
                  placeholder="例如：500 kg / 1,000 箱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  询盘内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-colors resize-none"
                  placeholder="请描述您的采购需求，包括产品要求、目标价格、交货时间、出口目的地等..."
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-brand-50/50 rounded-lg p-3">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                <span>
                  您的询盘将直接发送至{product.supplier}，供应商将在工作日内尽快回复
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand-600 hover:bg-brand-700 gap-2"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
                发送询盘
              </Button>
            </form>
          )}

          {/* Success state */}
          {isBuyer && submitted && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                询盘已发送！
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                询盘编号：
                <span className="font-mono text-brand-600 font-medium">
                  {inquiryId}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                供应商将尽快回复您的询盘，您可以在询盘管理中查看回复进度并进行在线沟通
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/buyer#inquiries">
                  <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
                    <Package className="h-4 w-4" />
                    查看询盘管理
                  </Button>
                </Link>
                <Button variant="outline" onClick={onClose}>
                  继续浏览
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
