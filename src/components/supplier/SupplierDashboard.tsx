import { Plus, Store, MessageSquare, ShieldCheck, TrendingUp, Package, FileText } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const quickActions = [
  {
    icon: Plus,
    title: "发布新产品",
    desc: "上传产品信息、图片与资质，上架审核",
    href: "#products",
    color: "brand",
  },
  {
    icon: FileText,
    title: "我的报价",
    desc: "查看向采购商提交的报价记录与状态",
    href: "#quotes",
    color: "brand",
  },
  {
    icon: Store,
    title: "店铺装修",
    desc: "自定义店铺首页、产品陈列、企业介绍",
    href: "#store",
    color: "gold",
  },
  {
    icon: MessageSquare,
    title: "回复询盘",
    desc: "查看并回复采购商询价，跟踪转化",
    href: "#inquiries",
    color: "brand",
  },
  {
    icon: ShieldCheck,
    title: "资质管理",
    desc: "上传与更新 HALAL、SC 等资质证书",
    href: "#qualifications",
    color: "gold",
  },
];

const onboardingSteps = [
  { step: "01", title: "资质认证", desc: "上传营业执照、SC 认证、HALAL 证书等资质文件，平台人工审核" },
  { step: "02", title: "产品上架", desc: "配置产品 SKU、属性参数、图片与价格库存，提交上架审核" },
  { step: "03", title: "店铺装修", desc: "模板化店铺首页，自定义产品陈列规则与企业介绍" },
  { step: "04", title: "获客转化", desc: "响应询盘、管理订单，对接跨境贸易服务实现交易闭环" },
];

export function SupplierDashboard() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="供应商工作台"
          subtitle="一站式管理产品、店铺、询盘、资质与订单 — 全链路获客转化"
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.title}
                href={action.href}
                className="group bg-muted/30 rounded-xl border border-border/40 p-5 hover:shadow-md hover:border-brand-300 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${
                  action.color === "brand" ? "bg-brand-50" : "bg-gold-50"
                }`}>
                  <Icon className={`h-6 w-6 ${action.color === "brand" ? "text-brand-600" : "text-gold-600"}`} />
                </div>
                <h3 className="font-bold text-brand-900 text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
              </a>
            );
          })}
        </div>

        {/* Onboarding Flow */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/40">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold text-brand-900">供应商入驻与获客流程</h3>
              <span className="text-sm text-muted-foreground">— 资质认证 → 产品上架 → 店铺装修 → 获客转化</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {onboardingSteps.map((item, idx) => (
                <div key={item.step} className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-brand-300">{item.step}</span>
                    <Package className="h-4 w-4 text-brand-500" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  {idx < onboardingSteps.length - 1 && (
                    <div className="hidden md:block absolute top-3 -right-2 text-brand-300">&rarr;</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
