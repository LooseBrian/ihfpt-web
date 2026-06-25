import {
  UtensilsCrossed,
  Snowflake,
  Beef,
  Wheat,
  Cookie,
  Flame,
  ArrowRight,
} from "lucide-react";
import type { Category } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Snowflake,
  Beef,
  Wheat,
  Cookie,
  Flame,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || UtensilsCrossed;

  return (
    <a
      href="#"
      className="group flex items-center gap-4 bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-300 p-4"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-brand-700 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-muted-foreground">{category.nameEn}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-1 transition-all shrink-0" />
    </a>
  );
}
