import {
  Award,
  Workflow,
  Users,
  LineChart,
} from "lucide-react";
import { serviceValueBadges } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Workflow,
  Users,
  LineChart,
};

export function ServiceValueProps() {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceValueBadges.map((badge) => {
            const Icon = iconMap[badge.icon] || Award;
            return (
              <div
                key={badge.id}
                className="bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
