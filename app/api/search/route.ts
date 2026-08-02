import { NextRequest, NextResponse } from "next/server";
import { products, searchProducts } from "@/lib/products";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], blog: [], total: 0 });
  }

  const matchedProducts = searchProducts(query).slice(0, 8);

  // Blog search (static — replace with Supabase query in production)
  const blogPosts = [
    { slug: "science-hyaluronic-acid", title: "The Science Behind Hyaluronic Acid", category: "Ingredients" },
    { slug: "morning-skincare-routine", title: "Building Your Perfect Morning Skincare Routine", category: "Routines" },
    { slug: "ceramides-barrier-repair", title: "Ceramides: The Unsung Heroes of Barrier Repair", category: "Ingredients" },
    { slug: "clean-beauty-philosophy", title: "Why We Never Use Parabens or Sulfates", category: "Philosophy" },
  ];

  const matchedBlog = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    products: matchedProducts,
    blog: matchedBlog,
    total: matchedProducts.length + matchedBlog.length,
  });
}
