"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import CartDrawer from "@/components/CartDrawer";

const navLinks = [
  { label: "Products", href: "/#bestsellers" },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Science", href: "/#science" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "Journal", href: "/#journal" },
  { label: "Shop", href: "/#shop" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  return (
    <>
      {/* Announcement bar */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: isScrolled ? -40 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[51] text-center py-2.5 hidden lg:block"
        style={{ background: "#342A24" }}
      >
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "#EAD9C3",
            fontWeight: 400,
          }}
        >
          Free Shipping on Orders Above ₹999 &nbsp;·&nbsp; 100% Clean Beauty
          &nbsp;·&nbsp; Dermatologist Tested
        </p>
      </motion.div>

      {/* Main navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{
          top: isScrolled ? 0 : "32px",
        }}
      >
        <nav
          className={`transition-all duration-500 ${
            isScrolled
              ? "glass shadow-[0_1px_20px_rgba(52,42,36,0.06)]"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
            <div className="flex items-center justify-between h-[72px]">
              {/* Logo */}
              <Link href="/" className="flex flex-col items-start group">
                <span
                  className="text-[18px] tracking-[0.35em] font-medium transition-colors duration-300 group-hover:text-[#C7A064]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                  }}
                >
                  AUREVIA
                </span>
                <span
                  className="text-[8px] tracking-[0.5em] uppercase -mt-0.5"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#C7A064",
                    fontWeight: 500,
                  }}
                >
                  SKIN
                </span>
              </Link>

              {/* Desktop nav links */}
              <div className="hidden lg:flex items-center gap-9">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 hover:text-[#C7A064] group"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#493E36",
                    }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                      style={{ background: "#C7A064" }}
                    />
                  </Link>
                ))}
              </div>

              {/* Right actions */}
              <div className="hidden lg:flex items-center gap-5">
                <button
                  aria-label="Search"
                  className="p-2 transition-colors duration-300 hover:text-[#C7A064]"
                  style={{ color: "#493E36" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </button>

                <Link
                  href={isAuthenticated ? "/account" : "/auth/login"}
                  aria-label="Account"
                  className="p-2 transition-colors duration-300 hover:text-[#C7A064] relative"
                  style={{ color: "#493E36" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {isAuthenticated && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                      style={{ background: "#C7A064" }}
                    />
                  )}
                </Link>

                {/* Cart button — opens drawer */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Shopping bag"
                  className="p-2 relative transition-colors duration-300 hover:text-[#C7A064]"
                  style={{ color: "#493E36" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 1.4 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full text-[8px] font-semibold flex items-center justify-center"
                      style={{ background: "#C7A064", color: "#FFFFFF" }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </button>

                <div className="w-[1px] h-5 mx-1" style={{ background: "#EAD9C3" }} />

                <Link
                  href="/#shop"
                  className="magnetic-btn text-[10px] tracking-[0.18em] uppercase font-semibold px-7 py-3 rounded-full transition-all duration-500 hover:shadow-[0_4px_20px_rgba(52,42,36,0.15)]"
                  style={{
                    background: "#342A24",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Shop Now
                </Link>
              </div>

              {/* Mobile: cart + menu toggle */}
              <div className="flex lg:hidden items-center gap-2">
                {/* Mobile cart button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Shopping bag"
                  className="p-2 relative"
                  style={{ color: "#342A24" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {itemCount > 0 && (
                    <span
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full text-[8px] font-semibold flex items-center justify-center"
                      style={{ background: "#C7A064", color: "#FFFFFF" }}
                    >
                      {itemCount}
                    </span>
                  )}
                </button>

                {/* Hamburger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex flex-col gap-[5px] p-2"
                  aria-label="Toggle menu"
                >
                  <motion.span
                    animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="block w-5 h-[1.5px]"
                    style={{ background: "#342A24" }}
                  />
                  <motion.span
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block w-5 h-[1.5px]"
                    style={{ background: "#342A24" }}
                  />
                  <motion.span
                    animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="block w-5 h-[1.5px]"
                    style={{ background: "#342A24" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(52,42,36,0.3)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 w-[300px] z-40 flex flex-col p-10 pt-28"
              style={{ background: "#FBF8F4" }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="block text-[15px] tracking-[0.15em] uppercase font-medium py-3 transition-colors duration-300 hover:text-[#C7A064]"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#342A24",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-auto">
                <Link
                  href="/#shop"
                  className="block text-center text-[10px] tracking-[0.18em] uppercase font-semibold px-6 py-4 rounded-full"
                  style={{
                    background: "#342A24",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop Now
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
