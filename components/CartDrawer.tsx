"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const inr  = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, removeItem, updateQty, isLoading } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(52,42,36,0.45)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            className="fixed right-0 top-0 bottom-0 z-[91] flex flex-col w-full max-w-[420px]"
            style={{ background: "#FEFCF9", boxShadow: "-8px 0 40px rgba(52,42,36,0.12)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: "1px solid #EAD9C3" }}
            >
              <div className="flex items-center gap-3">
                <h2
                  className="text-[16px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}
                >
                  Your Bag
                </h2>
                {itemCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold"
                    style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-black/5"
                style={{ color: "#342A24" }}
                aria-label="Close cart"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Free shipping progress */}
            {subtotal < 999 && items.length > 0 && (
              <div className="px-6 py-3 flex-shrink-0" style={{ background: "#FBF8F4", borderBottom: "1px solid #EAD9C3" }}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.55)" }}>
                    Add <strong style={{ color: "#C7A064" }}>{inr(999 - subtotal)}</strong> more for free shipping
                  </span>
                  <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.4)" }}>
                    {Math.round((subtotal / 999) * 100)}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "#EAD9C3" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #C7A064, #EAD9C3)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                    transition={{ duration: 0.6, ease }}
                  />
                </div>
              </div>
            )}

            {subtotal >= 999 && items.length > 0 && (
              <div
                className="px-6 py-2.5 flex items-center gap-2 flex-shrink-0 text-[11px]"
                style={{ background: "rgba(199,160,100,0.08)", borderBottom: "1px solid rgba(199,160,100,0.2)", fontFamily: "var(--font-body)", color: "#C7A064" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                🎉 You've unlocked free shipping!
              </div>
            )}

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: "#C7A064", borderRightColor: "rgba(199,160,100,0.3)" }}
                  />
                </div>
              ) : items.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "#F6EEE4" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C7A064" strokeWidth="1.2">
                      <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 6h18" strokeLinecap="round"/>
                      <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-[16px] mb-2" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
                    Your bag is empty
                  </p>
                  <p className="text-[12px] mb-6" style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.45)" }}>
                    Discover our skincare rituals
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="px-8 py-3 rounded-full text-[11px] tracking-[0.15em] uppercase font-semibold transition-all"
                    style={{ background: "#342A24", color: "#fff", fontFamily: "var(--font-body)" }}
                  >
                    Shop Now
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="flex gap-4"
                      >
                        {/* Image */}
                        <Link href={`/products/${item.slug}`} onClick={onClose} className="flex-shrink-0">
                          <div
                            className="w-20 h-24 rounded-xl overflow-hidden"
                            style={{ background: "#F6EEE4" }}
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={80}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-[9px] tracking-widest"
                                style={{ color: "rgba(52,42,36,0.2)", fontFamily: "var(--font-heading)" }}
                              >
                                AUREVIA
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <Link href={`/products/${item.slug}`} onClick={onClose}>
                              <p
                                className="text-[13px] font-medium leading-tight mb-1 hover:text-[#C7A064] transition-colors"
                                style={{ fontFamily: "var(--font-body)", color: "#342A24" }}
                              >
                                {item.name}
                              </p>
                            </Link>
                            <p
                              className="text-[14px] font-semibold"
                              style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}
                            >
                              {inr(item.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.4)" }}>
                                {inr(item.price)} each
                              </p>
                            )}
                          </div>

                          {/* Qty + Remove row */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity stepper */}
                            <div
                              className="flex items-center rounded-full overflow-hidden"
                              style={{ border: "1px solid #EAD9C3" }}
                            >
                              <button
                                onClick={() => updateQty(item.productId, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#F6EEE4]"
                                style={{ color: "#342A24" }}
                                aria-label="Decrease quantity"
                              >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M2 6h8" strokeLinecap="round"/>
                                </svg>
                              </button>
                              <span
                                className="w-8 text-center text-[12px] font-medium select-none"
                                style={{ fontFamily: "var(--font-body)", color: "#342A24" }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.productId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#F6EEE4]"
                                style={{ color: "#342A24" }}
                                aria-label="Increase quantity"
                                disabled={item.stock !== undefined && item.quantity >= item.stock}
                              >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M6 2v8M2 6h8" strokeLinecap="round"/>
                                </svg>
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="flex items-center gap-1.5 text-[11px] transition-colors hover:text-red-500 group"
                              style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.4)" }}
                              aria-label={`Remove ${item.name}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer — totals + checkout */}
            {items.length > 0 && (
              <div
                className="flex-shrink-0 px-6 py-5"
                style={{ borderTop: "1px solid #EAD9C3", background: "#FEFCF9" }}
              >
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.55)" }}>
                    Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </span>
                  <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
                    {inr(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.55)" }}>
                    Shipping
                  </span>
                  <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: subtotal >= 999 ? "#16a34a" : "#342A24" }}>
                    {subtotal >= 999 ? "FREE" : inr(99)}
                  </span>
                </div>

                <div className="h-px mb-4" style={{ background: "#EAD9C3" }} />

                {/* Total */}
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>
                    Total
                  </span>
                  <span className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
                    {inr(subtotal + (subtotal >= 999 ? 0 : 99))}
                  </span>
                </div>

                {/* Checkout button */}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center py-4 rounded-full text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                  style={{ background: "#342A24", color: "#fff", fontFamily: "var(--font-body)" }}
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  onClick={onClose}
                  className="block w-full text-center mt-3 text-[11px] tracking-[0.12em] uppercase transition-colors hover:text-[#C7A064]"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(52,42,36,0.4)" }}
                >
                  ← Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
