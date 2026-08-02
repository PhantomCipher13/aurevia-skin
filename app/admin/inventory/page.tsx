"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AdminInventoryPage() {
  const sb = createClient();

  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<Record<string, number>>({});
  const [saving, setSaving]       = useState<string | null>(null);
  const [toast, setToast]         = useState("");
  const [search, setSearch]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb
      .from("inventory")
      .select(`*, product:products(id, name, slug, sku, price)`)
      .order("quantity", { ascending: true });
    setInventory(data ?? []);
    setLoading(false);
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const saveQty = async (productId: string, invId: string, newQty: number) => {
    setSaving(invId);
    const { error } = await sb.from("inventory")
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq("id", invId);

    if (!error) {
      // Log history
      await sb.from("inventory_history").insert({
        product_id: productId,
        change: newQty - (inventory.find(i => i.id === invId)?.quantity ?? 0),
        reason: "Manual adjustment",
      });
      setInventory(prev => prev.map(i => i.id === invId ? { ...i, quantity: newQty } : i));
      setEditing(prev => { const n = { ...prev }; delete n[invId]; return n; });
      showToast("Stock updated");
    }
    setSaving(null);
  };

  const filtered = inventory.filter(i => {
    const q = search.toLowerCase();
    return !q || i.product?.name?.toLowerCase().includes(q) || i.product?.sku?.toLowerCase().includes(q);
  });

  const stockStatus = (qty: number, threshold: number) => {
    if (qty === 0) return { label: "Out of Stock", color: "#dc2626", bg: "rgba(239,68,68,0.1)" };
    if (qty <= threshold) return { label: "Low Stock", color: "#ca8a04", bg: "rgba(234,179,8,0.1)" };
    return { label: "In Stock", color: "#16a34a", bg: "rgba(34,197,94,0.1)" };
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Inventory" subtitle={`${inventory.filter(i => i.quantity === 0).length} out of stock · ${inventory.filter(i => i.quantity > 0 && i.quantity <= i.low_stock_threshold).length} low stock`} />

      <div className="flex-1 p-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Products", value: inventory.length, color: "#EAD9C3" },
            { label: "Low Stock",      value: inventory.filter(i => i.quantity > 0 && i.quantity <= i.low_stock_threshold).length, color: "#ca8a04" },
            { label: "Out of Stock",   value: inventory.filter(i => i.quantity === 0).length, color: "#dc2626" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.07)" }}>
              <p className="text-[22px] font-medium" style={{ fontFamily: "var(--font-heading)", color: s.color }}>{s.value}</p>
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
          <input type="text" placeholder="Search products…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }} />
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.02)" }} />)}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item, i) => {
              const status = stockStatus(item.quantity, item.low_stock_threshold);
              const editQty = editing[item.id];
              const isEditing = editQty !== undefined;

              return (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, ease }}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${item.quantity === 0 ? "rgba(239,68,68,0.12)" : "rgba(199,160,100,0.07)"}` }}>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{item.product?.name}</p>
                    <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
                      SKU: {item.product?.sku ?? "—"} · Threshold: {item.low_stock_threshold}
                    </p>
                  </div>

                  <span className="text-[9px] tracking-[0.08em] uppercase font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: status.bg, color: status.color, fontFamily: "var(--font-body)" }}>
                    {status.label}
                  </span>

                  {/* Qty edit */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <input type="number" min="0" value={editQty}
                          onChange={e => setEditing(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))}
                          className="w-20 px-2 py-1.5 rounded-lg text-[13px] outline-none text-center"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(199,160,100,0.2)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}
                        />
                        <button onClick={() => saveQty(item.product?.id, item.id, editQty)} disabled={saving === item.id}
                          className="px-3 py-1.5 rounded-lg text-[11px]"
                          style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
                          {saving === item.id ? "…" : "Save"}
                        </button>
                        <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[item.id]; return n; })}
                          className="px-3 py-1.5 rounded-lg text-[11px]"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(234,217,195,0.5)", fontFamily: "var(--font-body)" }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[16px] font-medium w-16 text-right"
                          style={{ fontFamily: "var(--font-heading)", color: item.quantity === 0 ? "#dc2626" : "#EAD9C3" }}>
                          {item.quantity}
                        </span>
                        <span className="text-[10px]" style={{ color: "rgba(234,217,195,0.3)", fontFamily: "var(--font-body)" }}>units</span>
                        <button onClick={() => setEditing(prev => ({ ...prev, [item.id]: item.quantity }))}
                          className="px-3 py-1.5 rounded-lg text-[11px] transition-colors hover:bg-white/5"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.1)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
