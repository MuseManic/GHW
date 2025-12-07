/**
 * Product ID mapping for WooCommerce
 * Maps product slugs to their numeric WooCommerce IDs
 */

export const PRODUCT_IDS: Record<string, number> = {
  // Cannafusion variations
  'botaani-cannafusion': 94,
  'cannafusion': 94,
  
  // Serum variations
  'botaani-serum': 810,
  'serum': 810,
  
  // Face variations
  'botaani-face': 816,
  'face': 816,
  
  // Body variations
  'botaani-body': 817,
  'body': 817,
};

/**
 * Get numeric product ID from slug or ID string
 * @param idOrSlug - Product ID (as string) or slug
 * @returns Numeric product ID
 */
export function getProductId(idOrSlug: string | number): number {
  // If already a number, return it
  if (typeof idOrSlug === 'number') {
    return idOrSlug;
  }

  // Try to parse as number first
  const parsed = parseInt(idOrSlug);
  if (!isNaN(parsed)) {
    return parsed;
  }

  // Look up by slug
  const id = PRODUCT_IDS[idOrSlug];
  if (id) {
    return id;
  }

  console.warn(`Unknown product ID or slug: ${idOrSlug}`);
  return 0;
}

/**
 * Get product slug from numeric ID
 * @param id - Numeric product ID
 * @returns Product slug or null if not found
 */
export function getProductSlug(id: number): string | null {
  const entry = Object.entries(PRODUCT_IDS).find(([_, productId]) => productId === id);
  return entry ? entry[0] : null;
}
