"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "⬡" },
      { label: "Analytics", href: "/admin/analytics", icon: "◈" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: "◇" },
      { label: "Categories", href: "/admin/categories", icon: "◻" },
      { label: "Collections", href: "/admin/collections", icon: "▣" },
      { label: "Inventory", href: "/admin/inventory", icon: "◉" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: "◈" },
      { label: "Customers", href: "/admin/customers", icon: "◯" },
      { label: "Coupons", href: "/admin/coupons", icon: "◆" },
      { label: "Reviews", href: "/admin/reviews", icon: "★" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: "✦" },
      { label: "Media", href: "/admin/media", icon: "⬡" },
      { label: "CMS", href: "/admin/cms", icon: "✧" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "◎" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen fixed top-0 left-0 z-40 flex flex-col overflow-hidden"
      style={{ background: "#1C1410", borderRight: "1px solid rgba(199,160,100,0.1)" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-6" style={{ borderBottom: "1px solid rgba(199,160,100,0.08)" }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/admin">
                <span
                  className="text-[11px] tracking-[0.3em] uppercase font-semibold"
                  style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}
                >
                  AUREVIA
                </span>
                <span
                  className="block text-[8px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}
                >
                  Admin Panel
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "rgba(234,217,195,0.5)" }}
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            {collapsed ? (
              <path d="M4 8h8M4 4h8M4 12h8" strokeLinecap="round" />
            ) : (
              <path d="M4 8h8M4 4h8M4 12h8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)", fontWeight: 600 }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 group"
                  style={{
                    background: isActive ? "rgba(199,160,100,0.12)" : "transparent",
                    color: isActive ? "#C7A064" : "rgba(234,217,195,0.55)",
                  }}
                >
                  <span className="text-[13px] flex-shrink-0">{item.icon}</span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[12px] font-medium whitespace-nowrap"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "#C7A064" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom — view site */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(199,160,100,0.08)" }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: "rgba(234,217,195,0.4)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M7 1h6v6M13 1L7 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 3H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8" strokeLinecap="round" />
          </svg>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                View Store
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
