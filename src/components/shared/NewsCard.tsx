import { Calendar, Tag } from "lucide-react";
import type { NewsItem } from "@/lib/data";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
            <Tag className="h-3 w-3" />
            {news.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {news.date}
          </span>
        </div>

        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {news.excerpt}
        </p>

        <a
          href="#"
          className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
        >
          阅读更多
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </article>
  );
}
