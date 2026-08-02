"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { getFeaturedProducts, getPrimaryImage, formatPrice, type Product } from "@/lib/supabase/products";

// Static fallback products while Supabase loads
const STATIC_PRODUCTS = [
  { id: "1", name: "Radiance Serum",          slug: "radiance-serum",  description: "Brightens, hydrates & improves glow in 4 weeks",   price: 1899, sale_price: null, images: [{ url: "/images/product-radiance-serum.png", is_primary: true, alt: "Radiance Serum" }], review_count: 0, review_avg: 0, inventory: { quantity: 100 } },
  { id: "2", name: "Cloud Cream Moisturizer", slug: "cloud-cream",      description: "Deep 72-hour hydration for soft, supple skin",      price: 1699, sale_price: null, images: [{ url: "/images/product-cloud-cream.png",    is_primary: true, alt: "Cloud Cream" }],    review_count: 0, review_avg: 0, inventory: { quantity: 100 } },
  { id: "3", name: "Night Recovery Oil",      slug: "night-oil",        description: "Repairs & restores skin while you sleep",          price: 2299, sale_price: null, images: [{ url: "/images/product-night-oil.png",      is_primary: true, alt: "Night Oil" }],       review_count: 0, review_avg: 0, inventory: { quantity: 100 } },
  { id: "4", name: "Vitamin C Serum",         slug: "vitamin-c-serum",  description: "15% vitamin C for maximum brightening power",      price: 2199, sale_price: null, images: [{ url: "/images/product-vitamin-c-serum.png",is_primary: true, alt: "Vitamin C" }],       review_count: 0, review_avg: 0, inventory: { quantity: 100 } },
] as unknown as Product[];

const sizeMap = ["large", "medium", "medium", "large"] as const;

