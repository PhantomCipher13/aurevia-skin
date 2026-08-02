"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ─── Floating Particles ─── */
function FloatingParticles() {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: string;
      delay: string;
      duration: string;
      size: number;
    }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${8 + Math.random() * 14}s`,
        size: 1.5 + Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Hero Section ─── */
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const modelScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const serumY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-[110vh] lg:h-[120vh] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FBF8F4 0%, #F6EEE4 40%, #EAD9C3 80%, #FBF8F4 100%)",
      }}
    >
      {/* ── Layer 1: Background atmosphere ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, willChange: "transform" }}
      >
        {/* Marble noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Warm radial glows */}
        <div
          className="absolute top-[10%] right-[15%] w-[900px] h-[900px] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(234,217,195,0.4) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-[20%] left-[10%] w-[700px] h-[700px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(220,198,167,0.3) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(199,160,100,0.12) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* ── Layer 2: Giant AUREVIA watermark ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[2]"
        style={{ y: textY, willChange: "transform" }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[22vw] lg:text-[16vw] leading-none tracking-[0.08em] whitespace-nowrap"
          style={{
            fontFamily: "var(--font-heading)",
            color: "#C7A064",
            fontWeight: 400,
          }}
        >
          AUREVIA
        </motion.h1>
      </motion.div>

      {/* ── Floating Particles ── */}
      <FloatingParticles />

      {/* ── Layer 3: Main composition ── */}
      <motion.div
        className="relative z-10 h-full w-full max-w-[1600px] mx-auto px-6 lg:px-16"
        style={{ opacity: contentOpacity }}
      >
        <div className="relative h-full flex items-center">
          {/* ━━━ LEFT: Editorial text content ━━━ */}
          <motion.div
            className="relative z-30 w-full lg:w-[48%] pt-32 lg:pt-0"
            style={{ y: contentY }}
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-8"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-[1px]"
                  style={{ background: "#C7A064" }}
                />
                <p
                  className="text-[10px] tracking-[0.4em] uppercase"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#C7A064",
                    fontWeight: 600,
                  }}
                >
                  Luxury Skincare, Real Results
                </p>
              </div>
            </motion.div>

            {/* Headline — editorial stacked typography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="mb-8 lg:mb-10"
            >
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                    fontWeight: 400,
                  }}
                >
                  Glow That
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 1.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                    fontWeight: 400,
                  }}
                >
                  Feels{" "}
                  <span className="italic" style={{ color: "#C7A064" }}>
                    Naturally
                  </span>
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                    fontWeight: 400,
                  }}
                >
                  Yours
                </motion.h2>
              </div>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[15px] lg:text-[17px] leading-[1.8] max-w-[400px] mb-10"
              style={{
                fontFamily: "var(--font-body)",
                color: "#493E36",
                fontWeight: 300,
              }}
            >
              Premium skincare essentials crafted with science and nature for
              radiant, hydrated, real-looking skin.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <a
                href="#bestsellers"
                className="magnetic-btn group relative inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-[18px] rounded-full overflow-hidden transition-all duration-500"
                style={{
                  background: "#342A24",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span className="relative z-10">Shop Collection</span>
                <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#routine"
                className="magnetic-btn inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-[18px] rounded-full transition-all duration-500 hover:bg-[#342A24] hover:text-white hover:border-[#342A24]"
                style={{
                  border: "1.5px solid #493E36",
                  color: "#342A24",
                  background: "transparent",
                  fontFamily: "var(--font-body)",
                }}
              >
                Discover Ritual
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="flex flex-wrap gap-x-8 gap-y-3"
            >
              {[
                "Dermatologist Tested",
                "Cruelty Free",
                "Clean Ingredients",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="6"
                      stroke="#C7A064"
                      strokeWidth="1"
                    />
                    <path
                      d="M4.5 7L6.2 8.7L9.5 5.3"
                      stroke="#C7A064"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="text-[10px] tracking-[0.12em] uppercase"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#493E36",
                      fontWeight: 500,
                    }}
                  >
                    {badge}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ━━━ RIGHT: Editorial imagery composition ━━━ */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-[45%] w-[55%] h-[85%]">
            {/* Model image — main visual anchor */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.4,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ scale: modelScale, willChange: "transform" }}
              className="absolute top-0 right-0 w-[75%] h-full"
            >
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <Image
                  src="/images/hero-model.png"
                  alt="Beautiful woman with radiant glowing skin — editorial beauty photography"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 0px, 45vw"
                  quality={90}
                />
                {/* Warm overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(251,248,244,0.2) 80%, rgba(251,248,244,0.6) 100%)",
                  }}
                />
                {/* Left fade for text blend */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(251,248,244,0.7) 0%, transparent 30%)",
                  }}
                />
              </div>
            </motion.div>

            {/* Floating serum bottle — overlapping composition */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ y: serumY, willChange: "transform" }}
              className="absolute -left-[5%] bottom-[8%] z-20"
            >
              <div className="animate-float-slow light-sweep-overlay">
                <div className="relative w-[220px] h-[300px] xl:w-[260px] xl:h-[360px]">
                  <Image
                    src="/images/hero-serum.png"
                    alt="AUREVIA SKIN Radiance Serum — premium glass bottle"
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="260px"
                    quality={90}
                  />
                </div>
              </div>

              {/* Glass product label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="absolute -right-6 top-[35%] glass rounded-xl px-5 py-3.5"
              >
                <p
                  className="text-[8px] tracking-[0.25em] uppercase mb-0.5"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#C7A064",
                    fontWeight: 600,
                  }}
                >
                  AUREVIA SKIN
                </p>
                <p
                  className="text-[13px]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                  }}
                >
                  Radiance Serum
                </p>
              </motion.div>

              {/* Reflection under bottle */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-8 blur-md opacity-20"
                style={{
                  background:
                    "radial-gradient(ellipse, #DCC6A7 0%, transparent 70%)",
                }}
              />
            </motion.div>

            {/* Decorative badge */}
            <motion.div
              initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 12, scale: 1 }}
              transition={{ delay: 2.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-4 top-4 z-30 glass rounded-full w-[90px] h-[90px] xl:w-[100px] xl:h-[100px] flex items-center justify-center text-center animate-float-gentle"
            >
              <p
                className="text-[7px] xl:text-[8px] tracking-[0.04em] uppercase leading-[1.5] px-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#493E36",
                  fontWeight: 500,
                }}
              >
                A Fictional
                <br />
                Skincare
                <br />
                <span style={{ color: "#C7A064" }}>Concept</span>
              </p>
            </motion.div>

            {/* Decorative ring */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute -right-12 top-[15%] w-40 h-40 rounded-full animate-float-slow"
              style={{
                border: "1px solid #EAD9C3",
              }}
            />
          </div>

          {/* ── Mobile imagery ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="lg:hidden absolute bottom-24 right-0 w-[55%] max-w-[240px]"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/images/hero-model.png"
                alt="Beautiful woman with radiant skin"
                fill
                className="object-cover"
                priority
                sizes="240px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(251,248,244,0.6) 0%, transparent 40%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "#493E36",
            fontWeight: 500,
          }}
        >
          Scroll to Discover
        </span>
        <div
          className="w-[18px] h-[30px] rounded-full flex items-start justify-center p-[3px]"
          style={{ border: "1.5px solid #DCC6A7" }}
        >
          <motion.div
            className="w-[3px] h-[6px] rounded-full"
            style={{ background: "#C7A064" }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* ── Bottom gradient ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-30"
        style={{ background: "linear-gradient(transparent, #FBF8F4)" }}
      />
    </section>
  );
}
