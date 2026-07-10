"use client";

import { User, Factory } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function SupplierHero() {
  const { user } = useAuth();
  const companyName = user?.name || "惠发食品有限公司";
  const shortName = companyName.replace(/有限公司$/, "");

  return (
    <section className="relative bg-gradient-to-br from-brand-900 via-brand-700 to-brand-800 text-white py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Welcome */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center shrink-0">
              <Factory className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded">
                  供应商
                </span>
                <span className="px-2 py-0.5 bg-gold-500/20 text-gold-300 text-xs font-medium rounded">
                  {user?.role || "金牌工厂"}
                </span>
                <span className="px-2 py-0.5 bg-white/10 text-brand-100 text-xs font-medium rounded">
                  已认证
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">欢迎回来，{shortName}</h1>
              <p className="text-brand-100 text-sm mt-1">
                {companyName} · 清真牛羊肉制品 / 预制菜
              </p>
            </div>
          </div>

          {/* Right: Quick stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">18</div>
              <div className="text-xs text-brand-200">上架产品</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">36</div>
              <div className="text-xs text-brand-200">收到询盘</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">1,258</div>
              <div className="text-xs text-brand-200">店铺访问</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">3</div>
              <div className="text-xs text-brand-200">未读消息</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
