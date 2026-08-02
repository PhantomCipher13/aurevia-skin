"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const smoothEase = [0.16, 1, 0.3, 1] as const;

/* ─── Spinner ─── */
function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="10"
      />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast("Please enter your email address", "info");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    setIsLoading(false);
    setIsSent(true);
    showToast(
      "Password reset link sent to your email",
      "success",
      "Check your inbox"
    );
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    color: "#342A24",
    fontSize: "14px",
    fontWeight: 300,
    background: "transparent",
    borderBottom: "1px solid #DCC6A7",
    outline: "none",
    width: "100%",
    padding: "14px 0",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    color: "#493E36",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  };

  return (
    <>
      <CustomCursor />
      <Navigation />

      <main
        className="min-h-screen flex flex-col"
        style={{ background: "#FBF8F4" }}
      >
        <div className="flex-1 flex items-center justify-center px-6 pt-36 pb-20 lg:pt-44 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="w-full max-w-[420px] text-center"
          >
            {/* Diamond ornament */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 45 }}
              transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
              className="flex justify-center mb-8"
            >
              <div
                className="w-3 h-3 rounded-[2px]"
                style={{
                  background:
                    "linear-gradient(135deg, #C7A064 0%, #DCC6A7 100%)",
                }}
              />
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
              className="text-3xl lg:text-4xl mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#342A24",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Reset Password
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: smoothEase }}
              className="text-[14px] mb-12 max-w-[320px] mx-auto"
              style={{
                fontFamily: "var(--font-body)",
                color: "#493E36",
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
              Enter your email and we&apos;ll send you a reset link
            </motion.p>

            {!isSent ? (
              /* ── Form ── */
              <form onSubmit={handleSubmit} className="text-left">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
                  className="mb-10"
                >
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "#C7A064")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = "#DCC6A7")
                    }
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: smoothEase }}
                  type="submit"
                  disabled={isLoading}
                  className="magnetic-btn w-full flex items-center justify-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold py-[18px] rounded-full transition-all duration-500 hover:shadow-[0_4px_20px_rgba(52,42,36,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#342A24",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span>Sending…</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            ) : (
              /* ── Success State ── */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className="py-6"
              >
                {/* Success icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(199,160,100,0.1)",
                      border: "1px solid rgba(199,160,100,0.2)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M22 2L11 13"
                        stroke="#C7A064"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        stroke="#C7A064"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <h3
                  className="text-lg mb-3"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                    fontWeight: 400,
                  }}
                >
                  Check Your Email
                </h3>

                <p
                  className="text-[13px] mb-8 max-w-[300px] mx-auto"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#493E36",
                    fontWeight: 300,
                    lineHeight: 1.7,
                  }}
                >
                  We&apos;ve sent a password reset link to{" "}
                  <span style={{ color: "#342A24", fontWeight: 500 }}>
                    {email}
                  </span>
                </p>

                <button
                  onClick={() => {
                    setIsSent(false);
                    setEmail("");
                  }}
                  className="text-[12px] transition-opacity duration-300 hover:opacity-70"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#C7A064",
                    fontWeight: 500,
                  }}
                >
                  Try a different email
                </button>
              </motion.div>
            )}

            {/* Back to Sign In */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: smoothEase }}
              className="mt-10"
            >
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[12px] transition-opacity duration-300 hover:opacity-70"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#493E36",
                  fontWeight: 400,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                Back to Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
