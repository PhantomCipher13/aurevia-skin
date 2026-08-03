"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getProductBySlug, formatPrice, type Product } from "@/lib/supabase/products";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { useAuth } from "@/components/AuthProvider";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Tab = "description" | "ingredients" | "how_to_use" | "reviews";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const sb = createClient();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user, profile } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Review form
  const [reviewForm, setRevForm] = useState({ rating: 5, title: "", body: "", skin_type: "" });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const load = useCallback(async () => {
    setLoading(true);
    const [prod, revData] = await Promise.all([
      getProductBySlug(slug),
      sb.from("reviews").select("*").eq("product_id", "placeholder").then(() => ({ data: [] })),
    ]);
    setProduct(prod);
    if (prod) {
      const { data } = await sb.from("reviews")
        .select("*")
        .eq("product_id", prod.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      setReviews(data ?? []);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const handleAddToCart = async () => {
    if (!product) return;
    // Require login before adding to cart
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setAdding(true);
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.sale_price ?? product.price,
      image: product.images?.[0]?.url ?? "",
      slug: product.slug,
      quantity: qty,
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewForm.body) return;
    setSubmitState("submitting");

    const { error } = await sb.from("reviews").insert({
      product_id: product.id,
      user_id: user?.id ?? null,
      reviewer_name: profile?.full_name ?? "Anonymous",
      reviewer_email: user?.email ?? null,
      rating: reviewForm.rating,
      title: reviewForm.title,
      body: reviewForm.body,
      skin_type: reviewForm.skin_type || null,
      verified_purchase: false,
      is_approved: false, // Awaits admin approval
    });

    setSubmitState(error ? "error" : "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF8F4" }}>
        <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "#C7A064", borderRightColor: "rgba(199,160,100,0.3)" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF8F4" }}>
        <div className="text-center">
          <p className="text-[16px] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>Product not found</p>
          <Link href="/shop" className="text-[13px]" style={{ color: "#C7A064", fontFamily: "var(--font-body)" }}>← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images ?? [];
  const inStock = (product.inventory?.quantity ?? 1) > 0;
  const stock   = product.inventory?.quantity ?? 0;
  const onSale  = !!product.sale_price;

  const tabs: { key: Tab; label: string }[] = [
    { key: "description",  label: "Description" },
    { key: "ingredients",  label: "Ingredients" },
    { key: "how_to_use",   label: "How to Use" },
    { key: "reviews",      label: `Reviews (${reviews.length})` },
  ];

  return (
    <div style={{ background: "#FBF8F4", minHeight: "100vh" }}>

      {/* ── Login Required Modal ── */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: "rgba(13,11,9,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-3xl p-8 text-center"
              style={{ background: "#1C1410", border: "1px solid rgba(199,160,100,0.2)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(199,160,100,0.12)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C7A064" strokeWidth="1.5">
                  <path d="M20 12V22H4V12" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 7H2v5h20V7z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-[22px] mb-2" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>Sign in to Shop</h3>
              <p className="text-[13px] mb-7 leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.5)" }}>
                Create a free account or sign in to add items to your cart and checkout seamlessly.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent("/products/" + slug)}`}
                  className="w-full py-3.5 rounded-xl text-[12px] tracking-[0.12em] uppercase font-semibold transition-all duration-300"
                  style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)", display: "block" }}
                >
                  Sign In
                </Link>
                <Link
                  href={`/auth/register?redirect=${encodeURIComponent("/products/" + slug)}`}
                  className="w-full py-3.5 rounded-xl text-[12px] tracking-[0.12em] uppercase font-semibold transition-all duration-300"
                  style={{ background: "transparent", color: "#EAD9C3", border: "1px solid rgba(199,160,100,0.25)", fontFamily: "var(--font-body)", display: "block" }}
                >
                  Create Account
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-[11px] mt-1 transition-colors"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
          <Link href="/" className="hover:text-[#C7A064] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C7A064] transition-colors">Shop</Link>
          {product.category && <>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#C7A064] transition-colors">{product.category.name}</Link>
          </>}
          <span>/</span>
          <span style={{ color: "#1A1410" }}>{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-4" style={{ background: "#F6EEE4" }}>
              <AnimatePresence mode="wait">
                <motion.div key={selectedImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }} className="absolute inset-0">
                  {images[selectedImg] ? (
                    <Image src={images[selectedImg].url} alt={images[selectedImg].alt ?? product.name}
                      fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[14px]"
                      style={{ fontFamily: "var(--font-heading)", color: "rgba(26,20,16,0.2)" }}>AUREVIA</div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Wishlist */}
              <button onClick={() => toggle(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(251,248,244,0.9)", backdropFilter: "blur(8px)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={isWishlisted(product.id) ? "#C7A064" : "none"}
                  stroke={isWishlisted(product.id) ? "#C7A064" : "rgba(26,20,16,0.5)"} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setImg(i)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all"
                    style={{
                      border: `2px solid ${i === selectedImg ? "#C7A064" : "transparent"}`,
                      background: "#F6EEE4",
                      opacity: i === selectedImg ? 1 : 0.6,
                    }}>
                    <Image src={img.url} alt={img.alt ?? product.name} width={64} height={64} className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
                {product.category.name}
              </p>
            )}

            <h1 className="text-[36px] mb-3 leading-[1.1]" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24"
                      fill={s <= Math.round(product.review_avg) ? "#C7A064" : "none"}
                      stroke="#C7A064" strokeWidth="1.5">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
                  {product.review_avg} ({product.review_count} review{product.review_count !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p className="text-[15px] mb-6 leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.6)" }}>
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-[32px]" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                {formatPrice(product.sale_price ?? product.price)}
              </span>
              {onSale && (
                <span className="text-[18px] line-through" style={{ fontFamily: "var(--font-heading)", color: "rgba(26,20,16,0.35)" }}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.size && (
              <p className="text-[12px] mb-6" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
                {product.size}
              </p>
            )}

            {/* Stock status */}
            {stock > 0 && stock <= 10 && (
              <p className="text-[12px] mb-4" style={{ fontFamily: "var(--font-body)", color: "#ca8a04" }}>
                ⚠ Only {stock} left in stock
              </p>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid rgba(26,20,16,0.15)" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-black/5"
                  style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#1A1410" }}>−</button>
                <span className="w-10 text-center text-[14px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(stock || 10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-black/5"
                  style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#1A1410" }}>+</button>
              </div>

              <button onClick={handleAddToCart} disabled={!inStock || adding}
                className="flex-1 py-3.5 rounded-xl text-[12px] tracking-[0.1em] uppercase font-semibold transition-all"
                style={{
                  background: !inStock ? "rgba(26,20,16,0.1)" : added ? "rgba(34,197,94,0.15)" : "#1A1410",
                  color: !inStock ? "rgba(26,20,16,0.35)" : added ? "#16a34a" : "#EAD9C3",
                  fontFamily: "var(--font-body)",
                }}>
                {!inStock ? "Out of Stock" : adding ? "Adding…" : added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>

            {/* Claims / Details */}
            {product.details && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.details.split("·").map(d => d.trim()).filter(Boolean).map(d => (
                  <span key={d} className="text-[10px] tracking-[0.05em] px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(199,160,100,0.08)", border: "1px solid rgba(199,160,100,0.15)", color: "rgba(26,20,16,0.6)", fontFamily: "var(--font-body)" }}>
                    {d}
                  </span>
                ))}
              </div>
            )}

            {/* Trust */}
            <div className="flex items-center gap-6 pt-5" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
              {[
                { icon: "🚚", text: "Free shipping over ₹999" },
                { icon: "↩", text: "30-day returns" },
                { icon: "🌿", text: "Clean ingredients" },
              ].map(t => (
                <div key={t.text} className="flex items-center gap-2">
                  <span className="text-[14px]">{t.icon}</span>
                  <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b overflow-x-auto" style={{ borderColor: "rgba(26,20,16,0.1)", scrollbarWidth: "none" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="px-6 py-3.5 text-[12px] tracking-[0.07em] uppercase font-medium flex-shrink-0 transition-all"
                style={{
                  fontFamily: "var(--font-body)",
                  color: tab === t.key ? "#1A1410" : "rgba(26,20,16,0.4)",
                  borderBottom: `2px solid ${tab === t.key ? "#1A1410" : "transparent"}`,
                  marginBottom: "-1px",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-3xl">
            {tab === "description" && (
              <p className="text-[14px] leading-[1.9]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.65)" }}>
                {product.long_description ?? product.description}
              </p>
            )}

            {tab === "ingredients" && (
              <div>
                <p className="text-[14px] leading-[1.9] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.65)" }}>
                  {product.ingredients ?? "Full ingredients list not available."}
                </p>
                {product.skin_type && (
                  <div className="mt-6">
                    <p className="text-[11px] tracking-[0.1em] uppercase mb-2"
                      style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Best For</p>
                    <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.6)" }}>{product.skin_type}</p>
                  </div>
                )}
                {product.concern && (
                  <div className="mt-4">
                    <p className="text-[11px] tracking-[0.1em] uppercase mb-2"
                      style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Addresses</p>
                    <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.6)" }}>{product.concern}</p>
                  </div>
                )}
              </div>
            )}

            {tab === "how_to_use" && (
              <p className="text-[14px] leading-[1.9]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.65)" }}>
                {product.how_to_use ?? "Usage instructions not available."}
              </p>
            )}

            {tab === "reviews" && (
              <div>
                {/* Existing Reviews */}
                {reviews.length === 0 ? (
                  <p className="text-[14px] mb-8" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  <div className="space-y-6 mb-10">
                    {reviews.map(review => (
                      <div key={review.id} className="pb-6" style={{ borderBottom: "1px solid rgba(26,20,16,0.07)" }}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex">
                                {[1,2,3,4,5].map(s => (
                                  <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                                    fill={s <= review.rating ? "#C7A064" : "none"} stroke="#C7A064" strokeWidth="1.5">
                                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                                  </svg>
                                ))}
                              </div>
                              {review.verified_purchase && (
                                <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                                  style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", fontFamily: "var(--font-body)" }}>
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                              {review.reviewer_name}
                            </p>
                            {review.skin_type && (
                              <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>{review.skin_type} skin</p>
                            )}
                          </div>
                          <p className="text-[11px] flex-shrink-0" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.35)" }}>
                            {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        {review.title && (
                          <p className="text-[14px] font-medium mb-1" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                            {review.title}
                          </p>
                        )}
                        <p className="text-[13px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.6)" }}>
                          {review.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write Review Form */}
                <div className="rounded-2xl p-6" style={{ background: "#F6EEE4" }}>
                  <h3 className="text-[18px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                    Write a Review
                  </h3>
                  {submitState === "success" ? (
                    <div className="px-4 py-3 rounded-xl text-[13px]"
                      style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a", fontFamily: "var(--font-body)" }}>
                      Thank you! Your review has been submitted and will appear after approval.
                    </div>
                  ) : (
                    <form onSubmit={submitReview} className="space-y-4">
                      {/* Star rating */}
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2"
                          style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>Rating</label>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} type="button" onClick={() => setRevForm(p => ({ ...p, rating: s }))}
                              className="text-[24px] transition-transform hover:scale-110">
                              <span style={{ color: s <= reviewForm.rating ? "#C7A064" : "rgba(26,20,16,0.2)" }}>★</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2"
                          style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>Review Title</label>
                        <input type="text" value={reviewForm.title}
                          onChange={e => setRevForm(p => ({ ...p, title: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                          style={{ background: "#FBF8F4", border: "1px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }}
                          placeholder="Summarise your experience…" />
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2"
                          style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>Your Review *</label>
                        <textarea rows={4} required value={reviewForm.body}
                          onChange={e => setRevForm(p => ({ ...p, body: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                          style={{ background: "#FBF8F4", border: "1px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)", resize: "vertical" }}
                          placeholder="Share your experience with this product…" />
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2"
                          style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>Skin Type</label>
                        <input type="text" value={reviewForm.skin_type}
                          onChange={e => setRevForm(p => ({ ...p, skin_type: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                          style={{ background: "#FBF8F4", border: "1px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }}
                          placeholder="e.g. Combination" />
                      </div>

                      {submitState === "error" && (
                        <p className="text-[12px]" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
                          Something went wrong. Please try again.
                        </p>
                      )}

                      <button type="submit" disabled={submitState === "submitting"}
                        className="px-8 py-3 rounded-xl text-[12px] tracking-[0.1em] uppercase font-semibold transition-all"
                        style={{ background: "#1A1410", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
                        {submitState === "submitting" ? "Submitting…" : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
