"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Sample orders database ─────────────────────────── */
const ORDERS: Record<string, Order> = {
  "AUR-2026-0412": {
    id: "AUR-2026-0412", customer: "Meera Joshi", email: "meera.joshi@gmail.com",
    phone: "+91 98201 34567", date: "26 Jul 2026", total: 1899,
    paymentMethod: "UPI", paymentStatus: "Paid",
    address: { name: "Meera Joshi", line1: "14B Versova Road", line2: "Andheri West", city: "Mumbai", state: "Maharashtra", pin: "400053" },
    items: [{ name: "Radiance Serum", qty: 1, price: 1899, image: "/images/product-radiance-serum.png" }],
    status: "processing",
    timeline: [
      { label: "Order Placed", desc: "Your order has been received", date: "26 Jul 2026, 11:42 AM", done: true },
      { label: "Payment Confirmed", desc: "Payment of ₹1,899 received via UPI", date: "26 Jul 2026, 11:43 AM", done: true },
      { label: "Processing", desc: "Your items are being prepared for dispatch", date: "26 Jul 2026, 2:00 PM", done: true },
      { label: "Dispatched", desc: "Order picked up by courier partner", date: "", done: false },
      { label: "Out for Delivery", desc: "Your order is on its way", date: "", done: false },
      { label: "Delivered", desc: "Order delivered successfully", date: "", done: false },
    ],
  },
  "AUR-2026-0410": {
    id: "AUR-2026-0410", customer: "Pooja Nair", email: "pooja.nair@gmail.com",
    phone: "+91 88776 55443", date: "25 Jul 2026", total: 2499,
    paymentMethod: "Credit Card", paymentStatus: "Paid",
    address: { name: "Pooja Nair", line1: "37 Indiranagar 12th Main", line2: "", city: "Bangalore", state: "Karnataka", pin: "560038" },
    items: [{ name: "Retinol Renewal Serum", qty: 1, price: 2499, image: "/images/product-retinol-serum.png" }],
    status: "shipped",
    tracking: "BLUEDART2026001",
    courier: "Blue Dart",
    timeline: [
      { label: "Order Placed", desc: "Your order has been received", date: "25 Jul 2026, 9:15 AM", done: true },
      { label: "Payment Confirmed", desc: "Payment of ₹2,499 received via Credit Card", date: "25 Jul 2026, 9:16 AM", done: true },
      { label: "Processing", desc: "Your items were prepared for dispatch", date: "25 Jul 2026, 3:00 PM", done: true },
      { label: "Dispatched", desc: "Order picked up by Blue Dart", date: "26 Jul 2026, 10:00 AM", done: true },
      { label: "Out for Delivery", desc: "Your order is on its way", date: "", done: false },
      { label: "Delivered", desc: "Order delivered successfully", date: "", done: false },
    ],
  },
  "AUR-2026-0409": {
    id: "AUR-2026-0409", customer: "Ananya Krishnan", email: "ananya.k@gmail.com",
    phone: "+91 77665 44332", date: "24 Jul 2026", total: 5998,
    paymentMethod: "Net Banking", paymentStatus: "Paid",
    address: { name: "Ananya Krishnan", line1: "45 Anna Nagar East", line2: "", city: "Chennai", state: "Tamil Nadu", pin: "600040" },
    items: [
      { name: "Night Recovery Oil", qty: 1, price: 2299, image: "/images/product-night-oil.png" },
      { name: "Peptide Firming Serum", qty: 1, price: 2799, image: "/images/product-peptide-serum.jpg" },
    ],
    status: "delivered",
    tracking: "DTDC2026009",
    courier: "DTDC",
    timeline: [
      { label: "Order Placed", desc: "Your order has been received", date: "24 Jul 2026, 8:30 AM", done: true },
      { label: "Payment Confirmed", desc: "Payment of ₹5,998 received via Net Banking", date: "24 Jul 2026, 8:31 AM", done: true },
      { label: "Processing", desc: "Your items were prepared for dispatch", date: "24 Jul 2026, 1:00 PM", done: true },
      { label: "Dispatched", desc: "Order picked up by DTDC", date: "25 Jul 2026, 9:00 AM", done: true },
      { label: "Out for Delivery", desc: "Your order was out for delivery", date: "26 Jul 2026, 8:00 AM", done: true },
      { label: "Delivered", desc: "Order delivered to Ananya Krishnan", date: "26 Jul 2026, 12:30 PM", done: true },
    ],
  },
  "AUR-2026-0407": {
    id: "AUR-2026-0407", customer: "Sneha Patel", email: "sneha.p@gmail.com",
    phone: "+91 88990 11223", date: "23 Jul 2026", total: 3898,
    paymentMethod: "UPI", paymentStatus: "Paid",
    address: { name: "Sneha Patel", line1: "101 Banjara Hills Road No 12", line2: "", city: "Hyderabad", state: "Telangana", pin: "500034" },
    items: [
      { name: "Gentle Foam Cleanser", qty: 1, price: 899, image: "/images/product-gentle-cleanser.png" },
      { name: "Dew Barrier Mist", qty: 1, price: 1199, image: "/images/product-barrier-mist.png" },
      { name: "Radiance Serum", qty: 1, price: 1899, image: "/images/product-radiance-serum.png" },
    ],
    status: "delivered",
    tracking: "EKART2026007",
    courier: "Ekart",
    timeline: [
      { label: "Order Placed", desc: "Your order has been received", date: "23 Jul 2026, 10:20 AM", done: true },
      { label: "Payment Confirmed", desc: "Payment of ₹3,898 received via UPI", date: "23 Jul 2026, 10:21 AM", done: true },
      { label: "Processing", desc: "Your items were prepared for dispatch", date: "23 Jul 2026, 4:00 PM", done: true },
      { label: "Dispatched", desc: "Order picked up by Ekart", date: "24 Jul 2026, 11:00 AM", done: true },
      { label: "Out for Delivery", desc: "Your order was out for delivery", date: "25 Jul 2026, 9:00 AM", done: true },
      { label: "Delivered", desc: "Order delivered to Sneha Patel", date: "25 Jul 2026, 3:15 PM", done: true },
    ],
  },
};

