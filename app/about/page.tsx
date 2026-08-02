"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const smoothEase = [0.16, 1, 0.3, 1] as const;

const values = [
  {
    title: "Clean Formulations",
    description:
      "Every ingredient is chosen with intention. We never use parabens, sulfates, or synthetic fragrances.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 2C14 2 5 10.5 5 15.5C5 20.366 8.634 24 14 24C19.366 24 23 20.366 23 15.5C23 10.5 14 2 14 2Z"
          stroke="#C7A064"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Science-Backed",
    description:
      "Developed with dermatologists. Every product undergoes rigorous clinical testing for proven results.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5" stroke="#C7A064" strokeWidth="1.5" />
        <path d="M14 3V6" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 22V25" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 14H6" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 14H25" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Cruelty Free",
    description:
      "We never test on animals. Our commitment to ethical beauty is non-negotiable.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 24C14 24 3 18 3 11C3 7 6 4 9.5 4C11.5 4 13.5 5 14 7C14.5 5 16.5 4 18.5 4C22 4 25 7 25 11C25 18 14 24 14 24Z"
          stroke="#C7A064"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Sustainable",
    description:
      "Recyclable glass packaging, carbon-neutral shipping, and responsible sourcing from seed to shelf.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#C7A064" strokeWidth="1.5" />
        <path d="M9 14C9 14 11 18 14 18C17 18 19 14 19 14" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 3V9" stroke="#C7A064" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  return (
    <>
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section
        className="pt-36 lg:pt-44 pb-20 lg:pb-28 px-6"
        style={{ background: "#FBF8F4" }}
      >
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="max-w-[900px] mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[1px]" style={{ background: "#C7A064" }} />
            <span
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{
                fontFamily: "var(--font-body)",
                color: "#C7A064",
                fontWeight: 600,
              }}
            >
              Our Story
            </span>
            <div className="w-8 h-[1px]" style={{ background: "#C7A064" }} />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-[3.5rem] mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#342A24",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Beauty Should Be{" "}
            <span className="italic" style={{ color: "#C7A064" }}>
              Effortless
            </span>
          </h1>

          <p
            className="text-[15px] md:text-[16px] leading-[1.9] max-w-[600px] mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "#493E36",
              fontWeight: 300,
            }}
          >
            AUREVIA SKIN was born from a simple belief: that luxury skincare
            should be honest, effective, and beautiful. We create products that
            work in harmony with your skin — never against it.
          </p>
        </motion.div>
      </section>

      {/* Full-width image */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: smoothEase }}
          className="relative rounded-3xl overflow-hidden"
          style={{ aspectRatio: "21 / 9", background: "#F6EEE4" }}
        >
          <Image
            src="/images/ingredients.png"
            alt="AUREVIA SKIN luxury ingredients and botanical essences"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(251,248,244,0.3) 100%)",
            }}
          />
        </motion.div>
      </div>

      {/* Story section */}
      <section className="py-24 lg:py-32 px-6" style={{ background: "#FBF8F4" }}>
        <motion.div
          ref={storyRef}
          initial={{ opacity: 0, y: 40 }}
          animate={storyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="max-w-[800px] mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2
                className="text-2xl md:text-3xl mb-6"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#342A24",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                Where Nature Meets Science
              </h2>
              <p
                className="text-[14px] leading-[1.9] mb-6"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#493E36",
                  fontWeight: 300,
                }}
              >
                Our formulations begin in nature and are refined through
                science. We source the most effective botanical ingredients and
                combine them with clinically-proven actives to create products
                that deliver visible results.
              </p>
              <p
                className="text-[14px] leading-[1.9]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#493E36",
                  fontWeight: 300,
                }}
              >
                Every batch is small. Every ingredient is traceable. Every
                product is a promise — that your skin deserves better.
              </p>
            </div>
            <div>
              <h2
                className="text-2xl md:text-3xl mb-6"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#342A24",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                The AUREVIA Philosophy
              </h2>
              <p
                className="text-[14px] leading-[1.9] mb-6"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#493E36",
                  fontWeight: 300,
                }}
              >
                We believe skincare should be an act of luxury — effortless,
                refined, and transformative. No lengthy routines. No misleading
                claims. Just beautifully effective products that make you feel
                extraordinary.
              </p>
              <blockquote
                className="text-[16px] italic pl-5"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#C7A064",
                  borderLeft: "2px solid #C7A064",
                  lineHeight: 1.6,
                }}
              >
                &ldquo;Every ingredient is chosen with intention — never for
                trends, always for results.&rdquo;
              </blockquote>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section
        className="py-24 lg:py-32 px-6"
        style={{
          background:
            "linear-gradient(180deg, #FBF8F4 0%, #F6EEE4 50%, #FBF8F4 100%)",
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            ref={valuesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-center mb-16"
          >
            <h2
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#342A24",
                fontWeight: 400,
              }}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: smoothEase,
                }}
                className="text-center p-8 rounded-2xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(52,42,36,0.06)]"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex justify-center mb-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(199,160,100,0.1)" }}
                  >
                    {value.icon}
                  </div>
                </div>
                <h3
                  className="text-[14px] tracking-[0.05em] mb-3"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#342A24",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-[12px] leading-[1.8]"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#493E36",
                    fontWeight: 300,
                  }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "#FBF8F4" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
        >
          <h2
            className="text-2xl md:text-3xl mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#342A24",
              fontWeight: 400,
            }}
          >
            Experience the Difference
          </h2>
          <Link
            href="/shop"
            className="magnetic-btn inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-[18px] rounded-full transition-all duration-500"
            style={{
              background: "#342A24",
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
            }}
          >
            Shop the Collection →
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
