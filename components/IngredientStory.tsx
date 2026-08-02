"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";

export default function IngredientStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 overflow-hidden"
      style={{ background: "#FBF8F4" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left — Large editorial image with parallax */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-7 relative"
          >
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[4/5] lg:aspect-[3/4]">
              <motion.div
                className="absolute inset-0"
                style={{
                  scale: imageScale,
                  y: imageY,
                  willChange: "transform",
                }}
              >
                <Image
                  src="/images/ingredients.png"
                  alt="Luxury skincare ingredients — cream textures, water ripples, botanicals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  quality={90}
                />
              </motion.div>
              {/* Warm overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(52,42,36,0.15) 100%)",
                }}
              />
            </div>

            {/* Overlapping label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -right-4 lg:right-8 glass rounded-xl px-6 py-4 z-10"
            >
              <p
                className="text-[9px] tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#C7A064",
                  fontWeight: 600,
                }}
              >
                Clean Formulation
              </p>
              <p
                className="text-[22px] mt-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#342A24",
                }}
              >
                97% Natural Origin
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Editorial storytelling */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-5 lg:pl-8 xl:pl-16"
          >
            {/* Label */}
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
                The Aurevia Philosophy
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-3xl md:text-4xl lg:text-[2.8rem] leading-[1.1] mb-10"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#342A24",
                fontWeight: 400,
              }}
            >
              Where Nature
              <br />
              Meets{" "}
              <span className="italic" style={{ color: "#C7A064" }}>
                Science
              </span>
            </h2>

            {/* Body */}
            <p
              className="text-[14px] lg:text-[15px] leading-[2] mb-8"
              style={{
                fontFamily: "var(--font-body)",
                color: "#493E36",
                fontWeight: 300,
              }}
            >
              Every AUREVIA formulation begins with a journey — to the lush
              valleys where botanicals flourish, to the laboratories where
              cutting-edge science transforms nature&#39;s finest into
              extraordinary skincare.
            </p>

            <p
              className="text-[14px] lg:text-[15px] leading-[2] mb-12"
              style={{
                fontFamily: "var(--font-body)",
                color: "#493E36",
                fontWeight: 300,
              }}
            >
              Our clean formulation philosophy means every ingredient earns its
              place. No fillers, no harsh chemicals. Each product is
              dermatologist tested and crafted to deliver visible results.
            </p>

            {/* Luxury divider */}
            <div
              className="h-[1px] w-full mb-10"
              style={{
                background:
                  "linear-gradient(90deg, #EAD9C3, transparent)",
              }}
            />

            {/* Quote */}
            <blockquote className="relative pl-6">
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{
                  background:
                    "linear-gradient(180deg, #C7A064, transparent)",
                }}
              />
              <p
                className="text-[15px] lg:text-[17px] leading-[1.8] italic"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#342A24",
                }}
              >
                &ldquo;Every ingredient is chosen with intention — never
                for trends, always for results.&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
