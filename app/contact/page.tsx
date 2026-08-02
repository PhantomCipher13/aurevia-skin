"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setErrorMsg(data.error || "Something went wrong.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  };

  const inputStyle = {
    background: "#FFFFFF",
    border: "1px solid #EAD9C3",
    color: "#342A24",
    fontFamily: "var(--font-body)",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)", color: "#493E36", fontSize: "10px",
    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px", display: "block",
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-24" style={{ background: "#FBF8F4" }}>
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Info */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-[9px] tracking-[0.4em] uppercase font-semibold mb-5" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Get in Touch</p>
            <h1 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400, lineHeight: 1.1 }}>
              We'd love to<br />hear from you
            </h1>
            <p className="text-[14px] leading-[1.7] mb-10" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.7 }}>
              Whether you have a question about your order, a product recommendation, or just want to talk skincare — our team replies within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { icon: "✉", label: "Email", value: "butanisneh25@gmail.com", sub: "We reply within 24 hours" },
                { icon: "⏱", label: "Support Hours", value: "Mon – Sat, 10am – 7pm IST", sub: "Closed on national holidays" },
                { icon: "📦", label: "Orders & Returns", value: "Track via your account portal", sub: "/account/orders" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: "rgba(199,160,100,0.1)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{item.label}</p>
                    <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{item.value}</p>
                    <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }}>
            <div className="p-8 rounded-3xl" style={{ background: "#F6EEE4", border: "1px solid #EAD9C3" }}>

              <AnimatePresence mode="wait">
                {state === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(22,163,74,0.1)" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#16a34a" strokeWidth="1.5">
                        <path d="M4 14l8 8 12-12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-[22px] mb-2" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>Message Sent!</h3>
                    <p className="text-[13px] mb-6" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>
                      Thank you! We'll get back to you within 24 hours. A confirmation has been sent to your email.
                    </p>
                    <button onClick={() => setState("idle")} className="text-[11px] tracking-[0.1em] uppercase font-medium hover:text-[#342A24] transition-colors" style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
                      Send another message →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Name *</label>
                        <input value={form.name} onChange={set("name")} placeholder="Your name" required className="w-full px-4 py-3.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" required className="w-full px-4 py-3.5 rounded-xl text-[13px] outline-none" style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Subject</label>
                      <select value={form.subject} onChange={set("subject")} className="w-full px-4 py-3.5 rounded-xl text-[13px] outline-none" style={inputStyle}>
                        <option value="">Select a topic...</option>
                        <option>Order / Tracking</option>
                        <option>Product Question</option>
                        <option>Returns & Refunds</option>
                        <option>Skincare Advice</option>
                        <option>Wholesale / B2B</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Message *</label>
                      <textarea value={form.message} onChange={set("message")} rows={5} placeholder="Tell us how we can help..." required className="w-full px-4 py-3.5 rounded-xl text-[13px] outline-none resize-none" style={inputStyle} />
                    </div>

                    {state === "error" && (
                      <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#ef4444" }}>{errorMsg}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={state === "sending"}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 rounded-full text-[11px] tracking-[0.2em] uppercase font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: "#342A24", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
                    >
                      {state === "sending" && (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                      )}
                      {state === "sending" ? "Sending..." : "Send Message →"}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
