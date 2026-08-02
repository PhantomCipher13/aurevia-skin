"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"drop" | "logo" | "exit">("drop");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 1400);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(() => onComplete(), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#FBF8F4" }}
        >
          {/* Radial glow */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #EAD9C3 0%, transparent 70%)",
            }}
          />

          {/* Animated serum drop */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === "drop" ? [0, 1.2, 1] : [1, 0.8, 0],
              opacity: phase === "drop" ? [0, 1, 1] : [1, 0.5, 0],
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.6, 1],
            }}
            className="relative z-10 mb-10"
          >
            <svg
              width="60"
              height="80"
              viewBox="0 0 60 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="dropGrad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#EAD9C3" />
                  <stop offset="60%" stopColor="#C7A064" />
                  <stop offset="100%" stopColor="#493E36" />
                </radialGradient>
                <filter id="dropGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M30 5C30 5 5 35 5 52C5 65.807 16.193 77 30 77C43.807 77 55 65.807 55 52C55 35 30 5 30 5Z"
                fill="url(#dropGrad)"
                filter="url(#dropGlow)"
              />
              {/* Highlight */}
              <ellipse
                cx="22"
                cy="42"
                rx="8"
                ry="12"
                fill="white"
                opacity="0.15"
                transform="rotate(-15 22 42)"
              />
            </svg>

            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 -m-4 rounded-full"
              animate={{
                scale: [1, 1.8, 2.2],
                opacity: [0.3, 0.1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{
                border: "1px solid #C7A064",
              }}
            />
          </motion.div>

          {/* Logo text reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20, letterSpacing: "0.1em" }}
            animate={
              phase === "logo"
                ? { opacity: 1, y: 0, letterSpacing: "0.5em" }
                : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 text-center"
          >
            <h1
              className="text-2xl md:text-3xl tracking-[0.5em]"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#342A24",
                fontWeight: 400,
              }}
            >
              AUREVIA
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase === "logo" ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[10px] tracking-[0.6em] uppercase mt-2"
              style={{
                fontFamily: "var(--font-body)",
                color: "#C7A064",
              }}
            >
              SKIN
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-[1px] overflow-hidden"
            style={{ background: "rgba(234, 217, 195, 0.3)" }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
              style={{ background: "#C7A064" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
