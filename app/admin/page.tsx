"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AdminHeader from "./components/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;
const inr  = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

type Period = "today" | "week" | "month";

const PERIOD_DAYS: Record<Period, number> = { today: 1, week: 7, month: 30 };

interface DashboardData {
  revenue: number;
  orders: number;
  customers: number;
  newCustomers: number;
  recentOrders: any[];
  topProducts: { name: string; sold: number; revenue: number }[];
  lowStockItems: { name: string; slug: string; quantity: number }[];
  pendingReviews: number;
  unreadMessages: number;
}

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

export default function AdminDashboard() {
  const sb = createClient();
  const [period, setPeriod]   = useState<Period>("today");
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    const days = PERIOD_DAYS[p];
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();

    // Revenue + orders
    const { data: orders } = await sb
      .from("orders")
      .select("id, total, created_at, status, payment_status, customer_name, order_items(product_name, quantity)")
      .gte("created_at", sinceISO)
      .order("created_at", { ascending: false });

    const revenue   = orders?.filter(o => o.payment_status === "paid").reduce((s, o) => s + Number(o.total), 0) ?? 0;
    const orderCount = orders?.length ?? 0;

    // New customers in period
    const { count: newCust } = await sb
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sinceISO)
      .eq("is_admin", false);

    // Total customers
    const { count: totalCust } = await sb
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_admin", false);

    // Top products by revenue in period
    const { data: orderItems } = await sb
      .from("order_items")
      .select(`product_name, quantity, total_price, order:orders!inner(created_at, payment_status)`)
      .gte("order.created_at" as any, sinceISO);

    const productMap = new Map<string, { sold: number; revenue: number }>();
    for (const item of orderItems ?? []) {
      const prev = productMap.get(item.product_name) ?? { sold: 0, revenue: 0 };
      productMap.set(item.product_name, {
        sold:    prev.sold + item.quantity,
        revenue: prev.revenue + Number(item.total_price),
      });
    }
    const topProducts = [...productMap.entries()]
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, v]) => ({ name, ...v }));

    // Low stock
    const { data: lowStock } = await sb
      .from("inventory")
      .select("quantity, low_stock_threshold, product:products(name, slug)")
      .lt("quantity", 15)
      .order("quantity", { ascending: true })
      .limit(5);

    // Pending reviews
    const { count: pendingReviews } = await sb
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false);

    // Unread messages
    const { count: unreadMessages } = await sb
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    setData({
      revenue,
      orders: orderCount,
      customers: totalCust ?? 0,
      newCustomers: newCust ?? 0,
      recentOrders: orders?.slice(0, 6) ?? [],
      topProducts,
      lowStockItems: (lowStock ?? []).map((s: any) => ({
        name: s.product?.name ?? "Unknown",
        slug: s.product?.slug ?? "",
        quantity: s.quantity,
      })),
      pendingReviews: pendingReviews ?? 0,
      unreadMessages: unreadMessages ?? 0,
    });
    setLoading(false);
  }, [sb]);

  useEffect(() => { load(period); }, [period, load]);

  const statCards = data ? [
    {
      label: "Revenue",
      value: inr(data.revenue),
      sub:   period === "today" ? "Today" : period === "week" ? "This Week" : "This Month",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M12 6v2m0 8v2M8 12h8"/>
        </svg>
      ),
    },
    {
      label: "Orders",
      value: data.orders.toLocaleString("en-IN"),
      sub: period === "today" ? "Today" : period === "week" ? "This Week" : "This Month",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
    },
    {
      label: "Customers",
      value: data.customers.toLocaleString("en-IN"),
      sub: `+${data.newCustomers} new`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
    {
      label: "Pending Reviews",
      value: data.pendingReviews.toString(),
      sub: `${data.unreadMessages} unread messages`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
        </svg>
      ),
    },
  ] : [];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Dashboard" subtitle="Welcome back — here's what's happening" />

      <div className="flex-1 p-6 md:p-8 space-y-7">

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          {(["today", "week", "month"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-2 rounded-xl text-[11px] tracking-[0.07em] uppercase font-medium transition-all"
              style={{
                background: period === p ? "rgba(199,160,100,0.18)" : "transparent",
                border: "1px solid " + (period === p ? "rgba(199,160,100,0.3)" : "rgba(199,160,100,0.1)"),
                color: period === p ? "#C7A064" : "rgba(234,217,195,0.4)",
                fontFamily: "var(--font-body)",
              }}>
              {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
          {loading && (
            <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin ml-2"
              style={{ borderTopColor: "#C7A064", borderRightColor: "rgba(199,160,100,0.3)" }} />
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl p-5 animate-pulse h-28"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.07)" }} />
            ))
          ) : (
            statCards.map((card, i) => (
              <motion.div key={card.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease }}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>{card.label}</span>
                  <span style={{ color: "rgba(199,160,100,0.5)" }}>{card.icon}</span>
                </div>
                <p className="text-[22px] font-medium mb-1"
                  style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>{card.value}</p>
                <p className="text-[11px]"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>{card.sub}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Orders */}
          <div className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.07)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
                Recent Orders
              </h3>
              <Link href="/admin/orders" className="text-[11px] tracking-[0.07em] uppercase"
                style={{ color: "#C7A064", fontFamily: "var(--font-body)" }}>View All →</Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 rounded-xl animate-pulse"
                    style={{ background: "rgba(255,255,255,0.02)" }} />
                ))}
              </div>
            ) : !data?.recentOrders.length ? (
              <p className="text-[13px] text-center py-8" style={{ color: "rgba(234,217,195,0.3)", fontFamily: "var(--font-body)" }}>
                No orders yet for this period
              </p>
            ) : (
              <div className="space-y-2">
                {data.recentOrders.map((order: any) => {
                  const st = statusColors[order.status] ?? statusColors.pending;
                  return (
                    <div key={order.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                            {order.customer_name}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.07em] px-1.5 py-0.5 rounded-full font-medium"
                            style={{ ...st, fontFamily: "var(--font-body)" }}>{order.status}</span>
                        </div>
                        <p className="text-[11px] truncate" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
                          {order.order_items?.[0]?.product_name ?? "—"}
                          {order.order_items?.length > 1 ? ` +${order.order_items.length - 1} more` : ""}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>
                          {inr(Number(order.total))}
                        </p>
                        <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.25)" }}>
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Top Products */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.07)" }}>
              <h3 className="text-[14px] font-medium mb-4" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
                Top Products
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-8 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />)}
                </div>
              ) : !data?.topProducts.length ? (
                <p className="text-[12px]" style={{ color: "rgba(234,217,195,0.3)", fontFamily: "var(--font-body)" }}>No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {data.topProducts.map((p, i) => {
                    const maxRev = data.topProducts[0].revenue;
                    const pct = maxRev > 0 ? (p.revenue / maxRev) * 100 : 0;
                    return (
                      <div key={p.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] truncate" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.6)" }}>{p.name}</span>
                          <span className="text-[11px] ml-2" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>{inr(p.revenue)}</span>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: "rgba(199,160,100,0.1)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #C7A064, #EAD9C3)" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            {!loading && (data?.lowStockItems.length ?? 0) > 0 && (
              <div className="rounded-2xl p-5"
                style={{ background: "rgba(234,179,8,0.04)", border: "1px solid rgba(234,179,8,0.15)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <h3 className="text-[13px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#ca8a04" }}>Low Stock</h3>
                </div>
                <div className="space-y-2">
                  {data!.lowStockItems.map(item => (
                    <div key={item.slug} className="flex justify-between items-center">
                      <span className="text-[11px] truncate" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.6)" }}>{item.name}</span>
                      <span className="text-[11px] font-medium ml-2" style={{ fontFamily: "var(--font-body)", color: item.quantity <= 5 ? "#dc2626" : "#ca8a04" }}>
                        {item.quantity} left
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/admin/inventory" className="block mt-3 text-[10px] tracking-[0.1em] uppercase"
                  style={{ color: "#ca8a04", fontFamily: "var(--font-body)" }}>
                  Manage Inventory →
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.07)" }}>
              <h3 className="text-[13px] font-medium mb-3" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Add Product",    href: "/admin/products/new" },
                  { label: "Write Article",  href: "/admin/blog/new" },
                  { label: "Manage Orders",  href: "/admin/orders" },
                  { label: "Review Approvals", href: "/admin/reviews" },
                ].map(a => (
                  <Link key={a.href} href={a.href}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                    <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.55)" }}>{a.label}</span>
                    <span style={{ color: "rgba(199,160,100,0.4)" }} className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
