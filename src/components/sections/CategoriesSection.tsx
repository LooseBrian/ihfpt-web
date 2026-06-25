import { SectionHeader } from "@/components/shared/SectionHeader";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { categories } from "@/lib/data";

export function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="核心品类专区"
          subtitle="覆盖清真食品全产业链，从预制菜到调味品，满足全球采购商多元化需求"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
