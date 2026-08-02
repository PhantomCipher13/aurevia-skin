"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ingredients = [
  {
    name: "Hyaluronic Acid",
    shortName: "HA",
    description: "Deep hydration & plumpness",
    detail:
      "Holds 1000x its weight in water to deliver intense moisture to every layer of skin.",
    size: 120,
    position: { top: "2%", left: "5%" },
    floatDuration: 6,
    floatDelay: 0,
  },
  {
    name: "Niacinamide",
    shortName: "B3",
    description: "Brightens skin & evens tone",
    detail:
      "Vitamin B3 that reduces pores, smooths texture, and creates a natural luminosity.",
    size: 105,
    position: { top: "5%", left: "52%" },
    floatDuration: 7,
    floatDelay: 1,
  },
  {
    name: "Ceramides",
    shortName: "CER",
    description: "Strengthens skin barrier",
    detail:
      "Essential lipids that form a protective shield, locking in moisture all day.",
    size: 95,
    position: { top: "38%", left: "25%" },
    floatDuration: 5.5,
    floatDelay: 2,
  },
  {
    name: "Rice Water",
    shortName: "RW",
    description: "Soothes, softens & boosts glow",
    detail:
      "An ancient Japanese beauty secret packed with minerals and amino acids.",
    size: 110,
    position: { top: "50%", left: "62%" },
    floatDuration: 6.5,
    floatDelay: 0.5,
  },
  {
    name: "Peptides",
    shortName: "PEP",
    description: "Supports elasticity & smooth skin",
    detail:
      "Signal peptides that stimulate collagen production for firmer, younger-looking skin.",
    size: 100,
    position: { top: "72%", left: "12%" },
    floatDuration: 7.5,
    floatDelay: 1.5,
  },
];

function IngredientCircle({
  ingredient,
  index,
  isInView,
}: {
  ingredient: (typeof ingredients)[number];
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
              y: [0, -14, 0],
            }
          : {}
      }
      transition={{
        opacity: {
          duration: 0.8,
          delay: 0.2 + index * 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
        scale: {
          duration: 0.8,
          delay: 0.2 + index * 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
        y: {
          duration: ingredient.floatDuration,
          delay: ingredient.floatDelay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        },
      }}
      className="absolute cursor-pointer"
      style={{
        top: ingredient.position.top,
        left: ingredient.position.left,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass circle */}
      <motion.div
        animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center rounded-full"
        style={{
          width: `${ingredient.size}px`,
          height: `${ingredient.size}px`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(246,238,228,0.3))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: isHovered
            ? "1px solid rgba(199,160,100,0.5)"
            : "1px solid rgba(234,217,195,0.4)",
          boxShadow: isHovered
            ? "0 15px 40px rgba(199,160,100,0.15), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 8px 32px rgba(52,42,36,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
          transition: "border 0.4s, box-shadow 0.4s",
        }}
      >
        <span
          className="text-[18px] font-light mb-0.5"
          style={{
            fontFamily: "var(--font-heading)",
            color: "#C7A064",
            opacity: 0.6,
          }}
        >
          {ingredient.shortName}
        </span>
        <span
          className="text-[9px] leading-tight text-center px-3 font-medium tracking-wide uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: "#493E36",
          }}
        >
          {ingredient.name}
        </span>
      </motion.div>

      {/* Expanded detail on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 z-50 pointer-events-none"
            style={{
              top: "100%",
              width: "200px",
            }}
          >
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{
                background: "rgba(52,42,36,0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                className="text-[10px] tracking-wider uppercase mb-1"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#C7A064",
                  fontWeight: 600,
                }}
              >
                {ingredient.description}
              </p>
              <p
                className="text-[10px] leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#EAD9C3",
                  fontWeight: 300,
                }}
              >
                {ingredient.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WhyItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 overflow-hidden"
      style={{ background: "#FBF8F4" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-25"
        style={{
          background:
            "radial-gradient(circle, #EAD9C3 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Left — Editorial text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-8 h-[1px]"
                style={{ background: "#C7A064" }}
              />
              <span
                className="text-[10px] tracking-[0.35em] uppercase"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#C7A064",
                  fontWeight: 600,
                }}
              >
                The Science
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-[3.8rem] leading-[1.05] mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#342A24",
                fontWeight: 400,
              }}
            >
              Powerful Ingredients.
              <br />
              <span className="italic" style={{ color: "#C7A064" }}>
                Gentle
              </span>{" "}
              on Skin.
            </h2>

            <p
              className="text-[15px] lg:text-[17px] leading-[1.9] mb-10 max-w-[420px]"
              style={{
                fontFamily: "var(--font-body)",
                color: "#493E36",
                fontWeight: 300,
              }}
            >
              We select honest, effective ingredients your skin truly needs. No
              fillers. No compromises. Just clean formulations that deliver
              visible results.
            </p>

            <motion.a
              href="#ingredients"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="magnetic-btn inline-flex items-center gap-3 px-9 py-[16px] text-[11px] tracking-[0.2em] uppercase font-medium rounded-full transition-all duration-500 hover:bg-[#C7A064] hover:text-white hover:border-[#C7A064]"
              style={{
                fontFamily: "var(--font-body)",
                color: "#C7A064",
                border: "1.5px solid #C7A064",
                background: "transparent",
              }}
            >
              Explore Ingredients
              <span>→</span>
            </motion.a>
          </motion.div>

          {/* Right — Floating ingredient circles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative min-h-[450px] md:min-h-[520px] lg:min-h-[580px]"
          >
            {ingredients.map((ingredient, index) => (
              <IngredientCircle
                key={ingredient.name}
                ingredient={ingredient}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
