"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ─── SVG Icons ─── */
function WaterDropIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 4C20 4 8 18 8 26C8 32.627 13.373 38 20 38C26.627 38 32 32.627 32 26C32 18 20 4 20 4Z"
        stroke="#C7A064"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M14 26C14 22.5 17 17 20 13" stroke="#C7A064" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function SerumDropIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="14" y="14" width="12" height="22" rx="3" stroke="#C7A064" strokeWidth="1.2" fill="none" />
      <rect x="16" y="4" width="8" height="10" rx="1.5" stroke="#C7A064" strokeWidth="1.2" fill="none" />
      <circle cx="20" cy="25" r="2.5" stroke="#C7A064" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 4L6 10V20C6 29 12.5 35.5 20 38C27.5 35.5 34 29 34 20V10L20 4Z"
        stroke="#C7A064"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M15 20L18.5 23.5L26 16" stroke="#C7A064" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Connecting line ─── */
function ConnectingLine() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 0.85", "end 0.4"],
  });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [600, 0]);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-1/2 left-0 w-full hidden lg:block pointer-events-none"
      style={{ transform: "translateY(-50%)" }}
    >
      <svg viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none" aria-hidden="true" className="w-full">
        <motion.path
          d="M100 50 C250 50, 300 20, 400 50 C500 80, 550 50, 600 50 C650 50, 700 20, 800 50 C900 80, 950 50, 1100 50"
          stroke="#EAD9C3"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="600"
          style={{ strokeDashoffset: dashOffset }}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ─── Step data ─── */
const steps = [
  { number: "01", title: "CLEANSE", description: "Remove impurities & prep your skin for absorption.", Icon: WaterDropIcon },
  { number: "02", title: "TREAT", description: "Nourish, hydrate & repair with targeted actives.", Icon: SerumDropIcon },
  { number: "03", title: "SEAL", description: "Lock in moisture & strengthen your skin barrier.", Icon: ShieldIcon },
];

/* ─── Step Card ─── */
function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.2 }}
      className="relative z-10 flex-1 group"
    >
      <div
        className="relative rounded-3xl p-8 lg:p-10 text-center flex flex-col items-center gap-4 h-full overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(199,160,100,0.1)]"
        style={{
          background: "linear-gradient(145deg, #F6EEE4 0%, rgba(246,238,228,0.6) 100%)",
          border: "1px solid rgba(234,217,195,0.4)",
        }}
      >
        {/* Big step number as watermark */}
        <span
          className="absolute -top-4 -right-2 text-[120px] leading-none select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-heading)",
            color: "rgba(199,160,100,0.06)",
            fontWeight: 400,
          }}
        >
          {step.number}
        </span>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-500 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(246,238,228,0.3))",
            border: "1px solid rgba(234,217,195,0.4)",
            boxShadow: "0 4px 16px rgba(52,42,36,0.04)",
          }}
        >
          <step.Icon />
        </div>

        {/* Step number small */}
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "#C7A064",
            fontWeight: 600,
          }}
        >
          Step {step.number}
        </span>

        {/* Title */}
        <h3
          className="text-[14px] tracking-[0.3em] font-medium"
          style={{
            fontFamily: "var(--font-body)",
            color: "#342A24",
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className="text-[13px] leading-[1.8] max-w-[220px]"
          style={{
            fontFamily: "var(--font-body)",
            color: "#493E36",
            fontWeight: 300,
          }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function SkincareRoutine() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 lg:py-40 px-6" style={{ background: "#FBF8F4" }}>
      <div className="max-w-[1400px] mx-auto lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-8 h-[1px]" style={{ background: "#C7A064" }} />
              <span
                className="text-[10px] tracking-[0.35em] uppercase"
                style={{ fontFamily: "var(--font-body)", color: "#C7A064", fontWeight: 600 }}
              >
                The Aurevia Routine
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05]"
              style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400 }}
            >
              Simple Steps.
              <br />
              <span className="italic" style={{ color: "#C7A064" }}>Beautiful</span> Skin.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="magnetic-btn px-8 py-3.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-500 hover:bg-[#C7A064] hover:text-white hover:border-[#C7A064]"
              style={{ border: "1.5px solid #C7A064", color: "#C7A064", background: "transparent" }}
            >
              View Full Routine
            </button>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="relative">
          <ConnectingLine />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
