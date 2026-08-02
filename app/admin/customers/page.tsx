"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AdminHeader from "../components/AdminHeader";

const ease = [0.16, 1, 0.3, 1] as const;

const mockCustomers = [
  { id: "1", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43210", orders: 8, totalSpend: 712.00, joined: "2024-03-12", lastOrder: "2025-07-14", status: "active" },
  { id: "2", name: "Ananya Gupta", email: "ananya@example.com", phone: "+91 91234 56789", orders: 5, totalSpend: 452.00, joined: "2024-06-20", lastOrder: "2025-07-14", status: "active" },
  { id: "3", name: "Rhea Mehta", email: "rhea@example.com", phone: "+91 88888 77777", orders: 3, totalSpend: 231.00, joined: "2024-09-08", lastOrder: "2025-07-13", status: "active" },
  { id: "4", name: "Simran Kaur", email: "simran@example.com", phone: "+91 77777 66666", orders: 12, totalSpend: 1104.00, joined: "2023-11-15", lastOrder: "2025-07-13", status: "active" },
  { id: "5", name: "Kavya Reddy", email: "kavya@example.com", phone: "+91 66666 55555", orders: 1, totalSpend: 178.00, joined: "2025-07-12", lastOrder: "2025-07-12", status: "active" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Customers" subtitle={`${mockCustomers.length} customers total`} />

      <div className="flex-1 p-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(234,217,195,0.3)" strokeWidth="1.2" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="7" cy="7" r="5" /><path d="m13 13-3-3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Customers", value: mockCustomers.length.toString() },
            { label: "Avg. Order Value", value: "₹1,899" },
            { label: "Repeat Buyers", value: `${mockCustomers.filter(c => c.orders > 1).length}` },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease }}
              className="p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
            >
              <p className="text-[22px] font-medium mb-1" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>{s.value}</p>
              <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(199,160,100,0.08)" }}
        >
          <div
            className="grid px-6 py-3 text-[10px] tracking-[0.15em] uppercase gap-4"
            style={{
              gridTemplateColumns: "1fr 120px 80px 120px 120px",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(199,160,100,0.06)",
              fontFamily: "var(--font-body)",
              color: "rgba(234,217,195,0.35)",
            }}
          >
            <span>Customer</span>
            <span>Joined</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Last Order</span>
          </div>

          {filtered.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid items-center px-6 py-4 gap-4 hover:bg-white/[0.015] transition-colors cursor-pointer"
              style={{
                gridTemplateColumns: "1fr 120px 80px 120px 120px",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(199,160,100,0.04)" : "none",
              }}
            >
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
                    style={{ background: "rgba(199,160,100,0.15)", color: "#C7A064" }}
                  >
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{customer.name}</p>
                    <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>{customer.email}</p>
                  </div>
                </div>
              </div>
              <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.5)" }}>
                {new Date(customer.joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
              <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                {customer.orders}
              </span>
              <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
                ₹{customer.totalSpend}
              </span>
              <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.5)" }}>
                {new Date(customer.lastOrder).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
