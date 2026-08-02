"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function RegisterPage() {
  const router   = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

  const [fullName, setName]   = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/account");
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    const { success: ok, error: err } = await register(email, password, fullName);
    setLoading(false);

    if (!ok) { setError(err ?? "Registration failed. Please try again."); return; }
    setSuccess(true);
    // Give Supabase a moment, then redirect
    setTimeout(() => router.push("/account"), 2000);
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
          <Link href="/">
            <h1 style={{ fontFamily: "var(--font-heading)", color: "#1A1410", fontSize: "28px", letterSpacing: "0.1em" }}>AUREVIA</h1>
          </Link>
          <p className="mt-2 text-[11px] tracking-[0.2em] uppercase" style={{ color: "#C7A064", fontFamily: "var(--font-body)" }}>Skin</p>
        </div>

        <div className="rounded-3xl p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(26,20,16,0.08)", border: "1px solid rgba(199,160,100,0.15)" }}>

          <h2 className="text-[26px] mb-1" style={{ fontFamily: "var(--font-heading)", color: "#1A1410" }}>Create Account</h2>
          <p className="text-[13px] mb-8" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
            Join AUREVIA and unlock your skin journey
          </p>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="px-4 py-3 rounded-xl text-[13px] mb-6 text-center"
                style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a", fontFamily: "var(--font-body)" }}>
                ✓ Account created! Redirecting to your account…
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", type: "text", value: fullName, set: setName, auto: "name" },
              { label: "Email Address", type: "email", value: email, set: setEmail, auto: "email" },
              { label: "Password", type: "password", value: password, set: setPass, auto: "new-password" },
              { label: "Confirm Password", type: "password", value: confirm, set: setConfirm, auto: "new-password" },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-[11px] tracking-[0.1em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.5)" }}>
                  {field.label}
                </label>
                <input
                  type={field.type} autoComplete={field.auto} required
                  value={field.value} onChange={e => field.set(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-all"
                  style={{ background: "#FBF8F4", border: "1.5px solid rgba(199,160,100,0.2)", color: "#1A1410", fontFamily: "var(--font-body)" }}
                  onFocus={e => e.target.style.borderColor = "#C7A064"}
                  onBlur={e => e.target.style.borderColor = "rgba(199,160,100,0.2)"}
                />
              </div>
            ))}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 rounded-xl text-[12px]"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#dc2626", fontFamily: "var(--font-body)" }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-[12px] tracking-[0.12em] uppercase font-semibold transition-all mt-2"
              style={{ background: loading ? "rgba(199,160,100,0.5)" : "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(26,20,16,0.45)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium" style={{ color: "#C7A064" }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
