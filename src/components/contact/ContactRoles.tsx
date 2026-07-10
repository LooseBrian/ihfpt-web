import { ShoppingCart, Factory, Briefcase, Landmark } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const roles = [
  {
    icon: ShoppingCart,
    title: "海外采购商",
    subtitle: "B 端 · 采购方",
    channels: [
      { label: "寻源热线", value: "+86 10-XXXX-XXXX" },
      { label: "采购邮箱", value: "sourcing@ihf.org" },
      { label: "微信客服", value: "IHF-Buyer" },
    ],
    desc: "经销商、商超、餐饮连锁、贸易公司",
  },
  {
    icon: Factory,
    title: "国内供应商",
    subtitle: "B 端 · 供应方",
    channels: [
      { label: "入驻咨询", value: "+86 10-XXXX-XXXX" },
      { label: "入驻邮箱", value: "supplier@ihf.org" },
      { label: "微信客服", value: "IHF-Supplier" },
    ],
    desc: "生产工厂、OEM/ODM 企业、贸易商",
  },
  {
    icon: Briefcase,
    title: "平台运营管理",
    subtitle: "内部 · 管理方",
    channels: [
      { label: "运营邮箱", value: "operations@ihf.org" },
      { label: "技术支持", value: "tech@ihf.org" },
      { label: "内线电话", value: "分机 8001" },
    ],
    desc: "平台运营、内容管理、技术支持",
  },
  {
    icon: Landmark,
    title: "行业访客 / 政府 / 协会",
    subtitle: "外部 · 合作方",
    channels: [
      { label: "合作邮箱", value: "partnership@ihf.org" },
      { label: "媒体联络", value: "media@ihf.org" },
      { label: "商务微信", value: "IHFP-Partner" },
    ],
    desc: "政府机构、行业协会、媒体、合作方",
  },
];

export function ContactRoles() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="分角色联系通道"
          subtitle="不同角色，专属通道，精准对接 — 确保每一位用户都能找到最合适的联系方式"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="bg-white rounded-xl border shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-sm">{role.title}</h3>
                    <span className="text-xs text-muted-foreground">{role.subtitle}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{role.desc}</p>

                <div className="space-y-2 border-t border-border/40 pt-4 flex-1">
                  {role.channels.map((ch) => (
                    <div key={ch.label} className="text-xs">
                      <div className="text-muted-foreground">{ch.label}</div>
                      <div className="text-brand-700 font-medium">{ch.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
