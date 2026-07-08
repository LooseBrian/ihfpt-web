import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { NewsHero } from "@/components/news/NewsHero";
import { NewsFeed } from "@/components/news/NewsFeed";
import { RegionalNews } from "@/components/news/RegionalNews";
import { ProductTrends } from "@/components/news/ProductTrends";
import { NewsCTA } from "@/components/news/NewsCTA";

export default function NewsPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <NewsHero />
        <NewsFeed />
        <RegionalNews />
        <ProductTrends />
        <NewsCTA />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
