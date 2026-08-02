"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

/* ─── Gallery Data ─────────────────────────────────────────────── */
const images = [
  { src: "/images/insta-bathroom.png", alt: "Luxury bathroom skincare setup", size: 280 },
  { src: "/images/insta-texture.png", alt: "Skincare product texture closeup", size: 320 },
  { src: "/images/insta-lifestyle.png", alt: "Aurevia lifestyle moment", size: 280 },
  { src: "/images/insta-flowers.png", alt: "Botanical flower arrangement", size: 320 },
  { src: "/images/insta-candles.png", alt: "Candle-lit self-care ritual", size: 280 },
  { src: "/images/insta-marble.png", alt: "Products on marble surface", size: 320 },
];

/* ─── Instagram SVG Icon ───────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="#FFFFFF" stroke="none" />
    </svg>
  );
}

/* ─── Animation Variants ───────────────────────────────────────── */
const headerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stripContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Scrollbar-hiding style ID ────────────────────────────────── */
const SCROLLBAR_STYLE_ID = "aurevia-insta-scrollbar-hide";

/* ─── Component ────────────────────────────────────────────────── */
export default function InstagramGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  /* Inject a tiny style rule to hide the webkit scrollbar */
  useEffect(() => {
    if (document.getElementById(SCROLLBAR_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = SCROLLBAR_STYLE_ID;
    style.textContent = `.insta-scroll::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "#FBF8F4" }}
      className="py-24"
    >
      {/* ── Section Header ─────────────────────────────── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex items-center justify-between gap-6 mb-10 px-6 sm:px-10 lg:px-16"
      >
        <motion.span
          variants={fadeUpVariant}
          className="text-[11px] tracking-[0.3em] uppercase font-medium font-[var(--font-body)]"
          style={{ color: "#C7A064" }}
        >
          Aurevia Glow Moments
        </motion.span>

        <motion.a
          variants={fadeUpVariant}
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium font-[var(--font-body)] transition-colors duration-300 shrink-0"
          style={{ color: "#493E36" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#C7A064")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#493E36")
          }
        >
          @aurevia.skin
        </motion.a>
      </motion.div>

      {/* ── Full-width Scroll Strip with Edge Fades ──── */}
      <div className="relative">
        {/* Left gradient fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #FBF8F4 0%, rgba(251, 248, 244, 0) 100%)",
          }}
        />
        {/* Right gradient fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #FBF8F4 0%, rgba(251, 248, 244, 0) 100%)",
          }}
        />

        <motion.div
          variants={stripContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="insta-scroll flex gap-4 overflow-x-auto px-6 sm:px-10 lg:px-16"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {images.map((img) => (
            <motion.a
              key={img.src}
              variants={imageVariants}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: img.size,
                height: img.size,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.size}
                height={img.size}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                sizes={`${img.size}px`}
              />

              {/* Hover Overlay — warm dark with Instagram icon */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(73, 62, 54, 0.55) 0%, rgba(52, 42, 36, 0.65) 100%)",
                }}
              >
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <InstagramIcon />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
