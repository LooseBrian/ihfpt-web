import { SectionHeader } from "@/components/shared/SectionHeader";
import { NewsCard } from "@/components/shared/NewsCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { news } from "@/lib/data";

export function NewsSection() {
  return (
    <section id="news" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="行业资讯"
          subtitle="平台动态、政策法规、市场分析，把握全球清真食品贸易最新脉搏"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            查看全部资讯
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
