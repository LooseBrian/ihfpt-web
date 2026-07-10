import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-brand-900 text-brand-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <div className="bg-white rounded-lg px-2 py-1.5 shadow-md w-fit">
              <div className="flex items-center gap-1.5">
                <img
                  src="/logo-icon.svg"
                  alt="IHF"
                  className="h-20 w-auto"
                />
                <span className="h-14 w-0.5 bg-gold-400/70 shrink-0" />
                <img
                  src="/logo-text.svg"
                  alt="IHF 国际清真食品产业平台"
                  className="h-20 w-auto"
                />
              </div>
            </div>
            <p className="text-sm text-brand-200 leading-relaxed">
              国家级、全球化、垂直型清真食品B2B贸易与产业服务平台，链接中国优质清真食品产能与全球穆斯林消费市场。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速导航</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "首页", href: "/" },
                { label: "产品大厅", href: "/products" },
                { label: "优质供应商", href: "/suppliers" },
                { label: "服务中心", href: "/services" },
                { label: "产业生态", href: "/ecosystem" },
                { label: "资讯动态", href: "/news" },
                { label: "关于我们", href: "/about" },
                { label: "联系我们", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-brand-200 hover:text-gold-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">核心服务</h4>
            <ul className="space-y-2 text-sm">
              {[
                "合规认证代办",
                "跨境物流服务",
                "海外渠道拓展",
                "金融配套服务",
                "资质档案管理",
                "出口信保服务",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-brand-200 hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                <span>北京市朝阳区××路××号</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-500 shrink-0" />
                <span>+86 10-XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                <span>contact@ihf.org</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-brand-800">
              <div className="text-xs text-brand-300 space-y-1">
                <p>主办单位：中国食品药品企业质量安全促进会</p>
                <p>运营单位：中国-东盟特色产业链出海平台专业委员会</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-300">
          <p>© 2026 IHF 国际清真食品产业平台. 保留所有权利.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold-400 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-gold-400 transition-colors">服务条款</a>
            <a href="#" className="hover:text-gold-400 transition-colors flex items-center gap-1">
              备案信息
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
