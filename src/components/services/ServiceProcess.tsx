import {
  FileInput,
  ClipboardList,
  FolderOpen,
  Settings,
  Activity,
  PackageCheck,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { serviceProcessSteps } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileInput,
  ClipboardList,
  FolderOpen,
  Settings,
  Activity,
  PackageCheck,
};

export function ServiceProcess() {
  return (
    <section className="py-14 bg-brand-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="服务全流程可视化"
          subtitle="从需求提交到交付归档，每个节点实时更新，支持在线查询办理进度与历史记录"
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-8 left-[8.33%] right-[8.33%] h-0.5 bg-brand-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {serviceProcessSteps.map((step) => {
              const Icon = iconMap[step.icon] || FileInput;
              return (
                <div key={step.id} className="relative flex flex-col items-center text-center">
                  {/* Circle */}
                  <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-brand-500 mb-4">
                    <Icon className="h-7 w-7 text-brand-600" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed px-2">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
