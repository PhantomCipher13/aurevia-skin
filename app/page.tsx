"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Bestsellers from "@/components/Bestsellers";
import WhyItWorks from "@/components/WhyItWorks";
import IngredientStory from "@/components/IngredientStory";
import SkincareRoutine from "@/components/SkincareRoutine";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonials from "@/components/Testimonials";
import GlowJournal from "@/components/GlowJournal";
import InstagramGallery from "@/components/InstagramGallery";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

function LuxuryDivider() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-4">
      <div
        className="h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #EAD9C3 30%, #DCC6A7 50%, #EAD9C3 70%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Hero />

        <LuxuryDivider />

        <section id="bestsellers">
          <Bestsellers />
        </section>

        <LuxuryDivider />

        <section id="science">
          <WhyItWorks />
        </section>

        <section id="ingredients">
          <IngredientStory />
        </section>

        <LuxuryDivider />

        <section id="routine">
          <SkincareRoutine />
        </section>

        <section id="results">
          <BeforeAfter />
        </section>

        <LuxuryDivider />

        <section id="testimonials">
          <Testimonials />
        </section>

        <section id="journal">
          <GlowJournal />
        </section>

        <InstagramGallery />

        <section id="shop">
          <FinalCTA />
        </section>
      </main>

      <Footer />
    </>
  );
}
