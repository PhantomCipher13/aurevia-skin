"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Concern tabs ────────────────────────────────── */
const concerns = [
  {
    id: "hydration",
    label: "Hydration",
    tag: "Most Popular",
    product: "Cloud Cream Moisturizer",
    duration: "4 Weeks",
    quote: "My skin stopped feeling tight after just 10 days. By week 4 the glow was real — friends kept asking what I was doing differently.",
    person: "Kavya S., 34 · Bangalore",
    stat: "91%",
    statLabel: "of users reported visibly plumper skin within 4 weeks",
    routine: ["Cloud Cream Moisturizer", "Hyaluronic Acid Toner", "Night Recovery Oil"],
  },
  {
    id: "brightening",
    label: "Brightening",
    tag: "Bestseller",
    product: "Vitamin C Serum",
    duration: "8 Weeks",
    quote: "The dark spots from years of sun exposure have genuinely faded. My dermatologist even noticed the difference at my last visit.",
    person: "Rhea T., 29 · Mumbai",
    stat: "78%",
    statLabel: "reduction in dark spot appearance after 8 weeks of consistent use",
    routine: ["Vitamin C Brightening Serum", "Radiance Serum", "Mineral SPF 50"],
  },
  {
    id: "anti-aging",
    label: "Anti-Aging",
    tag: "Advanced",
    product: "Retinol Serum",
    duration: "12 Weeks",
    quote: "After 3 months on the retinol routine my skin looks the most rested it has in years. Fine lines around my eyes are visibly softer.",
    person: "Meera J., 42 · Delhi",
    stat: "82%",
    statLabel: "reported visible reduction in fine line appearance after 12 weeks",
    routine: ["Retinol Renewal Serum", "Peptide Eye Cream", "Cloud Cream Moisturizer"],
  },
];

const globalStats = [
  { value: "94%", label: "Saw brighter skin in 4 weeks" },
  { value: "88%", label: "Dark spots reduced in 8 weeks" },
  { value: "97%", label: "Felt more hydrated after first use" },
  { value: "91%", label: "Would recommend to a friend" },
];

/* ─── Draggable comparison slider ────────────────── */
function ComparisonSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => { e.preventDefault(); updatePos(e.clientX); };
    const onTouch = (e: TouchEvent) => updatePos(e.touches[0].clientX);
    const onEnd = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onEnd);
    };
  }, [dragging, updatePos]);

  const startDrag = (clientX: number) => {
    setDragging(true);
    setTouched(true);
    updatePos(clientX);
  };

  return (
    <div className="relative select-none overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: "1/1" }}
      ref={containerRef}>
      {/* AFTER — full background */}
      <div className="absolute inset-0">
        <Image src="/images/results-after.png" alt="After - Hydrated, glowing skin texture"
          fill className="object-cover" sizes="(max-width:768px) 100vw, 45vw" quality={95} />
        {/* warm golden overlay to enhance "after" glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(199,160,100,0.06) 0%, transparent 60%)" }} />
      </div>

      {/* BEFORE — clipped left portion */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div style={{ position: "absolute", inset: 0, width: `${10000 / pos}%` }}>
          <Image src="/images/results-before.png" alt="Before - Dry, dull skin texture"
            fill className="object-cover" sizes="(max-width:768px) 100vw, 45vw" quality={95} />
          {/* slight cool desaturate on before */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(73,62,54,0.12)", mixBlendMode: "multiply" }} />
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-10"
        style={{ left: `${pos}%`, transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)", boxShadow: "0 0 12px rgba(0,0,0,0.25)" }} />

      {/* Drag handle */}
      <div
        onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        className="absolute top-1/2 z-20 cursor-ew-resize"
        style={{
          left: `${pos}%`,
          transform: `translate(-50%, -50%) scale(${dragging ? 1.12 : 1})`,
          transition: "transform 0.15s ease",
        }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: "#C7A064",
            boxShadow: "0 2px 20px rgba(52,42,36,0.45), 0 0 0 3px rgba(255,255,255,0.85)",
          }}>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path d="M6 1L1 6l5 5M14 1l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Corner labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-lg pointer-events-none z-10"
        style={{ background: "rgba(52,42,36,0.75)", backdropFilter: "blur(4px)" }}>
        <p className="text-[9px] tracking-[0.2em] uppercase font-bold" style={{ color: "rgba(234,217,195,0.85)", fontFamily: "var(--font-body)" }}>Before</p>
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg pointer-events-none z-10"
        style={{ background: "rgba(199,160,100,0.85)", backdropFilter: "blur(4px)" }}>
        <p className="text-[9px] tracking-[0.2em] uppercase font-bold text-white" style={{ fontFamily: "var(--font-body)" }}>After</p>
      </div>

      {/* Drag hint */}
      <AnimatePresence>
        {!touched && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
            <div className="px-4 py-2 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold flex items-center gap-2"
              style={{ background: "rgba(52,42,36,0.7)", color: "rgba(234,217,195,0.9)", fontFamily: "var(--font-body)", backdropFilter: "blur(6px)" }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M4 1L1 5l3 4M10 1l3 4-3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Drag to compare
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-area drag zone */}
      <div className="absolute inset-0 cursor-ew-resize z-[5]"
        onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)} />
    </div>
  );
}

