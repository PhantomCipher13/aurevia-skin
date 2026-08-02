"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AdminHeader from "../components/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;
const inr  = (n: number) => "₹" + Number(n).toLocaleString("en-IN");

export default function AdminProductsPage() {
  const sb = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb
      .from("products")
      .select(`*, images:product_images(url, is_primary), inventory(quantity), category:categories(name)`)
      .order("display_order");
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleFeatured = async (id: string, current: boolean) => {
    await sb.from("products").update({ is_featured: !current }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: !current } : p));
    showToast(!current ? "Product featured" : "Removed from featured");
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "archived" : "active";
    await sb.from("products").update({ status: next }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: next } : p));
    showToast(`Product ${next}`);
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    const { error } = await sb.from("products").delete().eq("id", id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product deleted");
    }
    setDeleting(null);
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
  });

  const primaryImage = (p: any) =>
    p.images?.find((i: any) => i.is_primary)?.url ?? p.images?.[0]?.url ?? null;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Products"
        subtitle={`${products.length} products`}
        action={{ label: "Add Product", href: "/admin/products/new" }}
      />

      <div className="flex-1 p-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Active", value: products.filter(p => p.status === "active").length },
            { label: "Featured", value: products.filter(p => p.is_featured).length },
            { label: "Out of Stock", value: products.filter(p => (p.inventory?.quantity ?? 0) === 0).length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.07)" }}>
              <p className="text-[22px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{s.value}</p>
              <p className="text-[10px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="rgba(234,217,195,0.3)" strokeWidth="1.2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <circle cx="6" cy="6" r="4.5"/><path d="m11 11-2.5-2.5" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search products by name or SKU…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }} />
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.02)" }} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, ease }}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                style={{
                  background: deleting === product.id ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(199,160,100,0.07)"
                }}>

                {/* Image */}
                <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {primaryImage(product) ? (
                    <Image src={primaryImage(product)} alt={product.name} width={48} height={48}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px]"
                      style={{ color: "rgba(234,217,195,0.2)" }}>IMG</div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-medium truncate" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{product.name}</span>
                    {product.is_featured && (
                      <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(199,160,100,0.15)", color: "#C7A064", fontFamily: "var(--font-body)" }}>Featured</span>
                    )}
                    <span className={`text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full`}
                      style={{
                        background: product.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)",
                        color: product.status === "active" ? "#16a34a" : "#6b7280",
                        fontFamily: "var(--font-body)",
                      }}>{product.status}</span>
                  </div>
                  <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>
                    SKU: {product.sku ?? "—"} · {product.category?.name ?? "Uncategorized"} · Stock: {product.inventory?.quantity ?? 0}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0 mr-2">
                  {product.sale_price ? (
                    <>
                      <p className="text-[14px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{inr(product.sale_price)}</p>
                      <p className="text-[10px] line-through" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>{inr(product.price)}</p>
                    </>
                  ) : (
                    <p className="text-[14px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>{inr(product.price)}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/products/${product.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
                    Edit
                  </Link>
                  <button onClick={() => toggleFeatured(product.id, product.is_featured)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ background: product.is_featured ? "rgba(199,160,100,0.15)" : "rgba(255,255,255,0.05)", color: product.is_featured ? "#C7A064" : "rgba(234,217,195,0.4)" }}
                    title={product.is_featured ? "Remove from featured" : "Mark as featured"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={product.is_featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => toggleStatus(product.id, product.status)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(234,217,195,0.4)" }}
                    title={product.status === "active" ? "Archive product" : "Activate product"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {product.status === "active"
                        ? <><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></>
                        : <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>
                      }
                    </svg>
                  </button>
                  <button onClick={() => deleteProduct(product.id)}
                    disabled={deleting === product.id}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6M10,11v6M14,11v6M9,6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[14px] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
              {search ? "No products match your search" : "No products yet"}
            </p>
            {!search && (
              <Link href="/admin/products/new"
                className="inline-block px-6 py-3 rounded-xl text-[12px] tracking-[0.1em] uppercase"
                style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
                Add First Product
              </Link>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl z-50"
            style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)", fontSize: "13px" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
