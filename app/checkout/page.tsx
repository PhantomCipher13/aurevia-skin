"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const inr  = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

interface Address {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Jammu & Kashmir","Ladakh","Puducherry"];

export default function CheckoutPage() {
  const router   = useRouter();
  const sb = createClient();
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  const [step, setStep]         = useState<"address" | "payment" | "confirmed">("address");
  const [address, setAddress]   = useState<Address>({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    street: "", city: "", state: "Maharashtra", zip: "",
  });
  const [couponCode, setCoupon]     = useState("");
  const [couponData, setCouponData] = useState<{ type: string; value: number; code: string } | null>(null);
  const [couponError, setCouponErr] = useState("");
  const [payMethod, setPayMethod]   = useState<"cod" | "online">("cod");
  const [placing, setPlacing]       = useState(false);
  const [orderNumber, setOrderNum]  = useState("");
  const [orderId, setOrderId]       = useState("");

  const SHIPPING = subtotal >= 999 ? 0 : 99;
  const discount = couponData
    ? couponData.type === "percentage"
      ? (subtotal * couponData.value) / 100
      : couponData.value
    : 0;
  const total = subtotal + SHIPPING - discount;

  const validateCoupon = async () => {
    setCouponErr("");
    if (!couponCode.trim()) return;
    const { data } = await sb.from("coupons")
      .select("code, type, value, min_order_amount, max_uses, used_count, is_active, expires_at")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (!data) { setCouponErr("Invalid or expired coupon code"); return; }
    if (data.min_order_amount && subtotal < data.min_order_amount) {
      setCouponErr(`Minimum order of ${inr(data.min_order_amount)} required`); return;
    }
    if (data.max_uses && data.used_count >= data.max_uses) {
      setCouponErr("This coupon has reached its usage limit"); return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponErr("This coupon has expired"); return;
    }
    setCouponData({ type: data.type, value: data.value, code: data.code });
  };

  const placeOrder = async () => {
    if (!items.length) return;
    setPlacing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            productId:    i.productId,
            productName:  i.name,
            productImage: i.image,
            productSlug:  i.slug,
            quantity:     i.quantity,
            unitPrice:    i.price,
          })),
          shippingAddress: address,
          couponCode: couponData?.code,
          discountAmount: discount,
          shippingAmount: SHIPPING,
          paymentMethod: payMethod,
          customerName:  address.full_name,
          customerEmail: user?.email ?? "guest@aureviaskin.com",
          customerPhone: address.phone,
          userId: user?.id ?? null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setOrderNum(json.orderNumber);
      setOrderId(json.orderId);
      await clearCart();
      setStep("confirmed");
    } catch (err: any) {
      console.error(err);
      alert("Order failed: " + err.message);
    }
    setPlacing(false);
  };

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF8F4" }}>
        <div className="text-center">
          <p className="text-[16px] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>Your cart is empty</p>
          <Link href="/shop" className="px-8 py-3 rounded-xl text-[12px] tracking-[0.1em] uppercase font-semibold"
            style={{ background: "#1A1410", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(199,160,100,0.2)",
    background: "#FDFAF7",
    color: "#1A1410",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    outline: "none",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "rgba(26,20,16,0.4)",
    fontFamily: "var(--font-body)",
    marginBottom: "6px",
  };

  /* ── ORDER CONFIRMED ── */
  if (step === "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FBF8F4" }}>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="max-w-lg w-full text-center rounded-3xl p-10"
          style={{ background: "#fff", boxShadow: "0 24px 80px rgba(26,20,16,0.08)" }}>
          {/* Check icon */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(199,160,100,0.1)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C7A064" strokeWidth="1.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          <h2 className="text-[28px] mb-3" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
            Order Confirmed!
          </h2>
          <p className="text-[14px] mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.6)" }}>
            Thank you, {address.full_name.split(" ")[0]}! Your order has been placed.
          </p>

          {/* Order number */}
          <div className="my-6 px-6 py-4 rounded-2xl" style={{ background: "#FBF8F4" }}>
            <p className="text-[10px] tracking-[0.15em] uppercase mb-1"
              style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>Order Number</p>
            <p className="text-[24px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
              {orderNumber}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 text-left mb-8 px-4 py-4 rounded-2xl" style={{ background: "#FBF8F4" }}>
            <div className="flex justify-between">
              <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>Shipping to</span>
              <span className="text-[12px] text-right" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                {address.street}, {address.city}, {address.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>Payment</span>
              <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>
                {payMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>Total Paid</span>
              <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{inr(total)}</span>
            </div>
          </div>

          <p className="text-[12px] mb-6" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>
            A confirmation will be sent to <strong>{user?.email}</strong>. You can track your order in your account.
          </p>

          <div className="flex gap-3">
            <Link href="/account/orders" className="flex-1 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold text-center"
              style={{ background: "#1A1410", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
              Track Order
            </Link>
            <Link href="/shop" className="flex-1 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold text-center"
              style={{ border: "1px solid rgba(26,20,16,0.15)", color: "#1A1410", fontFamily: "var(--font-body)" }}>
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FBF8F4", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[32px] mb-10" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Address */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
              <h2 className="text-[18px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" required value={address.full_name}
                    onChange={e => setAddress(p => ({ ...p, full_name: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" value={address.phone}
                    onChange={e => setAddress(p => ({ ...p, phone: e.target.value }))}
                    style={inputStyle} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Street Address *</label>
                  <input type="text" required value={address.street}
                    onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                    style={inputStyle} placeholder="House no, street name, landmark" />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input type="text" required value={address.city}
                    onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                    style={inputStyle} placeholder="Mumbai" />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <select value={address.state}
                    onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                    style={inputStyle}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Pincode *</label>
                  <input type="text" required value={address.zip}
                    onChange={e => setAddress(p => ({ ...p, zip: e.target.value }))}
                    style={inputStyle} placeholder="400001" maxLength={6} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
              <h2 className="text-[18px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
                  { id: "online", label: "Online Payment", desc: "UPI, Cards, Net Banking (Razorpay)", icon: "💳" },
                ].map(opt => (
                  <label key={opt.id}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${payMethod === opt.id ? "#C7A064" : "rgba(199,160,100,0.15)"}`,
                      background: payMethod === opt.id ? "rgba(199,160,100,0.04)" : "transparent",
                    }}>
                    <input type="radio" name="payment" value={opt.id}
                      checked={payMethod === opt.id}
                      onChange={() => setPayMethod(opt.id as "cod" | "online")}
                      style={{ accentColor: "#C7A064" }} />
                    <span className="text-[18px]">{opt.icon}</span>
                    <div>
                      <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>{opt.label}</p>
                      <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {payMethod === "online" && (
                <div className="mt-4 px-4 py-3 rounded-xl text-[12px]"
                  style={{ background: "rgba(199,160,100,0.06)", border: "1px solid rgba(199,160,100,0.15)", color: "rgba(26,20,16,0.6)", fontFamily: "var(--font-body)" }}>
                  Razorpay integration coming soon. You'll be redirected to a secure payment gateway.
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6 sticky top-28" style={{ background: "#fff", boxShadow: "0 2px 20px rgba(26,20,16,0.05)" }}>
              <h2 className="text-[18px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5 pb-5" style={{ borderBottom: "1px solid rgba(26,20,16,0.08)" }}>
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#F6EEE4" }}>
                      {item.image && <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ fontFamily: "var(--font-body)", color: "#1A1410" }}>{item.name}</p>
                      <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.4)" }}>×{item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-medium flex-shrink-0" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
                      {inr(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-5 pb-5" style={{ borderBottom: "1px solid rgba(26,20,16,0.08)" }}>
                <div className="flex gap-2">
                  <input type="text" placeholder="Coupon code" value={couponCode}
                    onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponData(null); setCouponErr(""); }}
                    className="flex-1 px-3 py-2.5 rounded-xl text-[12px] outline-none"
                    style={{ background: "#FBF8F4", border: "1px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }} />
                  <button onClick={validateCoupon}
                    className="px-4 py-2.5 rounded-xl text-[11px] tracking-[0.07em] uppercase font-semibold"
                    style={{ background: "rgba(199,160,100,0.12)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] mt-1.5" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>{couponError}</p>}
                {couponData && (
                  <p className="text-[11px] mt-1.5" style={{ color: "#16a34a", fontFamily: "var(--font-body)" }}>
                    ✓ {couponData.code} applied — you save {couponData.type === "percentage" ? `${couponData.value}%` : inr(couponData.value)}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 mb-6">
                {[
                  { label: "Subtotal", value: inr(subtotal) },
                  ...(discount > 0 ? [{ label: `Discount (${couponData?.code})`, value: `-${inr(discount)}`, green: true }] : []),
                  { label: SHIPPING === 0 ? "Shipping — FREE" : "Shipping", value: SHIPPING === 0 ? "Free" : inr(SHIPPING) },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>{r.label}</span>
                    <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: (r as any).green ? "#16a34a" : "#1A1410" }}>{r.value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3" style={{ borderTop: "1px solid rgba(26,20,16,0.08)" }}>
                  <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>Total</span>
                  <span className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>{inr(total)}</span>
                </div>
              </div>

              {/* Place Order */}
              <button onClick={placeOrder} disabled={placing || !address.full_name || !address.street || !address.city || !address.zip}
                className="w-full py-4 rounded-xl text-[12px] tracking-[0.12em] uppercase font-semibold transition-all"
                style={{
                  background: placing ? "rgba(199,160,100,0.5)" : "#C7A064",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                }}>
                {placing ? "Placing Order…" : `Place Order · ${inr(total)}`}
              </button>

              <p className="text-center mt-4 text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.35)" }}>
                By placing your order, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
