"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { getProducts, formatPrice, getPrimaryImage, type Product } from "@/lib/supabase/products";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];


const FILTERS = [
  { label: "All",         slug: null },
  { label: "Serums",      slug: "serums" },
  { label: "Moisturizers",slug: "moisturizers" },
  { label: "Cleansers",   slug: "cleansers" },
  { label: "Toners",      slug: "toners-mists" },
  { label: "Facial Oils", slug: "facial-oils" },
  { label: "Eye Care",    slug: "eye-care" },
  { label: "Masks",       slug: "masks" },
  { label: "SPF",         slug: "sun-care" },
];

const SORT_OPTIONS = [
  { label: "Featured",    value: "display_order" },
  { label: "Price: Low",  value: "price_asc" },
  { label: "Price: High", value: "price_desc" },
  { label: "Newest",      value: "newest" },
];

export default function ShopPage() {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort]         = useState("display_order");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toastId, setToastId]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getProducts({
      category: category ?? undefined,
      orderBy: sort as any,
    });
    setProducts(data);
    setLoading(false);
  }, [category, sort]);

  useEffect(() => { load(); }, [load]);

  const handleAddToCart = async (product: Product) => {
    setAddingId(product.id);
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.sale_price ?? product.price,
      image: getPrimaryImage(product),
      slug: product.slug,
      quantity: 1,
    });
    setAddingId(null);
    setToastId(product.id);
    setTimeout(() => setToastId(null), 2000);
  };

  return (
    <div style={{ background: "#FBF8F4", minHeight: "100vh" }}>

      {/* Hero Banner */}
      <div className="pt-28 pb-16 px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-[11px] tracking-[0.25em] uppercase mb-4"
          style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
          The Complete Collection
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-[36px] md:text-[52px]"
          style={{ fontFamily: "var(--font-heading)", color: "#1A1410", lineHeight: 1.15 }}>
          Shop All Products
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-4 text-[15px]"
          style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
          Dermatologist-tested formulas. Clean ingredients.
        </motion.p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-10 px-6 py-4" style={{ background: "rgba(251,248,244,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(199,160,100,0.08)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {FILTERS.map(f => (
              <button key={f.label} onClick={() => setCategory(f.slug)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-[11px] tracking-[0.06em] uppercase font-medium transition-all"
                style={{
                  background: category === f.slug ? "#1A1410" : "transparent",
                  border: "1px solid " + (category === f.slug ? "#1A1410" : "rgba(26,20,16,0.15)"),
                  color: category === f.slug ? "#FBF8F4" : "rgba(26,20,16,0.55)",
                  fontFamily: "var(--font-body)",
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-[12px] outline-none"
            style={{ background: "transparent", border: "1px solid rgba(26,20,16,0.15)", color: "#1A1410", fontFamily: "var(--font-body)" }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-square" style={{ background: "#EAD9C3" }} />
                <div className="p-4">
                  <div className="h-4 rounded mb-2" style={{ background: "#EAD9C3", width: "70%" }} />
                  <div className="h-3 rounded" style={{ background: "#EAD9C3", width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[15px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
              No products found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const img     = getPrimaryImage(product);
              const inStock = (product.inventory?.quantity ?? 1) > 0;
              const onSale  = !!product.sale_price;
              const rated   = product.review_count > 0;

              return (
                <motion.div key={product.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, ease, duration: 0.5 }}
                  className="group rounded-3xl overflow-hidden"
                  style={{ background: "#FFFFFF", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden" style={{ background: "#F6EEE4" }}>
                    <Link href={`/products/${product.slug}`}>
                      {img ? (
                        <Image src={img} alt={product.name} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[12px]"
                          style={{ color: "rgba(26,20,16,0.2)", fontFamily: "var(--font-body)" }}>
                          AUREVIA
                        </div>
                      )}
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {onSale && (
                        <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-full font-semibold"
                          style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>Sale</span>
                      )}
                      {product.is_featured && (
                        <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-full font-semibold"
                          style={{ background: "#1A1410", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>Bestseller</span>
                      )}
                      {!inStock && (
                        <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-full font-semibold"
                          style={{ background: "rgba(239,68,68,0.85)", color: "#fff", fontFamily: "var(--font-body)" }}>Sold Out</span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggle(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ background: "rgba(251,248,244,0.9)", backdropFilter: "blur(8px)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? "#C7A064" : "none"}
                        stroke={isWishlisted(product.id) ? "#C7A064" : "rgba(26,20,16,0.5)"} strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {/* Rating */}
                    {rated && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                              fill={s <= Math.round(product.review_avg) ? "#C7A064" : "none"}
                              stroke="#C7A064" strokeWidth="1.5">
                              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
                          ({product.review_count})
                        </span>
                      </div>
                    )}

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-[14px] font-medium mb-1 hover:text-[#C7A064] transition-colors"
                        style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                        {product.name}
                      </h3>
                    </Link>
                    {product.size && (
                      <p className="text-[10px] mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
                        {product.size}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                          {formatPrice(product.sale_price ?? product.price)}
                        </span>
                        {onSale && (
                          <span className="text-[11px] line-through ml-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.35)" }}>
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock || addingId === product.id}
                        className="px-3 py-2 rounded-xl text-[10px] tracking-[0.07em] uppercase font-semibold transition-all"
                        style={{
                          background: !inStock ? "rgba(26,20,16,0.08)" : addingId === product.id ? "rgba(199,160,100,0.6)" : toastId === product.id ? "rgba(34,197,94,0.15)" : "#1A1410",
                          color: !inStock ? "rgba(26,20,16,0.35)" : toastId === product.id ? "#16a34a" : "#EAD9C3",
                          fontFamily: "var(--font-body)",
                        }}>
                        {!inStock ? "Sold Out" : addingId === product.id ? "Adding…" : toastId === product.id ? "Added ✓" : "Add"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
