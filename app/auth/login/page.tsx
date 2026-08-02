"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function LoginForm() {
  const router       = useRouter();
  const params       = useSearchParams();
  const redirect     = params.get("redirect") ?? "/account";
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowP]  = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(isAdmin ? "/admin" : redirect);
    }
  }, [authLoading, isAuthenticated, isAdmin, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { success, error: err } = await login(email, password);

    if (!success) {
      setError(err ?? "Invalid email or password");
      setLoading(false);
      return;
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: "linear-gradient(135deg, #FBF8F4 0%, #F0E8DC 100%)" }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 style={{ fontFamily: "var(--font-heading)", color: "#1A1410", fontSize: "28px", letterSpacing: "0.1em" }}>
              AUREVIA
            </h1>
          </Link>
          <p className="mt-2 text-[11px] tracking-[0.2em] uppercase" style={{ color: "#C7A064", fontFamily: "var(--font-body)" }}>
            Skin
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 md:p-10" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(26,20,16,0.08)", border: "1px solid rgba(199,160,100,0.15)" }}>
          <h2 className="text-[26px] mb-1" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>
            Welcome back
          </h2>
          <p className="text-[13px] mb-8" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
            Sign in to your AUREVIA account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
                Email Address
              </label>
              <input
                type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all"
                style={{ background: "#FBF8F4", border: "1.5px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }}
                onFocus={e => e.target.style.borderColor = "#C7A064"}
                onBlur={e => e.target.style.borderColor = "rgba(199,160,100,0.2)"}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[11px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px]" style={{ color: "#C7A064", fontFamily: "var(--font-body)" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} autoComplete="current-password" required
                  value={password} onChange={e => setPass(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-[14px] outline-none transition-all"
                  style={{ background: "#FBF8F4", border: "1.5px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }}
                  onFocus={e => e.target.style.borderColor = "#C7A064"}
                  onBlur={e => e.target.style.borderColor = "rgba(199,160,100,0.2)"}
                />
                <button type="button" onClick={() => setShowP(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(26,20,16,0.35)" }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 rounded-xl text-[12px]"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#dc2626", fontFamily: "var(--font-body)" }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-[12px] tracking-[0.12em] uppercase font-semibold transition-all mt-2"
              style={{ background: loading ? "rgba(199,160,100,0.5)" : "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
              {loading ? "Signing Inâ€¦" : "Sign In"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center mt-6 text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>
            New to AUREVIA?{" "}
            <Link href="/auth/register" className="font-medium" style={{ color: "#C7A064" }}>
              Create an account
            </Link>
          </p>

          {/* Admin separator */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(199,160,100,0.1)" }}>
            <p className="text-center text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.3)" }}>
              Admin access?{" "}
              <Link href="/admin/login" className="underline" style={{ color: "rgba(199,160,100,0.7)" }}>
                Go to Admin Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF8F4" }}>
        <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "#C7A064", borderRightColor: "rgba(199,160,100,0.3)" }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
