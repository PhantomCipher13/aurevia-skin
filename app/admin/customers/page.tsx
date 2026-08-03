"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;

type Customer = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  orderCount: number;
  totalSpent: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCustomers: 0, totalRevenue: 0 });

  useEffect(() => {
    async function fetchCustomers() {
      const supabase = createClient();
      
      const [
        { data: profiles },
        { data: orders }
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, phone, is_admin, created_at")
          .eq("is_admin", false)
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("user_id, total, payment_status")
      ]);

      if (profiles) {
        let totalRev = 0;
        
        const customerData = profiles.map((p) => {
          const customerOrders = orders?.filter((o) => o.user_id === p.id) || [];
          const customerTotalSpent = customerOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
          
          // Calculate overall paid revenue for stats
          const paidOrders = customerOrders.filter(o => o.payment_status === 'paid' || o.payment_status === 'succeeded');
          totalRev += paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

          return {
            id: p.id,
            full_name: p.full_name,
            phone: p.phone,
            created_at: p.created_at,
            orderCount: customerOrders.length,
            totalSpent: customerTotalSpent,
          };
        });
        
        setCustomers(customerData);
        setStats({
          totalCustomers: customerData.length,
          totalRevenue: totalRev
        });
      }
      setLoading(false);
    }
    
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const name = c.full_name || "Customer";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Customers" subtitle={`${customers.length} customers total`} />

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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-none placeholder-white/30"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(199,160,100,0.12)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Total Customers", value: stats.totalCustomers.toString() },
            { label: "Total Revenue (Paid)", value: `₹${stats.totalRevenue.toLocaleString()}` },
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
              gridTemplateColumns: "1fr 120px 100px 120px",
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
          </div>
          
          {loading ? (
            <div className="px-6 py-8 text-center text-[13px]" style={{ color: "rgba(234,217,195,0.5)", fontFamily: "var(--font-body)" }}>
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="px-6 py-8 text-center text-[13px]" style={{ color: "rgba(234,217,195,0.5)", fontFamily: "var(--font-body)" }}>
              No customers found.
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-8 text-center text-[13px]" style={{ color: "rgba(234,217,195,0.5)", fontFamily: "var(--font-body)" }}>
              No customers match your search.
            </div>
          ) : (
            filtered.map((customer, i) => {
              const displayName = customer.full_name || "Customer";
              const initial = displayName.charAt(0).toUpperCase();

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid items-center px-6 py-4 gap-4 hover:bg-white/[0.015] transition-colors"
                  style={{
                    gridTemplateColumns: "1fr 120px 100px 120px",
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(199,160,100,0.04)" : "none",
                  }}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
                        style={{ background: "rgba(199,160,100,0.15)", color: "#C7A064" }}
                      >
                        {initial}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                          {customer.full_name || "Unknown"}
                        </p>
                        <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>
                          {!customer.full_name ? "Customer" : customer.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.5)" }}>
                    {new Date(customer.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                    {customer.orderCount}
                  </span>
                  <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
                    ₹{customer.totalSpent.toLocaleString()}
                  </span>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
