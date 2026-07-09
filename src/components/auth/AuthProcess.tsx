import { FileText, Upload, ClipboardCheck, Store } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const steps = [
  {
    icon: FileText,
    title: "提交申请",
    desc: "填写企业基本信息、联系人信息，在线提交入驻申请表单",
    phase: "Step 1",
  },
  {
    icon: Upload,
    title: "资质上传",
    desc: "上传营业执照、SC 认证、HALAL 证书、出口备案等资质文件",
    phase: "Step 2",
  },
  {
    icon: ClipboardCheck,
    title: "人工审核",
    desc: "平台审核团队对提交资料进行人工审核，确保资质真实有效",
    phase: "Step 3",
  },
  {
    icon: Store,
    title: "开通店铺",
    desc: "审核通过后开通店铺权限，配置产品陈列与企业信息",
    phase: "Step 4",
  },
];

export function AuthProcess() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="供应商入驻流程"
          subtitle="四步完成入驻，从申请到开店，全流程线上化操作"
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-brand-200" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Number circle */}
                    <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center mb-4 relative z-10">
                      <Icon className="h-7 w-7 text-brand-600" />
                    </div>
                    {/* Phase badge */}
                    <span className="text-xs text-brand-500 font-semibold mb-1">
                      {step.phase}
                    </span>
                    {/* Title */}
                    <h3 className="font-bold text-brand-900 text-sm mb-2">{step.title}</h3>
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow between steps (mobile) */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-2">
                      <div className="w-px h-6 bg-brand-200" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-brand-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-sm text-brand-700 leading-relaxed">
                供应商资质文件需通过人工审核，审核周期约为 <strong>3-5 个工作日</strong>。
                审核通过后将自动开通店铺权限，您即可开始上传产品并接收询盘。
                二期上线后，资质证书将支持在线核验与到期自动预警。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
