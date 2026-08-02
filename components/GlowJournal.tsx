"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

interface Article {
  title: string;
  category: string;
  image: string;
  aspect: string;
  colSpan: string;
  imageWidth: number;
  imageHeight: number;
  slug: string;
}

const articles: Article[] = [
  {
    title: "The Perfect Morning Glow Routine",
    category: "Routine",
    image: "/images/journal-morning.png",
    aspect: "16 / 9",
    colSpan: "lg:col-span-2",
    imageWidth: 1400,
    imageHeight: 788,
    slug: "morning-skincare-routine",
  },
  {
    title: "Understanding Skin Hydration",
    category: "Science",
    image: "/images/journal-hydration.png",
    aspect: "4 / 5",
    colSpan: "lg:col-span-1",
    imageWidth: 640,
    imageHeight: 800,
    slug: "science-hyaluronic-acid",
  },
  {
    title: "Building Your Skin Barrier",
    category: "Education",
    image: "/images/journal-barrier.png",
    aspect: "4 / 5",
    colSpan: "lg:col-span-1",
    imageWidth: 640,
    imageHeight: 800,
    slug: "ceramides-barrier-repair",
  },
  {
    title: "The Night Recovery Ritual",
    category: "Ritual",
    image: "/images/journal-night.png",
    aspect: "21 / 9",
    colSpan: "lg:col-span-2",
    imageWidth: 1400,
    imageHeight: 600,
    slug: "night-recovery-ritual",
  },
];


/* ─── Animation Variants ───────────────────────────────────────── */
const sectionHeaderVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Component ────────────────────────────────────────────────── */
export default function GlowJournal() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "#FBF8F4" }}
      className="py-32 px-6"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* ── Section Header ─────────────────────────────── */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20 text-center"
        >
          {/* Label with line accents */}
          <motion.div
            variants={fadeUpVariant}
            className="flex items-center justify-center gap-5 mb-6"
          >
            <span
              className="block h-px w-12"
              style={{ backgroundColor: "#C7A064" }}
            />
            <span
              className="text-[11px] tracking-[0.3em] uppercase font-medium font-[var(--font-body)]"
              style={{ color: "#C7A064" }}
            >
              The Glow Journal
            </span>
            <span
              className="block h-px w-12"
              style={{ backgroundColor: "#C7A064" }}
            />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUpVariant}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading)]"
            style={{ color: "#342A24", lineHeight: 1.1 }}
          >
            Stories for Your Skin
          </motion.h2>
        </motion.div>

        {/* ── Editorial Asymmetric Grid ───────────────────── */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {articles.map((article) => (
            <motion.article
              key={article.title}
              variants={cardVariants}
              className={`group cursor-pointer ${article.colSpan}`}
            >
              <Link href={`/blog/${article.slug}`} className="block h-full">
              {/* Image Container with Gradient Overlay */}
              <div
                className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: article.aspect }}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={article.imageWidth}
                  height={article.imageHeight}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes={
                    article.colSpan.includes("col-span-2")
                      ? "(max-width: 1024px) 100vw, 1400px"
                      : "(max-width: 1024px) 100vw, 50vw"
                  }
                />

                {/* Permanent gradient overlay at bottom */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(52, 42, 36, 0.82) 0%, rgba(52, 42, 36, 0.35) 40%, transparent 70%)",
                  }}
                />

                {/* Text content positioned on the gradient */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-3">
                  <span
                    className="text-[10px] tracking-[0.25em] uppercase font-semibold font-[var(--font-body)]"
                    style={{ color: "#C7A064" }}
                  >
                    {article.category}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl lg:text-3xl font-[var(--font-heading)] leading-tight"
                    style={{ color: "#FFFFFF" }}
                  >
                    {article.title}
                  </h3>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-medium font-[var(--font-body)] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: "#FFFFFF" }}
                  >
                    Read Article
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
