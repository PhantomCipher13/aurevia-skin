import { createClient } from "@/lib/supabase/client";

/* ── Types ────────────────────────────────────────────── */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: number;
  sale_price?: number;
  compare_at_price?: number;
  sku?: string;
  status: "draft" | "active" | "archived";
  is_featured: boolean;
  size?: string;
  details?: string;
  ingredients?: string;
  how_to_use?: string;
  skin_type?: string;
  concern?: string;
  review_count: number;
  review_avg: number;
  sold_count: number;
  display_order: number;
  category_id?: string;
  collection_id?: string;
  created_at: string;
  updated_at: string;
  // Joined relations
  images?: ProductImage[];
  inventory?: { quantity: number; low_stock_threshold: number };
  category?: { id: string; name: string; slug: string };
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  position: number;
  is_primary: boolean;
}

/* ── Fetch all active products ─────────────────────────── */
export async function getProducts(options?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  limit?: number;
  orderBy?: "price_asc" | "price_desc" | "newest" | "display_order";
}): Promise<Product[]> {
  const sb = createClient();
  let q = sb
    .from("products")
    .select(`
      *,
      images:product_images(id, url, alt, position, is_primary),
      inventory(quantity, low_stock_threshold),
      category:categories(id, name, slug)
    `)
    .eq("status", "active");

  if (options?.featured) q = q.eq("is_featured", true);

  if (options?.category) {
    const { data: cat } = await sb
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .single();
    if (cat) q = q.eq("category_id", cat.id);
  }

  if (options?.collection) {
    const { data: col } = await sb
      .from("collections")
      .select("id")
      .eq("slug", options.collection)
      .single();
    if (col) q = q.eq("collection_id", col.id);
  }

  switch (options?.orderBy) {
    case "price_asc":  q = q.order("price", { ascending: true });  break;
    case "price_desc": q = q.order("price", { ascending: false }); break;
    case "newest":     q = q.order("created_at", { ascending: false }); break;
    default:           q = q.order("display_order", { ascending: true }); break;
  }

  if (options?.limit) q = q.limit(options.limit);

  const { data, error } = await q;
  if (error) { console.error("[getProducts]", error); return []; }
  return (data ?? []) as unknown as Product[];
}

/* ── Fetch single product by slug ─────────────────────── */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = createClient();
  const { data, error } = await sb
    .from("products")
    .select(`
      *,
      images:product_images(id, url, alt, position, is_primary),
      inventory(quantity, low_stock_threshold),
      category:categories(id, name, slug)
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) { console.error("[getProductBySlug]", error); return null; }
  return data as unknown as Product;
}

/* ── Fetch featured products ──────────────────────────── */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

/* ── Search products ──────────────────────────────────── */
export async function searchProducts(query: string): Promise<Product[]> {
  const sb = createClient();
  const { data, error } = await sb
    .from("products")
    .select(`*, images:product_images(url, alt, is_primary)`)
    .eq("status", "active")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,concern.ilike.%${query}%`)
    .order("display_order")
    .limit(20);

  if (error) { console.error("[searchProducts]", error); return []; }
  return (data ?? []) as unknown as Product[];
}

/* ── Get primary image URL for a product ─────────────── */
export function getPrimaryImage(product: Product): string {
  const primary = product.images?.find((i) => i.is_primary);
  return primary?.url ?? product.images?.[0]?.url ?? "/images/product-placeholder.png";
}

/* ── Format price ─────────────────────────────────────── */
export function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}
