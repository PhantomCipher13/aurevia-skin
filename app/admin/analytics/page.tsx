"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { products } from "@/lib/products";

const ease = [0.16, 1, 0.3, 1] as const;

function BarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.02, ease }}
          className="flex-1 rounded-t-sm"
          style={{ background: i === data.length - 1 ? "#C7A064" : "rgba(199,160,100,0.25)", minHeight: 2 }}
          title={`${label}: ${v}`}
        />
      ))}
    </div>
  );
}

function LineChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 500, h = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`);
  const area = `0,${h} ${points.join(" ")} ${w},${h}`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7A064" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C7A064" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lineGrad)" />
      <polyline points={points.join(" ")} fill="none" stroke="#C7A064" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const revenue30Days = [820, 940, 780, 1100, 950, 1200, 1400, 1250, 1600, 1800, 1650, 2000, 1900, 2100, 2300, 2050, 2400, 2200, 2600, 2500, 2800, 2700, 2900, 3100, 2950, 3200, 3100, 3400, 3300, 3600];
const ordersPerDay = [4, 5, 3, 7, 6, 8, 9, 7, 10, 12, 11, 13, 12, 14, 15, 13, 16, 14, 17, 16, 18, 17, 19, 20, 19, 21, 20, 22, 21, 24];
const productSales = [142, 89, 54, 38, 87, 62, 120, 95, 64, 78, 98, 45, 52, 33, 110, 41, 88];
const productNames = ["Radiance Serum", "Vitamin C Serum", "Retinol Renewal Serum", "Peptide Firming Serum", "Cloud Cream Moisturizer", "Ceramide Repair Cream", "Gentle Foam Cleanser", "Micellar Cleansing Water", "Dew Barrier Mist", "Niacinamide Toner", "Night Recovery Oil", "Peptide Eye Cream", "Hydrating Face Mask", "Enzyme Exfoliating Mask", "Mineral SPF 50", "Glow Face Oil", "Tinted Lip Balm"];

const statCards = [
  { label: "Total Revenue", value: "₹24,83,000", sub: "+18.2% this month", positive: true },
  { label: "Avg Order Value", value: "₹1,899", sub: "+3.1% this month", positive: true },
  { label: "Total Orders", value: "348", sub: "+12.5% this month", positive: true },
  { label: "Repeat Purchase Rate", value: "42%", sub: "-2% this month", positive: false },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Analytics" subtitle="Revenue, orders, and product performance" />

      <div className="flex-1 p-8">
        {/* Period toggle */}
        <div className="flex items-center gap-2 mb-8">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-2 rounded-xl text-[11px] tracking-[0.08em] uppercase font-medium transition-all"
              style={{
                background: period === p ? "rgba(199,160,100,0.15)" : "transparent",
                border: period === p ? "1px solid rgba(199,160,100,0.3)" : "1px solid transparent",
                color: period === p ? "#C7A064" : "rgba(234,217,195,0.4)",
                fontFamily: "var(--font-body)",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ease }}
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
            >
              <p className="text-[26px] font-medium mb-1" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>{s.value}</p>
              <p className="text-[11px] mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>{s.label}</p>
              <p className="text-[11px] font-semibold" style={{ fontFamily: "var(--font-body)", color: s.positive ? "#16a34a" : "#ef4444" }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Revenue chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease }}
            className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>Revenue</h3>
                <p className="text-[11px] mt-0.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Last 30 days</p>
              </div>
              <span className="text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>₹24,83,000</span>
            </div>
            <LineChart data={revenue30Days} />
            <div className="flex justify-between mt-3">
              {["1", "7", "14", "21", "30"].map((d) => (
                <span key={d} className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.2)" }}>Jul {d}</span>
              ))}
            </div>
          </motion.div>

          {/* Orders chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, ease }}
            className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>Orders Per Day</h3>
                <p className="text-[11px] mt-0.5" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Last 30 days</p>
              </div>
              <span className="text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>348 total</span>
            </div>
            <BarChart data={ordersPerDay} label="Orders" />
          </motion.div>
        </div>

        {/* Product performance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ease }}
          className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>Product Performance (Top 8)</h3>
            <span className="text-[11px] cursor-pointer" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>View All</span>
          </div>
          <div className="space-y-4">
            {productSales.map((sales, i) => ({ name: productNames[i], sales, index: i }))
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 8)
              .map((item, i) => {
                const product = products.find(p => p.name === item.name);
                const price = product ? product.price : 1000;
                const revenue = item.sales * price;
                const maxSales = Math.max(...productSales);
                const colors = ["#C7A064", "#EAD9C3", "#DCC6A7", "#BFA07A"];
                return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.7)" }}>{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>{item.sales} sold</span>
                    <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
                      ₹{revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.sales / maxSales) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors[i % colors.length]}, rgba(199,160,100,0.4))` }}
                  />
                </div>
              </div>
                );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
