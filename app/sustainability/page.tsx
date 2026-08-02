'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SustainabilityPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };


  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#342A24] font-body">
      <Navigation />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 max-w-5xl mx-auto text-center mb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p variants={itemVariants} className="text-[#C7A064] tracking-widest text-sm uppercase mb-4 font-semibold">
              Our Commitment
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-heading mb-6">
              Beauty Without Compromise
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[#493E36] text-lg max-w-2xl mx-auto">
              We believe true luxury shouldn't cost the earth. Our commitment to eco-conscious practices ensures that every drop of AUREVIA SKIN nourishes both you and the planet.
            </motion.p>
          </motion.div>
        </section>

        {/* Stats Row */}
        <section className="px-6 max-w-6xl mx-auto mb-32">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              "100% Recyclable Glass",
              "Carbon Neutral by 2026",
              "0 Animal Testing",
              "Sustainably Sourced Botanicals"
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="p-6 bg-[#F6EEE4] border border-[#EAD9C3] rounded-lg">
                <p className="font-heading text-xl text-[#342A24]">{stat}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Three Pillars */}
        <section className="px-6 max-w-6xl mx-auto mb-32">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-[#F6EEE4] border border-[#EAD9C3] p-8 rounded-lg">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="font-heading text-2xl mb-4">Packaging</h3>
              <p className="text-[#493E36]">Glass bottles, FSC-certified boxes, soy-based inks. We are constantly innovating, with a refillable option coming soon.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-[#F6EEE4] border border-[#EAD9C3] p-8 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-heading text-2xl mb-4">Carbon Footprint</h3>
              <p className="text-[#493E36]">Partnered with Indian reforestation NGOs, carbon-offset shipping, and a solar-powered warehouse to minimize our footprint.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-[#F6EEE4] border border-[#EAD9C3] p-8 rounded-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-heading text-2xl mb-4">Ethical Sourcing</h3>
              <p className="text-[#493E36]">Direct partnerships with farms in Kerala, Rajasthan, and Himachal Pradesh. Ensuring fair trade certified botanicals and empowering local communities.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Quote Section */}
        <section className="px-6 max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="w-16 h-[2px] bg-[#C7A064] mx-auto mb-8"></motion.div>
            <motion.blockquote variants={itemVariants} className="font-heading text-3xl md:text-4xl italic text-[#342A24] mb-8 leading-relaxed">
              "The earth does not belong to us. We belong to the earth. Every choice we make in formulation is a choice for the future."
            </motion.blockquote>
            <motion.div variants={itemVariants} className="w-16 h-[2px] bg-[#C7A064] mx-auto"></motion.div>
          </motion.div>
        </section>

        {/* Progress Section */}
        <section className="px-6 max-w-3xl mx-auto mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="font-heading text-4xl text-center mb-12">Our Progress</motion.h2>
            
            <div className="space-y-8">
              {[
                { title: 'Zero Plastic Packaging', percent: 85 },
                { title: 'Carbon Neutral Operations', percent: 62 },
                { title: 'Fully Renewable Energy', percent: 40 },
              ].map((goal, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[#342A24]">{goal.title}</span>
                    <span className="text-[#C7A064] font-medium">{goal.percent}% achieved</span>
                  </div>
                  <div className="w-full bg-[#EAD9C3] h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#C7A064] h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${goal.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/shop" className="inline-block bg-[#342A24] text-[#FBF8F4] px-8 py-4 rounded-full font-medium hover:bg-[#C7A064] transition-colors duration-300">
              Shop Consciously
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
