import { Button } from "@/components/ui/button";
import { Handshake, FileText, TrendingUp, Users } from "lucide-react";

const benefits = [
  {
    icon: FileText,
    title: "资讯发布权",
    description: "获得平台官方资讯发布权限，面向全行业展示企业动态与成果",
  },
  {
    icon: TrendingUp,
    title: "行业影响力",
    description: "借助平台流量矩阵扩大品牌曝光，提升行业知名度与话语权",
  },
  {
    icon: Users,
    title: "资源对接优先",
    description: "优先参与平台组织的展会、考察、对接会等线上线下活动",
  },
];

export function NewsCTA() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/media/cta-banner-bg.png')`,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-900/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-brand-50 text-sm mb-6 border border-white/20">
            <Handshake className="h-4 w-4" />
            战略合作计划
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            申请战略合作，获取资讯发布权等专属权益
          </h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            成为 IHFTP 战略合作伙伴，享有平台官方资讯发布权、行业影响力放大、资源优先对接等核心权益，共同推动清真食品出海生态建设
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15 text-left"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-gold-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-brand-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          <Button
            size="lg"
            className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold px-8 gap-2"
          >
            <Handshake className="h-5 w-5" />
            立即申请战略合作
          </Button>
        </div>
      </div>
    </section>
  );
}