/* ─── Types ──────────────────────────────────────────── */
interface OrderItem { name: string; qty: number; price: number; image: string; }
interface TimelineStep { label: string; desc: string; date: string; done: boolean; }
interface Order {
  id: string; customer: string; email: string; phone: string;
  date: string; total: number; paymentMethod: string; paymentStatus: string;
  address: { name: string; line1: string; line2: string; city: string; state: string; pin: string; };
  items: OrderItem[];
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  tracking?: string; courier?: string;
  timeline: TimelineStep[];
}

const statusConfig = {
  processing: { label: "Processing", color: "#ca8a04", bg: "rgba(234,179,8,0.08)", icon: "⚙" },
  confirmed:  { label: "Confirmed",  color: "#7c3aed", bg: "rgba(139,92,246,0.08)", icon: "✓" },
  shipped:    { label: "Shipped",    color: "#2563eb", bg: "rgba(59,130,246,0.08)", icon: "🚚" },
  delivered:  { label: "Delivered",  color: "#16a34a", bg: "rgba(34,197,94,0.08)",  icon: "✅" },
  cancelled:  { label: "Cancelled",  color: "#dc2626", bg: "rgba(239,68,68,0.08)",  icon: "✕" },
};

/* ─── Order Detail View ──────────────────────────────── */
function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const cfg = statusConfig[order.status];
  const currentStep = order.timeline.filter(s => s.done).length - 1;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>

      {/* Back */}
      <button onClick={onBack}
        className="flex items-center gap-2 mb-8 text-[12px] tracking-[0.08em] uppercase font-semibold transition-colors hover:opacity-70"
        style={{ fontFamily: "var(--font-body)", color: "#493E36" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Track Another Order
      </button>

      {/* Status banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl mb-8"
        style={{ background: cfg.bg, border: `1px solid ${cfg.color}22` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cfg.icon}</span>
          <div>
            <p className="text-[13px] font-bold mb-0.5" style={{ fontFamily: "var(--font-body)", color: cfg.color }}>
              Order {cfg.label}
            </p>
            <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>
              {order.id} · Placed on {order.date}
            </p>
          </div>
        </div>
        {order.tracking && (
          <div className="text-right">
            <p className="text-[10px] tracking-[0.1em] uppercase mb-1" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
              Tracking No.
            </p>
            <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: cfg.color }}>
              {order.tracking}
            </p>
            <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
              via {order.courier}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left col: timeline + items */}
        <div className="lg:col-span-2 space-y-8">

          {/* Timeline */}
          <div className="p-6 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.12)", boxShadow: "0 2px 16px rgba(52,42,36,0.04)" }}>
            <h3 className="text-[15px] font-medium mb-6" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
              Order Journey
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-5 bottom-5 w-[2px]"
                style={{ background: "linear-gradient(to bottom, #C7A064, rgba(199,160,100,0.1))" }} />

              {order.timeline.map((step, i) => (
                <motion.div key={step.label}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease }}
                  className="flex gap-4 mb-6 last:mb-0 relative">

                  {/* Circle */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center z-10"
                    style={{
                      background: step.done ? "#C7A064" : "#F6EEE4",
                      border: step.done ? "none" : "2px solid #EAD9C3",
                      boxShadow: step.done ? "0 0 0 3px rgba(199,160,100,0.18)" : "none",
                    }}>
                    {step.done ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2">
                        <path d="M2.5 7l3.5 3.5 5.5-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full" style={{ background: "#EAD9C3" }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold"
                        style={{ fontFamily: "var(--font-body)", color: step.done ? "#342A24" : "rgba(73,62,54,0.3)" }}>
                        {step.label}
                        {i === currentStep && step.done && (
                          <span className="ml-2 text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full align-middle"
                            style={{ background: "rgba(199,160,100,0.12)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                            Current
                          </span>
                        )}
                      </p>
                      {step.date && (
                        <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.35 }}>
                          {step.date}
                        </p>
                      )}
                    </div>
                    <p className="text-[12px] mt-0.5" style={{ fontFamily: "var(--font-body)", color: step.done ? "#493E36" : "rgba(73,62,54,0.3)", opacity: step.done ? 0.6 : 1 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(199,160,100,0.12)", boxShadow: "0 2px 16px rgba(52,42,36,0.04)" }}>
            <div className="px-6 py-5 flex justify-between items-center" style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(199,160,100,0.08)" }}>
              <h3 className="text-[15px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
                Order Items
              </h3>
              <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
            </div>
            {order.items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-4 px-6 py-4"
                style={{ background: "#FFFFFF", borderBottom: i < order.items.length - 1 ? "1px solid rgba(199,160,100,0.06)" : "none" }}>
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "#F6EEE4", border: "1.5px solid #EAD9C3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium mb-0.5" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{item.name}</p>
                  <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>Qty: {item.qty}</p>
                </div>
                <p className="text-[14px] font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </motion.div>
            ))}
            {/* Order total */}
            <div className="px-6 py-4 flex justify-between items-center" style={{ background: "#F6EEE4", borderTop: "1px solid rgba(199,160,100,0.1)" }}>
              <div>
                <p className="text-[11px] mb-0.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Subtotal</p>
                <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Shipping</p>
                <p className="text-[13px] font-bold mt-1" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>Total</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] mb-0.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>
                  ₹{order.items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString("en-IN")}
                </p>
                <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#16a34a" }}>Free</p>
                <p className="text-[15px] font-bold mt-1" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right col: customer + address + payment */}
        <div className="space-y-5">

          {/* Customer */}
          <div className="p-5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.12)", boxShadow: "0 2px 16px rgba(52,42,36,0.04)" }}>
            <p className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>Customer</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-medium flex-shrink-0"
                style={{ background: "rgba(199,160,100,0.12)", color: "#C7A064", fontFamily: "var(--font-heading)" }}>
                {order.customer.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{order.customer}</p>
                <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.45 }}>{order.email}</p>
              </div>
            </div>
            <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{order.phone}</p>
          </div>

          {/* Delivery address */}
          <div className="p-5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.12)", boxShadow: "0 2px 16px rgba(52,42,36,0.04)" }}>
            <p className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>Delivery Address</p>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(199,160,100,0.1)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#C7A064" strokeWidth="1.3">
                  <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" />
                  <circle cx="7" cy="5" r="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium mb-0.5" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{order.address.name}</p>
                <p className="text-[12px] leading-[1.65]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.55 }}>
                  {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
                  {order.address.city}, {order.address.state} — {order.address.pin}
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="p-5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.12)", boxShadow: "0 2px 16px rgba(52,42,36,0.04)" }}>
            <p className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>Payment</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.55 }}>Method</p>
              <p className="text-[12px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{order.paymentMethod}</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.55 }}>Status</p>
              <span className="text-[10px] tracking-[0.08em] uppercase font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", fontFamily: "var(--font-body)" }}>
                ✓ {order.paymentStatus}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3" style={{ borderTop: "1px solid rgba(199,160,100,0.1)" }}>
              <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>Amount Paid</p>
              <p className="text-[16px] font-medium" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>
                ₹{order.total.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Help */}
          <div className="p-5 rounded-2xl text-center" style={{ background: "#F6EEE4", border: "1px solid #EAD9C3" }}>
            <p className="text-[12px] mb-3" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.65 }}>
              Need help with your order?
            </p>
            <a href="mailto:support@aureviaskin.com"
              className="inline-block text-[10px] tracking-[0.12em] uppercase font-semibold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{ background: "#342A24", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail]   = useState("");
  const [order, setOrder]   = useState<Order | null>(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!orderId.trim()) { setError("Please enter your order ID."); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulated loading

    const found = ORDERS[orderId.trim().toUpperCase()];
    if (found) {
      // If email provided, validate it (case-insensitive)
      if (email && found.email.toLowerCase() !== email.trim().toLowerCase()) {
        setError("The email address doesn't match our records for this order.");
        setLoading(false); return;
      }
      setOrder(found);
    } else {
      setError("Order not found. Please check your Order ID and try again. (Try: AUR-2026-0412)");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FBF8F4" }}>
      <Navigation />

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          <AnimatePresence mode="wait">
            {!order ? (
              /* ── SEARCH FORM ── */
              <motion.div key="search"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease }}>

                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(199,160,100,0.1)", border: "1px solid rgba(199,160,100,0.2)" }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#C7A064" strokeWidth="1.5">
                      <path d="M4 6h20M4 11h14M4 16h10" strokeLinecap="round" />
                      <circle cx="20" cy="20" r="5" />
                      <path d="M24 24l-2.5-2.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                  <p className="text-[9px] tracking-[0.4em] uppercase font-semibold mb-3"
                    style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Order Management</p>
                  <h1 className="text-[2.6rem] mb-3" style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400 }}>
                    Track Your Order
                  </h1>
                  <p className="text-[14px] max-w-sm mx-auto" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.55 }}>
                    Enter your order ID to see the full status and delivery details.
                  </p>
                </div>

                {/* Form card */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease }}
                  className="max-w-xl mx-auto p-8 rounded-3xl"
                  style={{ background: "#FFFFFF", boxShadow: "0 4px 40px rgba(52,42,36,0.07)", border: "1px solid rgba(199,160,100,0.1)" }}>

                  <div className="mb-5">
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold mb-2.5"
                      style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>
                      Order ID *
                    </label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={e => { setOrderId(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. AUR-2026-0412"
                      className="w-full px-4 py-3.5 rounded-xl text-[14px] outline-none transition-all"
                      style={{
                        background: "#FBF8F4",
                        border: `1.5px solid ${error ? "#ef4444" : "#EAD9C3"}`,
                        color: "#342A24",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold mb-2.5"
                      style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>
                      Email Address <span style={{ opacity: 0.5 }}>(optional — for verification)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-4 py-3.5 rounded-xl text-[14px] outline-none transition-all"
                      style={{ background: "#FBF8F4", border: "1.5px solid #EAD9C3", color: "#342A24", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="text-[12px] mb-5 px-4 py-3 rounded-xl"
                        style={{ fontFamily: "var(--font-body)", color: "#dc2626", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        ⚠ {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleSearch} disabled={loading}
                    className="w-full py-4 rounded-xl text-[11px] tracking-[0.15em] uppercase font-semibold transition-all flex items-center justify-center gap-3"
                    style={{
                      background: loading ? "rgba(199,160,100,0.5)" : "#342A24",
                      color: "#FFFFFF", fontFamily: "var(--font-body)",
                      boxShadow: loading ? "none" : "0 4px 20px rgba(52,42,36,0.2)",
                    }}>
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                          <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Searching...
                      </>
                    ) : "Track My Order →"}
                  </motion.button>

                  <p className="text-center text-[11px] mt-5"
                    style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.35 }}>
                    Your Order ID is in your confirmation email · e.g. AUR-2026-XXXX
                  </p>
                </motion.div>

                {/* Info cards */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mt-8">
                  {[
                    { icon: "📦", title: "Easy Tracking", desc: "Real-time order status updates" },
                    { icon: "🚚", title: "Fast Delivery", desc: "Free shipping on all orders above ₹999" },
                    { icon: "✉️", title: "Stay Updated", desc: "Email & SMS notifications at every step" },
                  ].map((card) => (
                    <div key={card.title} className="p-4 rounded-2xl text-center"
                      style={{ background: "#F6EEE4", border: "1px solid rgba(199,160,100,0.12)" }}>
                      <p className="text-2xl mb-2">{card.icon}</p>
                      <p className="text-[12px] font-semibold mb-1" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{card.title}</p>
                      <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{card.desc}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              /* ── ORDER DETAIL ── */
              <motion.div key="detail">
                <OrderDetail order={order} onBack={() => { setOrder(null); setOrderId(""); setEmail(""); }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
