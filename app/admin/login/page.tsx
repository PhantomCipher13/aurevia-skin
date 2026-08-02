"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function AdminLoginPage() {
  const router = useRouter();
  const sb = createClient();

  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setCheck]  = useState(true);

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data } = await sb.from("profiles").select("is_admin").eq("id", session.user.id).single();
        if (data?.is_admin) { window.location.href = "/admin"; return; }
      }
      setCheck(false);
    };
    check();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authErr } = await sb.auth.signInWithPassword({ email, password });

    if (authErr || !data.user) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // Check admin status
    const { data: profile } = await sb
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    if (!profile?.is_admin) {
      await sb.auth.signOut();
      setError("Access denied. This account does not have admin privileges.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  };

  if (checking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: "linear-gradient(135deg, #0D0B09 0%, #1A1410 100%)" }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3", fontSize: "28px", letterSpacing: "0.1em" }}>AUREVIA</h1>
          <p className="mt-1.5 text-[10px] tracking-[0.25em] uppercase" style={{ color: "#C7A064", fontFamily: "var(--font-body)" }}>Admin Portal</p>
        </div>

        <div className="rounded-3xl p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", border: "1px solid rgba(199,160,100,0.12)" }}>

          <h2 className="text-[24px] mb-1" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>Admin Sign In</h2>
          <p className="text-[12px] mb-8" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
            Enter your admin credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase mb-2"
                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
                Admin Email
              </label>
              <input
                type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(199,160,100,0.15)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}
                onFocus={e => e.target.style.borderColor = "#C7A064"}
                onBlur={e => e.target.style.borderColor = "rgba(199,160,100,0.15)"}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase mb-2"
                style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>
                Password
              </label>
              <input
                type="password" autoComplete="current-password" required
                value={password} onChange={e => setPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(199,160,100,0.15)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}
                onFocus={e => e.target.style.borderColor = "#C7A064"}
                onBlur={e => e.target.style.borderColor = "rgba(199,160,100,0.15)"}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 rounded-xl text-[12px]"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "var(--font-body)" }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-[11px] tracking-[0.15em] uppercase font-semibold transition-all mt-2"
              style={{ background: loading ? "rgba(199,160,100,0.4)" : "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
              {loading ? "Signing Inâ€¦" : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(199,160,100,0.08)" }}>
            <Link href="/auth/login" className="text-[11px]"
              style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>
              â† Back to Customer Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
