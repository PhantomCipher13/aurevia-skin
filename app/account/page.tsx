"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const inr  = (n: number) => "₹" + Number(n).toLocaleString("en-IN");

type Section = "overview" | "orders" | "wishlist" | "addresses" | "profile";

const statusColors: Record<string, { bg: string; text: string }> = {
  delivered:  { bg: "rgba(34,197,94,0.1)",  text: "#16a34a" },
  shipped:    { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  processing: { bg: "rgba(234,179,8,0.1)",  text: "#ca8a04" },
  confirmed:  { bg: "rgba(139,92,246,0.1)", text: "#7c3aed" },
  pending:    { bg: "rgba(107,114,128,0.1)",text: "#6b7280" },
  packed:     { bg: "rgba(14,165,233,0.1)", text: "#0284c7" },
  cancelled:  { bg: "rgba(239,68,68,0.1)",  text: "#dc2626" },
};

export default function AccountPage() {
  const sb = createClient();
  const { user, profile, logout, updateProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [section, setSection]   = useState<Section>("overview");
  const [orders, setOrders]     = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddr]    = useState<any[]>([]);
  const [loadingData, setLoad]  = useState(false);

  const [profileEdit, setProfileEdit] = useState({ full_name: "", phone: "" });
  const [savingProfile, setSave]      = useState(false);
  const [toast, setToast]             = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login?redirect=/account");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load data when section changes
  useEffect(() => {
    if (!user) return;
    setProfileEdit({ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" });

    const load = async () => {
      setLoad(true);
      if (section === "orders") {
        const { data } = await sb.from("orders")
          .select("*, order_items(*), timeline:order_timeline(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setOrders(data ?? []);
      } else if (section === "wishlist") {
        const { data } = await sb.from("wishlist")
          .select("product:products(id, name, slug, price, sale_price, images:product_images(url, is_primary))")
          .eq("user_id", user.id);
        setWishlist((data ?? []).map((w: any) => w.product));
      } else if (section === "addresses") {
        const { data } = await sb.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false });
        setAddr(data ?? []);
      }
      setLoad(false);
    };
    load();
  }, [section, user, profile, sb]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const saveProfile = async () => {
    setSave(true);
    const { success, error } = await updateProfile({ full_name: profileEdit.full_name, phone: profileEdit.phone });
    setSave(false);
    showToast(success ? "Profile updated" : error ?? "Update failed");
  };

  const removeWishlistItem = async (productId: string) => {
    await sb.from("wishlist").delete().eq("user_id", user!.id).eq("product_id", productId);
    setWishlist(prev => prev.filter(p => p.id !== productId));
  };

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (authLoading) return null;

  const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "overview",  label: "Overview",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { key: "orders",    label: "My Orders", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg> },
    { key: "wishlist",  label: "Wishlist",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
    { key: "addresses", label: "Addresses", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> },
    { key: "profile",   label: "Profile",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  return (
    <div style={{ background: "#FBF8F4", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[28px]" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
              My Account
            </h1>
            <p className="text-[13px] mt-1" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>
              Welcome back, {profile?.full_name?.split(" ")[0] ?? user?.email}
            </p>
          </div>
          <button onClick={logout}
            className="px-5 py-2.5 rounded-xl text-[11px] tracking-[0.1em] uppercase font-medium transition-all"
            style={{ border: "1px solid rgba(26,20,16,0.15)", color: "rgba(26,20,16,0.6)", fontFamily: "var(--font-body)" }}>
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-2xl p-4" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
              {/* Avatar */}
              <div className="text-center py-4 mb-4 px-2" style={{ borderBottom: "1px solid rgba(199,160,100,0.1)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-[22px] font-medium"
                  style={{ background: "rgba(199,160,100,0.1)", color: "#C7A064", fontFamily: "var(--font-heading)" }}>
                  {(profile?.full_name ?? user?.email ?? "U")[0].toUpperCase()}
                </div>
                <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                  {profile?.full_name ?? "Your Account"}
                </p>
                <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>
                  {user?.email}
                </p>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.key} onClick={() => setSection(item.key)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all"
                    style={{
                      background: section === item.key ? "rgba(199,160,100,0.08)" : "transparent",
                      color: section === item.key ? "#C7A064" : "rgba(26,20,16,0.55)",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                    }}>
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">

            {/* Overview */}
            {section === "overview" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Total Orders", value: orders.length || "—" },
                    { label: "Wishlisted",   value: wishlist.length || "—" },
                    { label: "Addresses",    value: addresses.length || "—" },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-5 text-center"
                      style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                      <p className="text-[24px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>{s.value}</p>
                      <p className="text-[10px] tracking-[0.1em] uppercase mt-1" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                  <p className="text-[14px] mb-3" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>Quick Links</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "View Orders", onClick: () => setSection("orders") },
                      { label: "My Wishlist",  onClick: () => setSection("wishlist") },
                      { label: "Addresses",    onClick: () => setSection("addresses") },
                      { label: "Edit Profile", onClick: () => setSection("profile") },
                    ].map(a => (
                      <button key={a.label} onClick={a.onClick}
                        className="py-3 rounded-xl text-[12px] tracking-[0.07em] uppercase font-medium transition-colors"
                        style={{ border: "1px solid rgba(199,160,100,0.2)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders */}
            {section === "orders" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
                <h2 className="text-[20px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>My Orders</h2>
                {loadingData ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "#fff" }} />)}
                  </div>
                ) : !orders.length ? (
                  <div className="rounded-2xl p-10 text-center" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                    <p className="text-[14px] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>No orders yet</p>
                    <Link href="/shop" className="px-6 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold"
                      style={{ background: "#1A1410", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => {
                      const st = statusColors[order.status] ?? statusColors.pending;
                      return (
                        <div key={order.id} className="rounded-2xl overflow-hidden"
                          style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                          <div className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                                  {order.order_number}
                                </span>
                                <span className="text-[9px] tracking-[0.07em] uppercase px-2 py-0.5 rounded-full font-semibold"
                                  style={{ ...st, fontFamily: "var(--font-body)" }}>{order.status}</span>
                              </div>
                              <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>
                                {order.order_items?.length ?? 0} item{(order.order_items?.length ?? 0) !== 1 ? "s" : ""} · {new Date(order.created_at).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <p className="text-[16px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                              {inr(order.total)}
                            </p>
                          </div>

                          {expandedOrder === order.id && (
                            <div className="px-5 pb-5" style={{ borderTop: "1px solid rgba(26,20,16,0.06)" }}>
                              <div className="pt-4 space-y-2">
                                {order.order_items?.map((item: any) => (
                                  <div key={item.id} className="flex justify-between">
                                    <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.6)" }}>
                                      {item.product_name} × {item.quantity}
                                    </span>
                                    <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                                      {inr(item.total_price)}
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-3 flex justify-between" style={{ borderTop: "1px solid rgba(26,20,16,0.06)" }}>
                                  <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>Total</span>
                                  <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{inr(order.total)}</span>
                                </div>
                                {order.tracking_number && (
                                  <div className="mt-3 px-4 py-3 rounded-xl"
                                    style={{ background: "rgba(199,160,100,0.06)", border: "1px solid rgba(199,160,100,0.15)" }}>
                                    <p className="text-[10px] tracking-[0.1em] uppercase mb-1"
                                      style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>Tracking Number</p>
                                    <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                                      {order.tracking_number}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Wishlist */}
            {section === "wishlist" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
                <h2 className="text-[20px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>My Wishlist</h2>
                {loadingData ? (
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="aspect-square rounded-2xl animate-pulse" style={{ background: "#fff" }} />)}
                  </div>
                ) : !wishlist.length ? (
                  <div className="rounded-2xl p-10 text-center" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                    <p className="text-[14px] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>Your wishlist is empty</p>
                    <Link href="/shop" className="px-6 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold inline-block"
                      style={{ background: "#1A1410", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.filter(Boolean).map((product: any) => {
                      const img = product.images?.find((i: any) => i.is_primary)?.url ?? product.images?.[0]?.url;
                      return (
                        <div key={product.id} className="rounded-2xl overflow-hidden group"
                          style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                          <Link href={`/products/${product.slug}`}>
                            <div className="aspect-square" style={{ background: "#F6EEE4" }}>
                              {img && <img src={img} alt={product.name} className="w-full h-full object-cover" />}
                            </div>
                          </Link>
                          <div className="p-3">
                            <Link href={`/products/${product.slug}`}>
                              <p className="text-[12px] font-medium mb-1" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>{product.name}</p>
                            </Link>
                            <div className="flex justify-between items-center">
                              <span className="text-[13px]" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                                {inr(product.sale_price ?? product.price)}
                              </span>
                              <button onClick={() => removeWishlistItem(product.id)}
                                className="text-[11px] transition-colors"
                                style={{ color: "rgba(239,68,68,0.6)", fontFamily: "var(--font-body)" }}>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile */}
            {section === "profile" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
                <h2 className="text-[20px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>Edit Profile</h2>
                <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase mb-2"
                        style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>Full Name</label>
                      <input type="text" value={profileEdit.full_name}
                        onChange={e => setProfileEdit(p => ({ ...p, full_name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                        style={{ background: "#FBF8F4", border: "1px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase mb-2"
                        style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>Phone</label>
                      <input type="tel" value={profileEdit.phone}
                        onChange={e => setProfileEdit(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                        style={{ background: "#FBF8F4", border: "1px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] tracking-[0.15em] uppercase mb-2"
                        style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>Email Address</label>
                      <input type="email" value={user?.email ?? ""} disabled
                        className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none"
                        style={{ background: "rgba(26,20,16,0.03)", border: "1px solid rgba(26,20,16,0.08)", color: "rgba(26,20,16,0.4)", fontFamily: "var(--font-body)" }} />
                      <p className="text-[10px] mt-1" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.35)" }}>
                        Email cannot be changed here. Contact support if needed.
                      </p>
                    </div>
                  </div>
                  <button onClick={saveProfile} disabled={savingProfile}
                    className="px-8 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold transition-all"
                    style={{ background: savingProfile ? "rgba(199,160,100,0.5)" : "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
                    {savingProfile ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl z-50"
          style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)", fontSize: "13px" }}>
          {toast}
        </motion.div>
      )}
    </div>
  );
}
