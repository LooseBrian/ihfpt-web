/**
 * Product image utilities — shared across all product display components.
 *
 * Default product images live in /public/media/ and are matched to the
 * product category/name. All backend-synced products (which have no real
 * image URL yet) receive one of these defaults so cards never show a broken
 * image icon.
 */

/** Absolute fallback when no category match is found. */
export const FALLBACK_PRODUCT_IMAGE = "/media/product-beef-meatballs.jpg";

/** A tiny SVG data-URI placeholder shown when an image fails to load. */
export const IMAGE_PLACEHOLDER_DATAURI =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">` +
      `<rect width="400" height="300" fill="#f3f4f6"/>` +
      `<text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">暂无图片</text>` +
      `</svg>`
  );

interface ImageHints {
  name?: string;
  category?: string;
}

/**
 * Pick a category-appropriate default product image from /public/media/.
 * Used by:
 *   - mapBackendProduct  (use-backend-products.ts)
 *   - syncFromBackend    (product-context.tsx)
 *
 * Keep the keyword list here in sync with the available files in /public/media/.
 */
export function getDefaultProductImage(hints: ImageHints): string {
  const categoryName = (hints.category || "").toLowerCase();
  const productName = (hints.name || "").toLowerCase();

  if (categoryName.includes("调味") || productName.includes("酱") || productName.includes("辣")) {
    return "/media/product-chili-sauce.jpg";
  }
  if (productName.includes("咖喱") || productName.includes("curry")) {
    return "/media/product-curry-sauce.jpg";
  }
  if (productName.includes("饺") || productName.includes("dumpling") || categoryName.includes("速冻")) {
    return "/media/product-frozen-dumplings.jpg";
  }
  if (productName.includes("汤") || productName.includes("soup")) {
    return "/media/product-instant-soup.jpg";
  }
  if (productName.includes("羊") || productName.includes("lamb")) {
    return "/media/product-lamb-skewers.jpg";
  }
  if (productName.includes("米") || categoryName.includes("粮油") || categoryName.includes("面")) {
    return "/media/product-organic-rice.jpg";
  }
  if (productName.includes("饼") || productName.includes("面包") || productName.includes("bread")) {
    return "/media/product-sesame-bread.jpg";
  }
  // Beef / meatballs / default
  return FALLBACK_PRODUCT_IMAGE;
}

/**
 * Sanitize a product image path:
 *   - Empty/undefined → default image (based on name/category)
 *   - blob: URLs (stale after page reload) → default image
 *   - Legacy "/product-*.jpg" (missing /media/ prefix) → "/media/product-*.jpg"
 *   - Already valid → return as-is
 */
export function sanitizeProductImage(image: string | undefined, hints: ImageHints): string {
  if (!image || image.trim() === "") {
    return getDefaultProductImage(hints);
  }
  // blob: URLs are session-specific and don't survive page reload.
  // Replace with a category-appropriate default so images never disappear.
  if (image.startsWith("blob:")) {
    return getDefaultProductImage(hints);
  }
  // Fix legacy paths that are missing the /media/ prefix
  if (image.startsWith("/product-") && !image.startsWith("/media/")) {
    return `/media${image}`;
  }
  return image;
}
