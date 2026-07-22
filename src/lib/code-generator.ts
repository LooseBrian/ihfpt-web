/**
 * ASIN-like code generation utilities.
 *
 * Generates human-readable, unambiguous codes for the three core entities:
 * - Product SKU:   `PT` + 8 chars  (e.g. "PTJJUHG5T7")
 * - Supplier code: `SR` + 8 chars  (e.g. "SRABCDEF23")
 * - Buyer code:    `BR` + 8 chars  (e.g. "BRXYZ5678GH")
 *
 * Design principles (high cohesion, low coupling, extensibility, maintainability):
 * - All code-generation logic lives in this single module so formats can evolve
 *   in one place.
 * - The charset excludes easily confused characters (0/O, 1/I/L) to keep codes
 *   readable when printed, spoken, or typed.
 * - Prefixes are exposed as constants so callers (validation, parsing) can
 *   reference the same source of truth.
 */

// ===== Configuration =====

/**
 * Unambiguous charset: no 0/O, 1/I/L to avoid transcription errors.
 */
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Prefixes — single source of truth for code format. */
export const PRODUCT_SKU_PREFIX = "PT";
export const SUPPLIER_CODE_PREFIX = "SR";
export const BUYER_CODE_PREFIX = "BR";

/** Fixed length of the random portion (after the prefix). */
const RANDOM_LENGTH = 8;

// ===== Public API =====

/**
 * Generate a product SKU code, e.g. "PTJJUHG5T7".
 * Used for frontend-only products (created locally before backend sync).
 */
export function generateProductSKU(): string {
  return PRODUCT_SKU_PREFIX + generateRandomChars(RANDOM_LENGTH);
}

/**
 * Generate a supplier code, e.g. "SRABCDEF23".
 * Used as a fallback when the backend has not yet returned a `user_code`.
 */
export function generateSupplierCode(): string {
  return SUPPLIER_CODE_PREFIX + generateRandomChars(RANDOM_LENGTH);
}

/**
 * Generate a buyer code, e.g. "BRXYZ5678GH".
 * Used for buyer mock login (buyer backend not yet wired up).
 */
export function generateBuyerCode(): string {
  return BUYER_CODE_PREFIX + generateRandomChars(RANDOM_LENGTH);
}

/**
 * Generate a generic code with a custom prefix.
 * Provided for future extensibility (e.g. admin codes, order codes).
 */
export function generateCode(prefix: string, length = RANDOM_LENGTH): string {
  return prefix + generateRandomChars(length);
}

/**
 * Validate the structural format of a code without any network call.
 * Returns true when the code matches `<prefix><RANDOM_LENGTH> chars`.
 */
export function isValidCodeFormat(
  code: string,
  prefix: string,
  length = RANDOM_LENGTH
): boolean {
  if (!code || code.length !== prefix.length + length) return false;
  if (!code.startsWith(prefix)) return false;
  const body = code.slice(prefix.length);
  for (const ch of body) {
    if (!CHARSET.includes(ch)) return false;
  }
  return true;
}

/** Convenience validators for each entity type. */
export const isProductSKU = (code: string) =>
  isValidCodeFormat(code, PRODUCT_SKU_PREFIX);
export const isSupplierCode = (code: string) =>
  isValidCodeFormat(code, SUPPLIER_CODE_PREFIX);
export const isBuyerCode = (code: string) =>
  isValidCodeFormat(code, BUYER_CODE_PREFIX);

// ===== Internals =====

function generateRandomChars(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return result;
}
