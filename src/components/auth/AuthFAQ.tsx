import { SectionHeader } from "@/components/shared/SectionHeader";

const faqs = [
  {
    q: "供应商入驻需要哪些资质文件？",
    a: "供应商入驻需上传以下资质文件：营业执照（三证合一）、SC 认证（食品生产许可证）、HALAL 证书（清真认证）、出口备案证明。所有文件需清晰可辨，提交后由平台审核团队进行人工审核。",
  },
  {
    q: "审核需要多长时间？",
    a: "资质审核周期通常为 3-5 个工作日。审核期间您可以通过注册邮箱接收审核进度通知。如审核未通过，我们将告知具体原因，您可补充资料后重新提交。",
  },
  {
    q: "采购商注册需要哪些信息？",
    a: "采购商注册需提供企业名称、联系人姓名、联系电话、电子邮箱和国家/地区信息。注册完成后即可浏览产品、发起询盘并管理采购需求。采购商注册同样需要经过平台审核。",
  },
  {
    q: "平台支持哪些语言？",
    a: "一期支持中文、英文、印尼语三种语言。二期将上线阿拉伯语 RTL 版本，实现原生多语言适配。采购商注册时请选择您的常用语言，系统将自动适配界面语言。",
  },
  {
    q: "供应商入驻后可以享受哪些服务？",
    a: "入驻供应商可获得独立店铺系统（二期上线）、产品管理、询盘/订单管理、服务订单管理等功能。同时享受合规认证代办、跨境物流、海外渠道拓展、金融配套等一站式增值服务。",
  },
  {
    q: "平台是否收取入驻费用？",
    a: "平台一期对首批入驻供应商实行免费入驻政策，不收取注册费和年费。增值服务（如合规认证代办、跨境物流等）按服务项目单独收费，具体费用标准可咨询客服。",
  },
];

export function AuthFAQ() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="常见问题"
          subtitle="关于入驻、注册、审核等常见问题的解答"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors list-none">
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center shrink-0">
                    Q
                  </span>
                  {faq.q}
                </span>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 pl-14 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
