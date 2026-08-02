"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { categories } from "@/lib/products";
import { useToast } from "@/components/ToastProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [cats, setCats] = useState(
    categories.map((c, i) => ({ ...c, id: `cat-${i}`, productCount: [16, 4, 8, 2, 3, 1, 3, 2][i] || 0, isActive: true }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const handleAdd = () => {
    if (!form.name) { showToast("Name is required", "info"); return; }
    setCats((prev) => [...prev, { id: `cat-${Date.now()}`, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"), name: form.name, description: form.description, productCount: 0, isActive: true }]);
    setForm({ name: "", slug: "", description: "" });
    setShowForm(false);
    showToast("Category created", "success");
  };

  const toggleActive = (id: string) => {
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
    showToast("Category updated", "success");
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Categories" subtitle={`${cats.length} categories`} action={{ label: "+ New Category", href: "#" }} />
      <div className="flex-1 p-8 max-w-3xl">

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.12)" }}>
              <h3 className="text-[14px] font-medium mb-4" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>New Category</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] tracking-[0.1em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>Name *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                    placeholder="e.g. Serums" className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.1em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>Slug</label>
                  <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="auto-generated" className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[10px] tracking-[0.1em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>Description</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description..." className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAdd} className="px-6 py-3 rounded-xl text-[11px] tracking-[0.08em] uppercase font-semibold" style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>Create</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-[11px] tracking-[0.08em] uppercase font-medium" style={{ border: "1px solid rgba(199,160,100,0.2)", color: "rgba(234,217,195,0.6)", fontFamily: "var(--font-body)" }}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="mb-6 px-5 py-3 rounded-xl text-[11px] tracking-[0.08em] uppercase font-semibold transition-all hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)]"
            style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>
            + New Category
          </button>
        )}

        {/* Category list */}
        <div className="space-y-3">
          {cats.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, ease }}
              className="flex items-center justify-between p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[16px]" style={{ background: "rgba(199,160,100,0.1)" }}>
                  {["✦", "◇", "◈", "◉", "●", "★", "☀", "♥"][i % 8]}
                </div>
                <div>
                  <p className="text-[14px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{cat.name}</p>
                  <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>/{cat.slug} · {cat.productCount} products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-[0.1em] uppercase font-semibold px-3 py-1 rounded-full"
                  style={{ background: cat.isActive ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)", color: cat.isActive ? "#16a34a" : "#6b7280", fontFamily: "var(--font-body)" }}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <button onClick={() => toggleActive(cat.id)} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[11px]" style={{ color: "rgba(234,217,195,0.4)", fontFamily: "var(--font-body)" }}>
                  Toggle
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
