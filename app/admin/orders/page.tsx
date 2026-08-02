"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;
const inr  = (n: number) => "₹" + Number(n).toLocaleString("en-IN");

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered:  { bg: "rgba(34,197,94,0.1)",   text: "#16a34a" },
  shipped:    { bg: "rgba(59,130,246,0.1)",   text: "#2563eb" },
  processing: { bg: "rgba(234,179,8,0.1)",    text: "#ca8a04" },
  confirmed:  { bg: "rgba(139,92,246,0.1)",   text: "#7c3aed" },
  pending:    { bg: "rgba(107,114,128,0.1)",  text: "#6b7280" },
  packed:     { bg: "rgba(14,165,233,0.1)",   text: "#0284c7" },
  cancelled:  { bg: "rgba(239,68,68,0.1)",    text: "#dc2626" },
  refunded:   { bg: "rgba(239,68,68,0.08)",   text: "#f87171" },
};

const ALL_STATUSES = ["pending","confirmed","processing","packed","shipped","delivered","cancelled","refunded"];

export default function AdminOrdersPage() {
  const sb = createClient();

  const [orders, setOrders]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [expandedId, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating]   = useState<string | null>(null);
  const [toast, setToast]         = useState("");
  const [totalRevenue, setRev]    = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb
      .from("orders")
      .select(`*, order_items(*), timeline:order_timeline(*)`)
      .order("created_at", { ascending: false })
      .limit(200);
    setOrders(data ?? []);
    const rev = (data ?? []).filter(o => o.payment_status === "paid").reduce((s, o) => s + Number(o.total), 0);
    setRev(rev);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.order_number?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const { error } = await sb.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
    if (!error) {
      // Add timeline entry
      await sb.from("order_timeline").insert({ order_id: orderId, status: newStatus, note: `Status updated to ${newStatus}` });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}`);
    }
    setUpdating(null);
  };

  const updateTracking = async (orderId: string, tracking: string) => {
    await sb.from("orders").update({ tracking_number: tracking }).eq("id", orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, tracking_number: tracking } : o));
    showToast("Tracking number saved");
  };

  const filteredRevenue = filtered.filter(o => o.payment_status === "paid").reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Orders" subtitle={`${orders.length} total orders · ${inr(totalRevenue)} revenue`} />

      <div className="flex-1 p-8">

        {/* Revenue Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue",   value: inr(totalRevenue), sub: `${orders.filter(o => o.payment_status === "paid").length} paid orders` },
            { label: "Pending",         value: orders.filter(o => o.status === "pending").length.toString(),   sub: "Awaiting confirmation" },
            { label: "In Progress",     value: orders.filter(o => ["confirmed","processing","packed"].includes(o.status)).length.toString(), sub: "Being prepared" },
            { label: "Shipped/Delivered", value: orders.filter(o => ["shipped","delivered"].includes(o.status)).length.toString(), sub: "On the way or done" },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease }}
              className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}>
              <p className="text-[18px] font-medium mb-1" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{card.value}</p>
              <p className="text-[10px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>{card.label}</p>
              <p className="text-[10px] mt-0.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.2)" }}>{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="rgba(234,217,195,0.3)" strokeWidth="1.2"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="6" cy="6" r="4.5"/><path d="m11 11-2.5-2.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search by order ID, customer or email…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }} />
          </div>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-[12px] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.02)" }} />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((order, i) => {
              const st  = statusColors[order.status] ?? statusColors.pending;
              const pay = order.payment_status === "paid"
                ? { bg: "rgba(34,197,94,0.1)", text: "#16a34a" }
                : order.payment_status === "refunded"
                ? { bg: "rgba(239,68,68,0.08)", text: "#f87171" }
                : { bg: "rgba(107,114,128,0.1)", text: "#6b7280" };
              const isExpanded = expandedId === order.id;

              return (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, ease }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(199,160,100,0.08)", background: "rgba(255,255,255,0.02)" }}>

                  {/* Row */}
                  <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.015] transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : order.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                          {order.order_number}
                        </span>
                        <span className="text-[9px] tracking-[0.07em] uppercase font-semibold px-2 py-0.5 rounded-full"
                          style={{ ...st, fontFamily: "var(--font-body)" }}>{order.status}</span>
                        <span className="text-[9px] tracking-[0.07em] uppercase font-semibold px-2 py-0.5 rounded-full"
                          style={{ ...pay, fontFamily: "var(--font-body)" }}>{order.payment_status}</span>
                      </div>
                      <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>
                        {order.customer_name} · {order.order_items?.length ?? 0} item{(order.order_items?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[16px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{inr(order.total)}</p>
                      <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.25)" }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}
                      style={{ color: "rgba(234,217,195,0.3)" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M3 5l4 4 4-4" strokeLinecap="round"/>
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expanded */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease }} className="overflow-hidden">
                        <div className="px-5 pb-5" style={{ borderTop: "1px solid rgba(199,160,100,0.06)" }}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">

                            {/* Customer info */}
                            <div>
                              <p className="text-[9px] tracking-[0.15em] uppercase mb-2"
                                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Customer</p>
                              <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{order.customer_name}</p>
                              <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.45)" }}>{order.customer_email}</p>
                              <p className="text-[11px] mb-3" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.45)" }}>{order.customer_phone}</p>
                              <p className="text-[9px] tracking-[0.15em] uppercase mb-1"
                                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Shipping Address</p>
                              {order.shipping_address && (
                                <p className="text-[11px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.45)" }}>
                                  {order.shipping_address.street}, {order.shipping_address.city},<br/>
                                  {order.shipping_address.state} {order.shipping_address.zip}
                                </p>
                              )}
                            </div>

                            {/* Items + total */}
                            <div>
                              <p className="text-[9px] tracking-[0.15em] uppercase mb-2"
                                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Items</p>
                              {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between mb-1.5">
                                  <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.6)" }}>
                                    {item.product_name} × {item.quantity}
                                  </span>
                                  <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{inr(item.total_price)}</span>
                                </div>
                              ))}
                              <div className="h-px my-2" style={{ background: "rgba(199,160,100,0.08)" }} />
                              <div className="flex justify-between">
                                <span className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>Total</span>
                                <span className="text-[15px]" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{inr(order.total)}</span>
                              </div>
                            </div>

                            {/* Admin controls */}
                            <div>
                              <p className="text-[9px] tracking-[0.15em] uppercase mb-2"
                                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Update Status</p>
                              <select
                                defaultValue={order.status}
                                onChange={e => updateStatus(order.id, e.target.value)}
                                disabled={updating === order.id}
                                className="w-full px-3 py-2.5 rounded-xl text-[12px] outline-none mb-3"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
                                {ALL_STATUSES.map(s => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>

                              <p className="text-[9px] tracking-[0.15em] uppercase mb-2"
                                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Tracking Number</p>
                              <div className="flex gap-2">
                                <input
                                  type="text" defaultValue={order.tracking_number ?? ""}
                                  placeholder="Add tracking number…"
                                  id={`tracking-${order.id}`}
                                  className="flex-1 px-3 py-2 rounded-xl text-[12px] outline-none"
                                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}
                                />
                                <button
                                  onClick={() => {
                                    const val = (document.getElementById(`tracking-${order.id}`) as HTMLInputElement)?.value;
                                    if (val) updateTracking(order.id, val);
                                  }}
                                  className="px-3 py-2 rounded-xl text-[11px]"
                                  style={{ background: "rgba(199,160,100,0.12)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                                  Save
                                </button>
                              </div>

                              {order.admin_notes && (
                                <div className="mt-3 px-3 py-2 rounded-xl text-[11px]"
                                  style={{ background: "rgba(199,160,100,0.05)", border: "1px solid rgba(199,160,100,0.1)", color: "rgba(199,160,100,0.7)", fontFamily: "var(--font-body)" }}>
                                  {order.admin_notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer Strip */}
        <div className="mt-6 px-6 py-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ background: "rgba(199,160,100,0.05)", border: "1px solid rgba(199,160,100,0.1)" }}>
          <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.5)" }}>
            Showing {filtered.length} of {orders.length} orders
          </p>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5"
              style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>Filtered Revenue</p>
            <p className="text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{inr(filteredRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Toast */}
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