/* ─── Benefit Badges ───────────────────────────────────────────── */
const benefits = [
  {
    label: "Deep Hydration",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M11 2C11 2 4 9.5 4 13.5C4 17.366 7.134 20 11 20C14.866 20 18 17.366 18 13.5C18 9.5 11 2 11 2Z"
          stroke="#C7A064"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M8 14C8 15.657 9.343 17 11 17"
          stroke="#C7A064"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "Natural Glow",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="4" stroke="#C7A064" strokeWidth="1.5" fill="none" />
        <path d="M11 2V4" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 18V20" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.22 4.22L5.64 5.64" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.36 16.36L17.78 17.78" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 11H4" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 11H20" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.22 17.78L5.64 16.36" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.36 5.64L17.78 4.22" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Barrier Repair",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M11 2L13.09 8.26L20 9.27L15 13.97L16.18 20.02L11 17.27L5.82 20.02L7 13.97L2 9.27L8.91 8.26L11 2Z"
          stroke="#C7A064"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "Lightweight Feel",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M15 4C15 4 13 7 11 7C9 7 7 4 7 4"
          stroke="#C7A064"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M17 9C17 9 14 12 11 12C8 12 5 9 5 9"
          stroke="#C7A064"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M19 14C19 14 15.5 17 11 17C6.5 17 3 14 3 14"
          stroke="#C7A064"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
];

/* ─── Smooth easing ────────────────────────────────────────────── */
const smoothEase = [0.16, 1, 0.3, 1] as const;

function ProductCard({
  product,
  index,
  aspectRatio,
}: {
  product: Product;
  index: number;
  aspectRatio: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-80px" });
  const { addItem } = useCart();
  const { showToast } = useToast();
  const img = getPrimaryImage(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, name: product.name, price: product.sale_price ?? product.price, image: img ?? "", slug: product.slug, quantity: 1 });
    showToast(`${product.name} added to bag`, "cart", formatPrice(product.sale_price ?? product.price));
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.9, ease: smoothEase, delay: index * 0.15 }}
      className="group relative"
      style={{ willChange: "transform, opacity" }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio }}
        >
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-[1.03]"
              style={{
                transitionDuration: "800ms",
                transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#F6EEE4", fontFamily: "var(--font-heading)", color: "rgba(26,20,16,0.2)", fontSize: "14px" }}>
              AUREVIA
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{
              background:
                "linear-gradient(to top, rgba(52, 42, 36, 0.75) 0%, rgba(52, 42, 36, 0.35) 35%, transparent 65%)",
              transitionDuration: "600ms",
            }}
          />

          {/* Golden glow on hover */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(to top, rgba(199, 160, 100, 0.18) 0%, transparent 100%)",
              transitionDuration: "600ms",
            }}
          />

          {/* Text overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transition-transform group-hover:-translate-y-1"
            style={{
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <h3
              className="text-xl sm:text-2xl lg:text-[1.75rem] font-[var(--font-heading)] mb-1"
              style={{ color: "#FFFFFF", lineHeight: 1.2 }}
            >
              {product.name}
            </h3>

            <p
              className="text-xs sm:text-sm font-[var(--font-body)] mb-3"
              style={{ color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}
            >
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <span
                className="text-sm sm:text-base font-[var(--font-body)] font-medium tracking-wide"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                {formatPrice(product.sale_price ?? product.price)}
              </span>

              <div className="flex items-center gap-3">
                {/* Add to Bag button */}
                <button
                  onClick={handleAddToCart}
                  className="relative z-10 px-4 py-2 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 hover:bg-white hover:text-[#342A24]"
                  style={{
                    background: "rgba(199,160,100,0.9)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Add to Bag
                </button>

                {/* View Product link */}
                <span
                  className="text-xs sm:text-sm font-[var(--font-body)] font-medium inline-flex items-center gap-1.5 transition-all"
                  style={{ color: "#C7A064", transitionDuration: "300ms" }}
                >
                  View
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function Bestsellers() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const badgesRef = useRef<HTMLDivElement>(null);
  const badgesInView = useInView(badgesRef, { once: true, margin: "-60px" });

  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);

  useEffect(() => {
    getFeaturedProducts(4).then(data => {
      if (data && data.length > 0) setProducts(data);
    }).catch(() => {/* keep static fallback */});
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "#FBF8F4" }}
      className="py-32 px-6"
    >
      <div className="mx-auto" style={{ maxWidth: "1400px" }}>
        {/* ── Section Header ─────────────────────────────── */}
        <div className="mb-20 lg:mb-24">
          {/* Label with line accent */}
          <div className="overflow-hidden mb-5">
            <motion.div
              initial={{ y: "100%" }}
              animate={headerInView ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.7, ease: smoothEase }}
              className="flex items-center gap-4"
            >
              <span
                className="block h-px w-8"
                style={{ backgroundColor: "#C7A064" }}
              />
              <span
                className="text-[11px] tracking-[0.3em] uppercase font-[var(--font-body)] font-medium"
                style={{ color: "#C7A064", fontVariant: "all-small-caps" }}
              >
                Our Bestsellers
              </span>
            </motion.div>
          </div>

          {/* Main heading — clip reveal */}
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={headerInView ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.85, ease: smoothEase, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-[var(--font-heading)]"
              style={{ color: "#342A24", lineHeight: 1.15 }}
            >
              Loved by Skin.
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={headerInView ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.85, ease: smoothEase, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-[var(--font-heading)]"
              style={{ color: "#342A24", lineHeight: 1.15 }}
            >
              Trusted by You.
            </motion.h2>
          </div>
        </div>

        {/* ── Editorial Asymmetric Grid ─────────────────── */}

        {/* Row 1: 60% / 40% — large left, medium right with different heights */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-7 mb-5 lg:mb-7">
          {/* Product 1 — Large (60%) — taller aspect */}
          <div className="w-full md:w-[58%]">
            <ProductCard
              product={products[0]}
              index={0}
              aspectRatio="3 / 4"
            />
          </div>
          {/* Product 2 — Medium (40%) — shorter aspect for visual tension */}
          <div className="w-full md:w-[42%] md:self-end">
            <ProductCard
              product={products[1]}
              index={1}
              aspectRatio="4 / 5"
            />
          </div>
        </div>

        {/* Row 2: 40% / 60% — mirrored layout */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-7">
          {/* Product 3 — Medium (40%) — shorter aspect */}
          <div className="w-full md:w-[42%]">
            <ProductCard
              product={products[2]}
              index={2}
              aspectRatio="4 / 5"
            />
          </div>
          {/* Product 4 — Large (60%) — taller aspect */}
          <div className="w-full md:w-[58%] md:self-start">
            <ProductCard
              product={products[3]}
              index={3}
              aspectRatio="3 / 4"
            />
          </div>
        </div>

        {/* ── Benefit Badges ─────────────────────────────── */}
        <motion.div
          ref={badgesRef}
          initial="hidden"
          animate={badgesInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          className="mt-24 lg:mt-28 flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: smoothEase },
                },
              }}
              className="flex items-center gap-3"
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor: "rgba(199, 160, 100, 0.1)" }}
              >
                {benefit.icon}
              </span>
              <span
                className="text-xs sm:text-sm tracking-[0.05em] font-medium font-[var(--font-body)]"
                style={{ color: "#493E36" }}
              >
                {benefit.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Thin separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={badgesInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: smoothEase, delay: 0.6 }}
          className="mt-20 h-px origin-left"
          style={{ backgroundColor: "rgba(199, 160, 100, 0.25)" }}
        />
      </div>
    </section>
  );
}
