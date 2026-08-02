"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { blogPosts, formatDate } from "@/lib/blog";

const ease = [0.16, 1, 0.3, 1] as const;

const allCategories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = blogPosts.filter((post) => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = blogPosts.find((p) => p.featured);
  const rest = filtered.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-24" style={{ background: "#FBF8F4" }}>
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.4em] uppercase font-semibold mb-4" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>The Glow Journal</p>
            <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400, lineHeight: 1.1 }}>
              Stories for Your Skin
            </h1>
            <p className="text-[13px] max-w-sm mx-auto" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>
              Science, rituals and expert advice for every skin type.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="flex gap-2 flex-wrap">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-full text-[10px] tracking-[0.08em] uppercase font-semibold transition-all"
                  style={{
                    background: activeCategory === cat ? "#342A24" : "#FFFFFF",
                    color: activeCategory === cat ? "#FFFFFF" : "#493E36",
                    border: activeCategory === cat ? "1px solid #342A24" : "1px solid #EAD9C3",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 pr-4 py-2.5 rounded-xl text-[12px] outline-none w-full sm:w-48"
                style={{ background: "#FFFFFF", border: "1px solid #EAD9C3", color: "#342A24", fontFamily: "var(--font-body)" }}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#493E36" strokeWidth="1.2" style={{ opacity: 0.4 }}>
                <circle cx="5.5" cy="5.5" r="4.5" /><path d="M9.5 9.5l2 2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Featured Hero Post */}
          {featured && activeCategory === "All" && !search && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mb-10">
              <Link href={`/blog/${featured.slug}`} className="group block rounded-3xl overflow-hidden relative" style={{ aspectRatio: "21/9", background: "#342A24" }}>
                <Image src={featured.image} alt={featured.title} fill className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(52,42,36,0.85) 0%, rgba(52,42,36,0.2) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-3 inline-block px-3 py-1 rounded-full" style={{ background: "rgba(199,160,100,0.25)", color: "#C7A064", border: "1px solid rgba(199,160,100,0.3)", fontFamily: "var(--font-body)" }}>
                    {featured.tag} · Featured
                  </span>
                  <h2 className="text-2xl md:text-4xl mb-2 leading-tight group-hover:text-[#EAD9C3] transition-colors" style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF", fontWeight: 400 }}>
                    {featured.title}
                  </h2>
                  <p className="text-[13px] mb-4 max-w-xl line-clamp-2" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)" }}>{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)" }}>
                    <span>{featured.author}</span><span style={{ color: "#C7A064" }}>·</span>
                    <span>{formatDate(featured.publishedAt)}</span><span style={{ color: "#C7A064" }}>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Post grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[24px] mb-2" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>No articles found</p>
              <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeCategory !== "All" || search ? filtered : rest).map((post, i) => (
                <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5, ease }}>
                  <Link href={`/blog/${post.slug}`} className="group block rounded-2xl overflow-hidden h-full" style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.1)" }}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(52,42,36,0.12)" }} />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(199,160,100,0.1)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                          {post.category}
                        </span>
                        <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>{post.readTime}</span>
                      </div>
                      <h3 className="text-[17px] mb-2 leading-snug group-hover:text-[#C7A064] transition-colors" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
                        {post.title}
                      </h3>
                      <p className="text-[12px] mb-4 line-clamp-2" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0" style={{ background: "rgba(199,160,100,0.12)", color: "#C7A064" }}>
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{post.author} · {formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
