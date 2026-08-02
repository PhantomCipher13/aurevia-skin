"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { BlogPost, BlogSection } from "@/lib/blog";
import { getProductBySlug } from "@/lib/products";

const ease = [0.16, 1, 0.3, 1] as const;

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "intro":
      return (
        <p className="text-[17px] leading-[1.85] font-medium mb-8" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>
          {section.text}
        </p>
      );
    case "h2":
      return (
        <h2 className="text-[26px] md:text-[30px] mt-12 mb-4" style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 500, lineHeight: 1.2 }}>
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-[19px] mt-8 mb-3" style={{ fontFamily: "var(--font-heading)", color: "#493E36", fontWeight: 500 }}>
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[15px] leading-[1.85] mb-5" style={{ fontFamily: "var(--font-body)", color: "#493E36" }}>
          {section.text}
        </p>
      );
    case "quote":
      return (
        <div className="my-10 pl-6 border-l-4" style={{ borderColor: "#C7A064" }}>
          <p className="text-[18px] italic leading-[1.7]" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
            &ldquo;{section.text}&rdquo;
          </p>
        </div>
      );
    case "tip":
      return (
        <div className="my-8 p-5 rounded-2xl" style={{ background: "rgba(199,160,100,0.08)", border: "1px solid rgba(199,160,100,0.2)" }}>
          <p className="text-[10px] tracking-[0.15em] uppercase font-semibold mb-2" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>✦ Expert Tip</p>
          <p className="text-[14px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "#493E36" }}>{section.text}</p>
        </div>
      );
    case "list":
      return (
        <ul className="mb-6 space-y-2.5">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "#493E36" }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C7A064" }} />
              {item}
            </li>
          ))}
        </ul>
      );
    case "divider":
      return <div className="my-10 h-px" style={{ background: "linear-gradient(to right, transparent, #EAD9C3, transparent)" }} />;
    case "product-cta": {
      const product = section.productSlug ? getProductBySlug(section.productSlug) : null;
      if (!product) return null;
      return (
        <div className="my-10 p-6 rounded-2xl flex items-center gap-5" style={{ background: "#F6EEE4", border: "1px solid #EAD9C3" }}>
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#FFFFFF" }}>
            <Image src={product.image} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Featured in this article</p>
            <p className="text-[14px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{product.name}</p>
            <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>{product.tagline}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="px-5 py-2.5 rounded-full text-[10px] tracking-[0.12em] uppercase font-semibold whitespace-nowrap flex-shrink-0 transition-all hover:shadow-[0_4px_16px_rgba(52,42,36,0.15)]"
            style={{ background: "#342A24", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
          >
            Shop Now ₹{product.price}
          </Link>
        </div>
      );
    }
    default:
      return null;
  }
}

export default function BlogPostClient({
  post,
  related,
  formattedDate,
}: {
  post: BlogPost;
  related: BlogPost[];
  formattedDate: string;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen" style={{ background: "#FBF8F4" }}>

        {/* ── Hero Image ── */}
        <div className="relative w-full" style={{ height: "60vh", minHeight: 400, maxHeight: 640 }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(52,42,36,0.85) 0%, rgba(52,42,36,0.4) 50%, transparent 80%)" }}
          />
          {/* Back link */}
          <Link
            href="/blog"
            className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase font-medium transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Journal
          </Link>

          {/* Post meta on image */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12">
            <div className="max-w-3xl">
              <span
                className="inline-block mb-3 text-[9px] tracking-[0.3em] uppercase font-semibold px-3 py-1 rounded-full"
                style={{ background: "rgba(199,160,100,0.25)", color: "#C7A064", fontFamily: "var(--font-body)", border: "1px solid rgba(199,160,100,0.3)" }}
              >
                {post.category}
              </span>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl leading-tight mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF", fontWeight: 400 }}
              >
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.65)" }}>
                <span>{post.author}</span>
                <span style={{ color: "rgba(199,160,100,0.5)" }}>·</span>
                <span>{formattedDate}</span>
                <span style={{ color: "rgba(199,160,100,0.5)" }}>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Article Body ── */}
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-[17px] leading-[1.7] mb-8"
            style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.7 }}
          >
            {post.subtitle}
          </motion.p>

          <div className="mb-10 h-px" style={{ background: "linear-gradient(to right, #EAD9C3, transparent)" }} />

          {/* Content sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {post.content.map((section, i) => (
              <RenderSection key={i} section={section} />
            ))}
          </motion.div>

          {/* Author Card */}
          <div className="mt-16 pt-8 border-t" style={{ borderColor: "#EAD9C3" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-medium flex-shrink-0"
                style={{ background: "rgba(199,160,100,0.12)", color: "#C7A064", fontFamily: "var(--font-heading)" }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{post.author}</p>
                <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{post.authorRole}</p>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <p className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>Share</p>
            {[
              { label: "Copy link", action: () => navigator.clipboard.writeText(window.location.href), icon: "🔗" },
              { label: "Twitter/X", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`), icon: "𝕏" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] transition-all hover:-translate-y-0.5"
                style={{ background: "#F6EEE4", border: "1px solid #EAD9C3", color: "#342A24" }}
                title={btn.label}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <div className="py-16 px-6" style={{ background: "#F6EEE4", borderTop: "1px solid #EAD9C3" }}>
            <div className="max-w-5xl mx-auto">
              <p className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-2" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Continue Reading</p>
              <h2 className="text-[28px] mb-10" style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400 }}>Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group">
                    <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.1)" }}>
                      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>{rel.category}</span>
                        <h3 className="text-[16px] mt-1.5 mb-2 group-hover:text-[#C7A064] transition-colors" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>{rel.title}</h3>
                        <p className="text-[12px] line-clamp-2" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>{rel.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
