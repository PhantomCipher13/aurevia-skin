import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/* ── GET /api/products ── */
export async function GET(request: NextRequest) {
  try {
    const sb  = createAdminClient();
    const url = new URL(request.url);

    const category   = url.searchParams.get("category");
    const collection = url.searchParams.get("collection");
    const featured   = url.searchParams.get("featured") === "true";
    const search     = url.searchParams.get("q");
    const limit      = parseInt(url.searchParams.get("limit") ?? "50");

    let q = sb
      .from("products")
      .select(`*, images:product_images(url, alt, position, is_primary), inventory(quantity)`)
      .eq("status", "active")
      .order("display_order");

    if (featured)  q = q.eq("is_featured", true);
    if (category)  q = q.eq("category_id", category);
    if (collection) q = q.eq("collection_id", collection);
    if (search)    q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (limit)     q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── POST /api/products (admin only) ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sb = createAdminClient();

    const { images, inventory, ...productData } = body;

    const { data: product, error } = await sb
      .from("products")
      .insert({ ...productData, updated_at: new Date().toISOString() })
      .select("id")
      .single();

    if (error) throw error;

    // Insert images
    if (images?.length) {
      await sb.from("product_images").insert(
        images.map((img: any, i: number) => ({
          product_id: product.id,
          url: img.url,
          alt: img.alt,
          position: i,
          is_primary: i === 0,
        }))
      );
    }

    // Create inventory entry
    await sb.from("inventory").insert({
      product_id: product.id,
      quantity: inventory?.quantity ?? 0,
      low_stock_threshold: inventory?.low_stock_threshold ?? 10,
    });

    return NextResponse.json({ success: true, productId: product.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
