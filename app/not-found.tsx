"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function NotFound() {
  return (
    <>
      <CustomCursor />
      <Navigation />

      <section
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#FBF8F4" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg"
        >
          {/* Decorative diamond */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16 0L18.5 13.5L32 16L18.5 18.5L16 32L13.5 18.5L0 16L13.5 13.5L16 0Z"
                fill="#C7A064"
                fillOpacity="0.4"
              />
            </svg>
          </motion.div>

          {/* 404 number */}
          <h1
            className="text-[8rem] md:text-[10rem] leading-none mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#342A24",
              fontWeight: 400,
              opacity: 0.1,
            }}
          >
            404
          </h1>

          {/* Message */}
          <h2
            className="text-2xl md:text-3xl mb-4 -mt-12"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#342A24",
              fontWeight: 400,
            }}
          >
            Page Not Found
          </h2>

          <p
            className="text-[14px] leading-[1.8] mb-10"
            style={{
              fontFamily: "var(--font-body)",
              color: "#493E36",
              fontWeight: 300,
              opacity: 0.7,
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back to discovering beautiful skin.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="magnetic-btn group relative inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-[18px] rounded-full overflow-hidden transition-all duration-500"
              style={{
                background: "#342A24",
                color: "#FFFFFF",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="relative z-10">Back to Home</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/#bestsellers"
              className="magnetic-btn inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-[18px] rounded-full transition-all duration-500 hover:bg-[#342A24] hover:text-white hover:border-[#342A24]"
              style={{
                border: "1.5px solid #493E36",
                color: "#342A24",
                background: "transparent",
                fontFamily: "var(--font-body)",
              }}
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
