import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { ProductDetail } from "@/components/product/ProductDetail";
import { products } from "@/lib/data";
import { notFound } from "next/navigation";

// Pre-generate static params for known products
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <ProductDetail product={product} />
      <Footer />
      <BackToTop />
    </>
  );
}
