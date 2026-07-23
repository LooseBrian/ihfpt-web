import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { SupplierStorefront, type StorefrontData } from "@/components/supplier/SupplierStorefront";
import { suppliers } from "@/lib/data";
import { notFound } from "next/navigation";

/**
 * Store Page — Amazon-style vendor-code URL routing
 *
 * Supports two URL patterns:
 *   1. /store/SRXXXXXXXX  — Supplier user_code (primary, Amazon-style)
 *   2. /store/huifa       — Legacy slug (backward compatibility)
 *
 * Amazon design parallel:
 *   amazon.com/sp?seller=XXXX  ≈  /store/SRXXXXXXXX
 *
 * The user_code in the URL serves as:
 *   - Immutable public identifier (survives company-name changes)
 *   - Shareable, bookmarkable URL
 *   - Decoupled from internal DB primary keys (no ID enumeration risk)
 *   - Cross-system reference (admin, storefront, API, orders all use same code)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Pre-generate static params for known suppliers (legacy slugs + API codes)
export async function generateStaticParams() {
  const staticSlugs = [
    { id: "huifa" },
    { id: "s1" },
    { id: "s2" },
    { id: "s3" },
    { id: "s4" },
    { id: "s5" },
    { id: "s6" },
  ];

  // Try to fetch supplier codes from API at build time
  try {
    const res = await fetch(`${API_BASE_URL}/api/supplier/codes`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const codeParams = json.data.map((code: string) => ({ id: code }));
        return [...staticSlugs, ...codeParams];
      }
    }
  } catch {
    // API not available during build — use static slugs only
  }

  return staticSlugs;
}

// Dynamic page title — Amazon shows seller name in browser tab
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (id.startsWith("SR") && id.length >= 6) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/supplier/by-code/${id}`, {
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const name = json.data.company_name || json.data.name || "供应商";
          return {
            title: `${name} | IHF 供应商店铺`,
            description: `${name} — 国际清真食品产业平台认证供应商，编码 ${id}`,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return { title: "供应商店铺 | IHF" };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Pattern 1: Supplier user_code (starts with "SR" — Amazon-style URL)
  if (id.startsWith("SR") && id.length >= 6) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/supplier/by-code/${id}`,
        { next: { revalidate: 300 } } // Cache 5 minutes
      );

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;

          // Fetch the supplier's approved products for the storefront display
          let storefrontProducts: StorefrontData["products"] = [];
          try {
            const prodRes = await fetch(
              `${API_BASE_URL}/api/products?supplier_id=${s.id}&per_page=20`,
              { next: { revalidate: 300 } }
            );
            if (prodRes.ok) {
              const prodJson = await prodRes.json();
              if (prodJson.success && Array.isArray(prodJson.data)) {
                storefrontProducts = prodJson.data.map((p: Record<string, unknown>) => ({
                  id: String(p.id),
                  name: (p.name as string) || "未命名产品",
                  spec: (p.specifications as string) || "—",
                  price: p.price ? `¥${p.price}/${(p.unit as string) || "件"}` : "询价",
                  image:
                    (p.images as string[])?.[0] ||
                    "/media/product-lamb-skewers.jpg",
                  category: (p.category_name as string) || "其他",
                }));
              }
            }
          } catch {
            // Products fetch failed — show storefront without product cards
          }

          return (
            <>
              <TopBar />
              <Navbar />
              <SupplierStorefront
                data={{
                  supplierCode: s.user_code,
                  companyName: s.company_name || s.name || "未知企业",
                  shortName: s.company_name || s.name || "未知企业",
                  slogan: "专注清真食品 · 品质连接世界",
                  description: `${s.company_name || s.name} 是国际清真食品产业平台的认证供应商。`,
                  role: s.tier || "认证供应商",
                  verified: true,
                  categories: [],
                  markets: [],
                  products: storefrontProducts,
                  cases: [],
                  qualifications: [],
                  stats: {
                    products: s.product_count || storefrontProducts.length,
                    inquiries: 0,
                    visits: 0,
                    followers: 0,
                  },
                  contact: {
                    phone: "—",
                    email: "—",
                    address: s.location || "—",
                    hours: "周一至周五 9:00-18:00",
                  },
                }}
              />
              <Footer />
              <BackToTop />
            </>
          );
        }
      }
      // API returned 404 or error — fall through to notFound
      notFound();
    } catch {
      // Network error — fall through to existing logic
    }
  }

  // Pattern 2: Legacy slug "huifa" → default mock data
  if (id === "huifa") {
    return (
      <>
        <TopBar />
        <Navbar />
        <SupplierStorefront />
        <Footer />
        <BackToTop />
      </>
    );
  }

  // Pattern 3: Known mock suppliers (s1-s6)
  const supplier = suppliers.find((s) => s.id === id);

  if (!supplier) {
    notFound();
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <SupplierStorefront />
      <Footer />
      <BackToTop />
    </>
  );
}
