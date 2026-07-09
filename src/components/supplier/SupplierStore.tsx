import { Store, Edit, Eye, CheckCircle2, Image, LayoutGrid, FileText, Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const storeInfo = {
  name: "山东惠发食品 · 官方旗舰店",
  tier: "金牌工厂",
  completion: 85,
  views: "1,258",
  products: 18,
  followers: 42,
};

const storeModules = [
  { icon: LayoutGrid, title: "店铺首页模板", desc: "选择模板风格，自定义 Banner 与产品陈列", status: "已配置" },
  { icon: Image, title: "企业宣传图", desc: "上传工厂实拍、生产车间、荣誉证书等图片", status: "已配置" },
  { icon: FileText, title: "企业介绍", desc: "编辑企业简介、主营品类、出口国家等展示信息", status: "待完善" },
  { icon: Star, title: "成功出口案例", desc: "展示已完成的出口案例与合作客户评价", status: "待完善" },
];

const featuredProducts = [
  { name: "清真冷冻羊腿肉", price: "¥85/kg", image: "https://loremflickr.com/200/120/meat,lamb" },
  { name: "清真预制菜 — 咖喱牛肉", price: "¥45/box", image: "https://loremflickr.com/200/120/curry,beef" },
  { name: "清真复合调味料", price: "¥15/kg", image: "https://loremflickr.com/200/120/spice,seasoning" },
];

export function SupplierStore() {
  return (
    <section id="store" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="店铺管理"
          subtitle="店铺装修系统 — 模板化首页、产品陈列规则、企业介绍自定义、案例上传"
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store preview card */}
            <div className="lg:col-span-2 bg-muted/30 rounded-2xl border overflow-hidden">
              {/* Storefront header */}
              <div className="bg-gradient-to-r from-brand-800 to-brand-600 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{storeInfo.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 bg-gold-500/30 text-gold-300 text-[10px] font-bold rounded">
                          {storeInfo.tier}
                        </span>
                        <span className="text-xs text-brand-100">{storeInfo.products} 个产品</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    预览店铺
                  </button>
                </div>
              </div>

              {/* Featured products */}
              <div className="p-5">
                <div className="text-xs font-semibold text-muted-foreground mb-3">精选产品展示</div>
                <div className="grid grid-cols-3 gap-3">
                  {featuredProducts.map((product) => (
                    <div key={product.name} className="bg-white rounded-lg overflow-hidden border">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2">
                        <div className="text-xs font-medium text-foreground line-clamp-1">{product.name}</div>
                        <div className="text-xs text-brand-700 font-semibold mt-0.5">{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store stats */}
              <div className="flex items-center justify-between px-5 py-3 border-t bg-white">
                <div className="flex gap-6 text-xs">
                  <div>
                    <span className="text-muted-foreground">店铺访问: </span>
                    <span className="font-bold text-brand-900">{storeInfo.views}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">关注粉丝: </span>
                    <span className="font-bold text-brand-900">{storeInfo.followers}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                  <Edit className="h-3 w-3" />
                  编辑店铺
                </button>
              </div>
            </div>

            {/* Completion + modules */}
            <div className="space-y-4">
              {/* Completion progress */}
              <div className="bg-brand-50 rounded-2xl p-5 border border-brand-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-brand-900">店铺完善度</span>
                  <span className="text-2xl font-bold text-brand-600">{storeInfo.completion}%</span>
                </div>
                <div className="w-full h-2 bg-brand-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${storeInfo.completion}%` }}
                  />
                </div>
                <p className="text-xs text-brand-700 mt-2">
                  完善 2 个待配置模块可提升店铺曝光率
                </p>
              </div>

              {/* Modules */}
              <div className="space-y-2">
                {storeModules.map((module) => {
                  const Icon = module.icon;
                  const configured = module.status === "已配置";
                  return (
                    <div key={module.title} className="flex items-start gap-3 bg-muted/30 rounded-xl border p-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        configured ? "bg-brand-50" : "bg-gold-50"
                      }`}>
                        <Icon className={`h-4 w-4 ${configured ? "text-brand-600" : "text-gold-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-foreground">{module.title}</span>
                          {configured && <CheckCircle2 className="h-3 w-3 text-brand-500" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{module.desc}</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                        configured ? "bg-brand-50 text-brand-600" : "bg-gold-50 text-gold-600"
                      }`}>
                        {module.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
