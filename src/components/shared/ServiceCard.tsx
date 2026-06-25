import { ShieldCheck, Truck, Globe, Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Truck,
  Globe,
  Landmark,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Globe;

  return (
    <div className="group bg-white rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col">
      <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors">
        <Icon className="h-6 w-6 text-brand-700 group-hover:text-white transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">{service.title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{service.titleEn}</p>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {service.description}
      </p>

      <Button
        variant="ghost"
        size="sm"
        className="mt-4 text-brand-600 hover:text-brand-700 hover:bg-brand-50 p-0 h-auto gap-1 self-start"
      >
        了解详情
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
