import { Rocket, Layers, Globe } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const milestones = [
  {
    phase: "一期",
    period: "0 - 3 个月",
    title: "MVP 上线版",
    icon: Rocket,
    color: "brand",
    goals: [
      "完成首页、产品大厅、供应商列表、服务中心、平台介绍、入驻表单、资讯页开发",
      "支持中 / 英 / 印尼语三语",
      "基础用户体系、产品管理、供应商入驻审核、CMS 内容管理",
      "平台正式上线，完成首批 50 家供应商入驻",
    ],
  },
  {
    phase: "二期",
    period: "3 - 6 个月",
    title: "功能完善版",
    icon: Layers,
    color: "brand",
    goals: [
      "阿拉伯语 RTL 版本上线，原生多语言全量适配",
      "供应商独立店铺体系、在线询价系统、服务在线申请与进度查询",
      "询盘流转系统、合规服务管理系统、高级数据看板",
      "跑通贸易撮合 + 服务交付核心闭环",
    ],
  },
  {
    phase: "三期",
    period: "6 - 12 个月",
    title: "生态深化版",
    icon: Globe,
    color: "brand",
    goals: [
      "线上交易模块、采购商需求发布大厅、产业生态专区",
      "订单交易系统、智能匹配引擎、金融物流接口对接",
      "大数据分析体系、消息通知系统全量上线",
      "形成「贸易 + 服务 + 生态」完整闭环，成为行业标杆",
    ],
  },
];

export function AboutTimeline() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="发展里程碑"
          subtitle="三阶段建设路线，从 MVP 上线到生态闭环，稳步打造行业标杆级清真食品贸易平台"
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-200 md:-translate-x-1/2" />

          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isLeft = index % 2 === 0;
            return (
              <div
                key={milestone.phase}
                className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} mb-10 last:mb-0`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-brand-500 border-4 border-white flex items-center justify-center shadow-md">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Card */}
                <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-muted/30 rounded-xl border border-border/40 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-brand-100 text-brand-700 text-sm font-bold rounded-full">
                        {milestone.phase}
                      </span>
                      <span className="text-sm text-muted-foreground">{milestone.period}</span>
                    </div>
                    <h3 className="font-bold text-brand-900 text-lg mb-4">{milestone.title}</h3>
                    <ul className="space-y-2">
                      {milestone.goals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
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
