"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "@/components/ToastProvider";

const ease = [0.16, 1, 0.3, 1] as const;

const mockCoupons = [
  { id: "1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 0, maxUses: null, used: 23, active: true, expires: "2025-12-31" },
  { id: "2", code: "GLOW20", type: "percentage", value: 20, minOrder: 99, maxUses: 100, used: 67, active: true, expires: "2025-08-31" },
  { id: "3", code: "FLAT15", type: "fixed", value: 15, minOrder: 50, maxUses: 50, used: 50, active: false, expires: "2025-06-30" },
  { id: "4", code: "AUREVIA25", type: "fixed", value: 25, minOrder: 150, maxUses: 200, used: 12, active: true, expires: "2026-01-31" },
];

const emptyForm = {
  code: "", type: "percentage", value: "", minOrder: "0", maxUses: "", expires: "", active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { showToast } = useToast();

  const handleCreate = () => {
    if (!form.code || !form.value) { showToast("Please fill required fields", "info"); return; }
    setCoupons((prev) => [...prev, {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      type: form.type as "percentage" | "fixed",
      value: parseFloat(form.value),
      minOrder: parseFloat(form.minOrder) || 0,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      used: 0,
      active: true,
      expires: form.expires,
    }]);
    setShowForm(false);
    setForm(emptyForm);
    showToast(`Coupon ${form.code.toUpperCase()} created`, "success");
  };

  const toggleActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast("Coupon deleted", "info");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(199,160,100,0.15)",
    color: "#EAD9C3",
    fontFamily: "var(--font-body)",
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Coupons" subtitle="Create and manage discount codes" />

      <div className="flex-1 p-8">
        {/* Create coupon button */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>
            {coupons.filter(c => c.active).length} active coupons
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-xl text-[11px] tracking-[0.08em] uppercase font-semibold transition-all hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)]"
            style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
          >
            + Create Coupon
          </button>
        </div>

        {/* Create form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-6 rounded-2xl" style={{ background: "rgba(199,160,100,0.06)", border: "1px solid rgba(199,160,100,0.15)" }}>
                <h3 className="text-[14px] font-medium mb-5" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>New Coupon</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Code *</label>
                    <input type="text" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} placeholder="GLOW20" className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none uppercase" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Value *</label>
                    <input type="number" value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))} placeholder={form.type === "percentage" ? "20" : "15.00"} className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Min Order (₹)</label>
                    <input type="number" value={form.minOrder} onChange={e => setForm(f => ({...f, minOrder: e.target.value}))} placeholder="0" className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Max Uses</label>
                    <input type="number" value={form.maxUses} onChange={e => setForm(f => ({...f, maxUses: e.target.value}))} placeholder="Unlimited" className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Expires</label>
                    <input type="date" value={form.expires} onChange={e => setForm(f => ({...f, expires: e.target.value}))} className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreate} className="px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-[0.08em] font-semibold transition-all" style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>Create</button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-[0.08em] font-medium transition-all hover:bg-white/5" style={{ border: "1px solid rgba(199,160,100,0.15)", color: "rgba(234,217,195,0.5)", fontFamily: "var(--font-body)" }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coupons list */}
        <div className="space-y-3">
          {coupons.map((coupon, i) => {
            const usagePercent = coupon.maxUses ? (coupon.used / coupon.maxUses) * 100 : 0;
            const isExpired = coupon.expires && new Date(coupon.expires) < new Date();
            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease }}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${coupon.active && !isExpired ? "rgba(199,160,100,0.08)" : "rgba(255,255,255,0.04)"}`,
                  opacity: coupon.active && !isExpired ? 1 : 0.5,
                }}
              >
                <div className="font-mono text-[15px] font-bold flex-shrink-0" style={{ color: "#C7A064", letterSpacing: "0.08em" }}>
                  {coupon.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                      {coupon.type === "percentage" ? `${coupon.value}% off` : `₹${coupon.value} off`}
                    </span>
                    {coupon.minOrder > 0 && (
                      <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
                        Min. ₹{coupon.minOrder}
                      </span>
                    )}
                    {isExpired && <span className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", fontFamily: "var(--font-body)" }}>Expired</span>}
                    {coupon.expires && !isExpired && <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Expires {coupon.expires}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
                      {coupon.used} used{coupon.maxUses ? ` / ${coupon.maxUses}` : " (unlimited)"}
                    </span>
                    {coupon.maxUses && (
                      <div className="flex-1 h-1 rounded-full overflow-hidden max-w-[120px]" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${usagePercent}%`, background: usagePercent > 90 ? "#ef4444" : "#C7A064" }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
                      style={{ background: coupon.active ? "#C7A064" : "rgba(255,255,255,0.1)" }}
                      onClick={() => toggleActive(coupon.id)}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: coupon.active ? "calc(100% - 18px)" : "2px" }}
                      />
                    </div>
                  </label>
                  <button onClick={() => deleteCoupon(coupon.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: "rgba(239,68,68,0.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