/* ─── Main Section ────────────────────────────────── */
export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const concern = concerns[active];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 px-6" style={{ background: "#FBF8F4" }}>
      <div className="max-w-[1160px] mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }} className="text-center mb-12">
          <p className="text-[9px] tracking-[0.45em] uppercase font-semibold mb-4"
            style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>REAL RESULTS</p>
          <h2 className="text-3xl md:text-[2.6rem] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400 }}>
            Real Skin. Real Results.
          </h2>
          <p className="text-[14px] max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>
            Macro skin texture photography showing what consistent AUREVIA routines
            actually do to your skin — captured under identical studio conditions.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            {["Macro Photography", "No Editing", "Identical Lighting", "Verified Customers"].map((b) => (
              <span key={b} className="px-3 py-1.5 rounded-full text-[9px] tracking-[0.07em] uppercase font-semibold"
                style={{ background: "rgba(199,160,100,0.07)", color: "#C7A064", border: "1px solid rgba(199,160,100,0.18)", fontFamily: "var(--font-body)" }}>
                ✓ {b}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Concern tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="flex flex-wrap justify-center gap-2 mb-12">
          {concerns.map((c, i) => (
            <button key={c.id} onClick={() => setActive(i)}
              className="relative px-5 py-2.5 rounded-full text-[11px] tracking-[0.06em] font-semibold transition-all duration-300"
              style={{
                background: active === i ? "#342A24" : "#F6EEE4",
                color: active === i ? "#FFFFFF" : "#493E36",
                border: active === i ? "1.5px solid #342A24" : "1.5px solid #EAD9C3",
                fontFamily: "var(--font-body)",
              }}>
              {c.label}
              {c.tag && (
                <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-[7px] tracking-[0.05em] uppercase font-bold"
                  style={{ background: "#C7A064", color: "white", fontFamily: "var(--font-body)" }}>
                  {c.tag}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Main 2-col layout */}
        <AnimatePresence mode="wait">
          <motion.div key={concern.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.38, ease }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* Slider — takes 3/5 columns */}
            <div className="lg:col-span-3">
              <ComparisonSlider />
              <p className="text-[10px] mt-3 text-center" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.28 }}>
                Macro skin texture photography · Identical studio lighting · No colour grading
              </p>
            </div>

            {/* Story — takes 2/5 */}
            <div className="lg:col-span-2 flex flex-col justify-center">

              <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full w-fit"
                style={{ background: "rgba(199,160,100,0.08)", border: "1px solid rgba(199,160,100,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C7A064" }} />
                <span className="text-[10px] tracking-[0.1em] uppercase font-semibold"
                  style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>
                  {concern.duration} · {concern.label}
                </span>
              </div>

              <h3 className="text-[26px] md:text-[30px] mb-5"
                style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400, lineHeight: 1.2 }}>
                {concern.duration} of Care.<br />
                <em style={{ color: "#C7A064" }}>Visible Difference.</em>
              </h3>

              {/* Big stat */}
              <div className="flex items-center gap-4 mb-5 p-5 rounded-2xl"
                style={{ background: "rgba(199,160,100,0.06)", border: "1px solid rgba(199,160,100,0.15)" }}>
                <p className="text-[48px] font-light leading-none flex-shrink-0"
                  style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>
                  {concern.stat}
                </p>
                <p className="text-[12px] leading-snug"
                  style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.65 }}>
                  {concern.statLabel}
                </p>
              </div>

              {/* Quote */}
              <blockquote className="mb-5 pl-4 py-1"
                style={{ borderLeft: "3px solid #EAD9C3" }}>
                <p className="text-[14px] italic leading-[1.75] mb-2"
                  style={{ fontFamily: "var(--font-heading)", color: "#493E36" }}>
                  &ldquo;{concern.quote}&rdquo;
                </p>
                <p className="text-[11px]"
                  style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                  — {concern.person}
                </p>
              </blockquote>

              {/* Routine used */}
              <div className="mb-7">
                <p className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-3"
                  style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.35 }}>
                  Routine Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {concern.routine.map((p) => (
                    <span key={p} className="px-3 py-1.5 rounded-full text-[10px] font-medium"
                      style={{ background: "#F6EEE4", border: "1px solid #EAD9C3", color: "#342A24", fontFamily: "var(--font-body)" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <a href="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[10px] tracking-[0.16em] uppercase font-semibold transition-all hover:-translate-y-0.5 w-fit"
                style={{ background: "#342A24", color: "#FFFFFF", fontFamily: "var(--font-body)", boxShadow: "0 4px 20px rgba(52,42,36,0.15)" }}>
                Start Your Routine →
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {concerns.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className="transition-all duration-300"
              style={{ width: active === i ? 24 : 8, height: 8, borderRadius: 4, background: active === i ? "#C7A064" : "rgba(199,160,100,0.22)" }} />
          ))}
        </div>

        {/* Global stats strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12"
          style={{ borderTop: "1px solid rgba(199,160,100,0.12)" }}>
          {globalStats.map((stat, i) => (
            <motion.div key={stat.value}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.08, ease }}
              className="text-center p-5 rounded-2xl"
              style={{ background: "#F6EEE4", border: "1px solid rgba(199,160,100,0.1)" }}>
              <p className="text-[38px] font-light mb-1" style={{ fontFamily: "var(--font-heading)", color: "#C7A064" }}>{stat.value}</p>
              <p className="text-[11px] leading-snug" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.55 }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-[10px] mt-3" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.22 }}>
          *Consumer self-assessment study of 312 participants. Individual results may vary.
        </p>
      </div>
    </section>
  );
}
