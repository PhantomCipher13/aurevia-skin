'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CareersPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const jobs = [
    { role: 'Senior Product Developer', dept: 'R&D', location: 'Bangalore', type: 'Full-time' },
    { role: 'UI/UX Designer', dept: 'Digital', location: 'Mumbai (Remote)', type: 'Full-time' },
    { role: 'Brand Marketing Manager', dept: 'Marketing', location: 'Mumbai', type: 'Full-time' },
    { role: 'Customer Experience Lead', dept: 'Operations', location: 'Bangalore', type: 'Full-time' },
    { role: 'Content Creator & Stylist', dept: 'Creative', location: 'Delhi (Remote)', type: 'Contract' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#342A24] font-body">
      <Navigation />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p variants={itemVariants} className="text-[#C7A064] tracking-widest text-sm uppercase mb-4 font-semibold">
              Join the Team
            </motion.p>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-heading mb-6">
              Build Something Beautiful
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[#493E36] text-lg max-w-2xl mx-auto">
              We are a collective of dreamers, scientists, and creatives on a mission to redefine luxury skincare. Join AUREVIA SKIN and help us bring beauty to the world.
            </motion.p>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="px-6 max-w-6xl mx-auto mb-32">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: 'Innovation', desc: 'Pushing boundaries in clean science and sustainable packaging.' },
              { title: 'Integrity', desc: 'Transparency in everything from ingredients to operations.' },
              { title: 'Inclusivity', desc: 'Creating products and a workplace that celebrate everyone.' },
              { title: 'Impact', desc: 'Leaving a positive mark on our communities and the planet.' },
            ].map((value, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-[#F6EEE4] border border-[#EAD9C3] p-8 rounded-lg text-center">
                <h3 className="font-heading text-2xl mb-3 text-[#342A24]">{value.title}</h3>
                <p className="text-[#493E36] text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Open Roles Section */}
        <section className="px-6 max-w-4xl mx-auto mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl text-center mb-12"
          >
            Open Roles
          </motion.h2>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6"
          >
            {jobs.map((job, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants} 
                className="bg-[#FBF8F4] border border-[#EAD9C3] p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div>
                  <h3 className="font-heading text-2xl text-[#342A24] mb-2">{job.role}</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-[#F6EEE4] text-[#C7A064] px-3 py-1 rounded-full font-medium">{job.dept}</span>
                    <span className="bg-[#F6EEE4] text-[#493E36] px-3 py-1 rounded-full flex items-center gap-1">📍 {job.location}</span>
                    <span className="bg-[#F6EEE4] text-[#493E36] px-3 py-1 rounded-full">{job.type}</span>
                  </div>
                </div>
                <Link href="/contact" className="shrink-0 group flex items-center gap-2 text-[#342A24] font-medium hover:text-[#C7A064] transition-colors">
                  Apply Now 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F6EEE4] border border-[#EAD9C3] p-12 rounded-2xl max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl mb-4">Don't see your role?</h2>
            <p className="text-[#493E36] mb-8">We're always looking for talented individuals to join our team. Send us your portfolio and resume.</p>
            <a href="mailto:careers@aureviaskin.com" className="inline-block bg-[#342A24] text-[#FBF8F4] px-8 py-4 rounded-full font-medium hover:bg-[#C7A064] transition-colors duration-300">
              Email Us
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
