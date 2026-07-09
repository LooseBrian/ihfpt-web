import { MapPin, Phone, Mail, Navigation, Building, Store } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const offices = [
  {
    icon: Building,
    tag: "总部",
    name: "北京运营中心",
    address: "北京市朝阳区××路××号",
    phone: "+86 10-XXXX-XXXX",
    email: "contact@ihftp.org",
    desc: "平台运营总部，负责整体运营管理、资源对接与商务合作。中国食品药品企业质量安全促进会主办，中国-东盟特色产业链出海平台专业委员会运营。",
    hours: "周一至周五 09:00 - 18:00",
  },
  {
    icon: Store,
    tag: "线下市场",
    name: "济南清真食品贸易市场",
    address: "山东省济南市（即将开业）",
    phone: "+86 531-XXXX-XXXX",
    email: "jinan@ihftp.org",
    desc: "线下实体贸易市场，与线上平台数据互通，提供产品展示、现场交易、进销存系统对接等实体服务，是线上线下融合发展的核心枢纽。",
    hours: "即将开业，敬请期待",
  },
];

export function ContactOffices() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="办公地点"
          subtitle="线上数字平台 + 线下实体市场双轨联动，构建清真食品贸易全场景服务网络"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {offices.map((office) => {
            const Icon = office.icon;
            return (
              <div
                key={office.name}
                className="bg-muted/30 rounded-2xl border border-border/40 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Map placeholder */}
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 text-brand-700 text-xs font-semibold rounded-full">
                    {office.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-brand-900 text-lg mb-3">{office.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{office.desc}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                      <span className="text-foreground">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand-500 shrink-0" />
                      <span className="text-foreground">{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-brand-500 shrink-0" />
                      <span className="text-foreground">{office.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-brand-500 shrink-0" />
                      <span className="text-muted-foreground">{office.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
