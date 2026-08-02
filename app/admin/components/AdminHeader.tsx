"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const handleLogout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    window.location.replace("/admin/login");
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-8 py-4"
      style={{
        background: "rgba(20,14,10,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(199,160,100,0.08)",
      }}
    >
      <div>
        <h1
          className="text-[18px] font-medium"
          style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-[11px] mt-0.5"
            style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="px-5 py-2.5 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)]"
              style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="px-5 py-2.5 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)]"
              style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
            >
              {action.label}
            </button>
          )
        )}

        {/* View Store */}
        <Link
          href="/"
          target="_blank"
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "rgba(234,217,195,0.4)" }}
          title="View Store"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M7 1h8v8M15 1L7 9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 4H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" strokeLinecap="round" />
          </svg>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-400"
          style={{ color: "rgba(234,217,195,0.35)" }}
          aria-label="Sign out"
          title="Sign out"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
