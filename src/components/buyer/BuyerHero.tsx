import { Bell, User, ChevronRight } from "lucide-react";

export function BuyerHero() {
  return (
    <section className="relative bg-gradient-to-br from-trust-900 via-trust-700 to-brand-800 text-white py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Welcome */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-trust-500 text-white text-xs font-bold rounded">
                  采购商
                </span>
                <span className="px-2 py-0.5 bg-white/10 text-trust-100 text-xs font-medium rounded">
                  已认证
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">欢迎回来，采购商用户</h1>
              <p className="text-trust-100 text-sm mt-1">
                印度尼西亚 · 雅加达贸易公司 · Premium Buyer
              </p>
            </div>
          </div>

          {/* Right: Quick stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">12</div>
              <div className="text-xs text-trust-200">询盘记录</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">28</div>
              <div className="text-xs text-trust-200">收藏产品</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">3</div>
              <div className="text-xs text-trust-200">需求发布</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">5</div>
              <div className="text-xs text-trust-200">未读消息</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
