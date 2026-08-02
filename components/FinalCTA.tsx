'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useToast } from '@/components/ToastProvider';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '80vh',
        padding: '128px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(180deg, #F6EEE4 0%, #FBF8F4 50%, #F6EEE4 100%)',
      }}
    >
      {/* Primary radial glow — warm champagne spotlight from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(234, 217, 195, 0.6) 0%, transparent 70%)',
        }}
      />

      {/* Secondary gold shimmer for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 50% 50%, rgba(199, 160, 100, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* Floating decorative golden ring — top right */}
      <div
        className="absolute pointer-events-none animate-float-slow"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1px solid rgba(199, 160, 100, 0.18)',
          top: '12%',
          right: '10%',
          animationDelay: '0s',
        }}
        aria-hidden="true"
      />

      {/* Floating decorative golden ring — bottom left */}
      <div
        className="absolute pointer-events-none animate-float-slow"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(199, 160, 100, 0.14)',
          bottom: '15%',
          left: '8%',
          animationDelay: '2.5s',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-10 w-full text-center"
        style={{ maxWidth: '720px', margin: '0 auto' }}
      >
        {/* Decorative Diamond / Star SVG */}
        <motion.div variants={itemVariants} className="flex justify-center mb-10">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M14 0L16.5 11.5L28 14L16.5 16.5L14 28L11.5 16.5L0 14L11.5 11.5L14 0Z"
              fill="#C7A064"
              fillOpacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Headline — 'Glow' in italic gold */}
        <motion.h2
          variants={itemVariants}
          className="leading-[1.05] mb-8"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#342A24',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
          }}
        >
          Begin Your{' '}
          <span
            style={{
              fontStyle: 'italic',
              color: '#C7A064',
            }}
          >
            Glow
          </span>{' '}
          Ritual
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg leading-relaxed mb-16 mx-auto"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#493E36',
            opacity: 0.8,
            maxWidth: '480px',
          }}
        >
          Join our community and get 10% off your first order.
        </motion.p>

        {/* Email Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim() && email.includes('@')) {
              showToast(
                'Welcome to the Glow Club ✨',
                'success',
                '10% off your first order has been sent to your inbox'
              );
              setEmail('');
            } else {
              showToast(
                'Please enter a valid email address',
                'info'
              );
            }
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-5 mx-auto"
          style={{ maxWidth: '540px' }}
        >
          {/* Email Input — bottom border only */}
          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 border-b px-1 py-4 text-sm md:text-base outline-none transition-colors duration-500"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                color: '#342A24',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: '#DCC6A7',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderRadius: 0,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = '#C7A064';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = '#DCC6A7';
              }}
            />
          </div>

          {/* Submit Button — gold rounded-full */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="magnetic-btn px-8 py-4 text-xs md:text-sm tracking-[0.2em] uppercase rounded-full whitespace-nowrap"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 500,
              background: '#C7A064',
              color: '#FFFFFF',
              transition: 'background 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#342A24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#C7A064';
            }}
          >
            Join the Glow Club
          </motion.button>
        </motion.form>

        {/* Privacy Disclaimer */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-[11px] tracking-wide"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#493E36',
            opacity: 0.4,
          }}
        >
          By subscribing, you agree to our Privacy Policy.
        </motion.p>
      </motion.div>
    </section>
  );
}
