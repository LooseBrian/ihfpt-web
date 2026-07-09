import { Phone, Mail, MapPin, Clock, MessageCircle, Globe } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const channels = [
  {
    icon: Phone,
    title: "咨询热线",
    primary: "+86 10-XXXX-XXXX",
    secondary: "工作日 09:00 - 18:00",
    desc: "平台运营、供应商入驻、采购商咨询",
  },
  {
    icon: Mail,
    title: "电子邮箱",
    primary: "contact@ihftp.org",
    secondary: "7×24 小时接收",
    desc: "商务合作、媒体联络、一般咨询",
  },
  {
    icon: MessageCircle,
    title: "商务微信",
    primary: "IHFTP-Service",
    secondary: "扫码添加客服微信",
    desc: "快速沟通、在线答疑、预约对接",
  },
  {
    icon: Globe,
    title: "多语言服务",
    primary: "中文 / English / Bahasa Indonesia",
    secondary: "二期上线：العربية (RTL)",
    desc: "原生多语言适配，覆盖全球穆斯林市场",
  },
];

export function ContactChannels() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="联系方式"
          subtitle="多渠道沟通矩阵，确保每一位用户都能获得及时响应"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {channels.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-muted/30 rounded-xl border border-border/40 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-brand-600" />
                </div>
                <h3 className="font-bold text-brand-900 text-base mb-2">{item.title}</h3>
                <p className="text-brand-700 font-semibold text-sm mb-1">{item.primary}</p>
                <p className="text-muted-foreground text-xs mb-3">{item.secondary}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Office hours banner */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-brand-50 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-brand-700">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">办公时间</span>
            </div>
            <div className="text-muted-foreground">
              周一至周五 09:00 - 18:00（北京时间）| 周末及法定节假日休息
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
