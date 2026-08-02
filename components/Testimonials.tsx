'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
  {
    quote: 'My skin feels softer, more hydrated and the glow is unreal!',
    name: 'Ananya S.',
    stars: 5,
    motionDelay: 0,
    floatDelay: '0s',
    offsetY: '-20px',
  },
  {
    quote:
      'The products are gentle, effective and the routine is so easy to follow.',
    name: 'Rhea M.',
    stars: 5,
    motionDelay: 0.15,
    floatDelay: '1.5s',
    offsetY: '20px',
  },
  {
    quote: 'Luxury feel at every step. My new everyday skincare ritual.',
    name: 'Simran K.',
    stars: 5,
    motionDelay: 0.3,
    floatDelay: '3s',
    offsetY: '-10px',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{ color: '#C7A064', fontSize: '1rem', lineHeight: 1 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#FBF8F4' }}
      className="relative overflow-hidden"
    >
      {/* Keyframes for floating animation */}
      <style>{`
        @keyframes testimonial-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-card-float {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="mx-auto px-6 py-32"
        style={{ maxWidth: '1400px' }}
      >
        {/* Section Header */}
        <motion.div
          className="mb-24 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-xs font-medium tracking-[0.35em] uppercase"
            style={{
              color: '#C7A064',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontVariantCaps: 'all-small-caps',
            }}
          >
            What Our Community Says
          </span>
        </motion.div>

        {/* Staggered Testimonial Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 items-start">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{
                duration: 0.9,
                delay: testimonial.motionDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                marginTop:
                  index === 0
                    ? '0px'
                    : index === 1
                      ? '48px'
                      : '16px',
              }}
              className="hidden md:block"
            >
              <div
                className="testimonial-card-float group relative rounded-3xl px-10 py-12"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(234, 217, 195, 0.25)',
                  animation: 'testimonial-float 6s ease-in-out infinite',
                  animationDelay: testimonial.floatDelay,
                  transition:
                    'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-6px)';
                  el.style.boxShadow =
                    '0 24px 48px rgba(52, 42, 36, 0.08), 0 8px 24px rgba(199, 160, 100, 0.06)';
                  el.style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = '';
                  el.style.boxShadow = '';
                  el.style.animationPlayState = 'running';
                }}
              >
                {/* Decorative Open Quote Mark */}
                <span
                  className="absolute top-6 left-8 select-none leading-none"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '5rem',
                    color: '#C7A064',
                    opacity: 0.1,
                  }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Testimonial Text */}
                <p
                  className="relative z-10 mt-8 mb-8 text-lg lg:text-xl leading-relaxed italic"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#493E36',
                  }}
                >
                  {testimonial.quote}
                </p>

                {/* Star Rating */}
                <div className="mb-5">
                  <StarRating count={testimonial.stars} />
                </div>

                {/* Customer Name */}
                <p
                  className="text-sm tracking-wide"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    color: '#493E36',
                    opacity: 0.7,
                    fontWeight: 400,
                  }}
                >
                  &mdash; {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Mobile layout — no stagger offset */}
          {testimonials.map((testimonial) => (
            <motion.div
              key={`mobile-${testimonial.name}`}
              initial={{ opacity: 0, y: 50 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{
                duration: 0.9,
                delay: testimonial.motionDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="md:hidden"
            >
              <div
                className="testimonial-card-float group relative rounded-3xl px-10 py-12"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(234, 217, 195, 0.25)',
                  animation: 'testimonial-float 6s ease-in-out infinite',
                  animationDelay: testimonial.floatDelay,
                  transition:
                    'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Decorative Open Quote Mark */}
                <span
                  className="absolute top-6 left-8 select-none leading-none"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '5rem',
                    color: '#C7A064',
                    opacity: 0.1,
                  }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Testimonial Text */}
                <p
                  className="relative z-10 mt-8 mb-8 text-lg lg:text-xl leading-relaxed italic"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#493E36',
                  }}
                >
                  {testimonial.quote}
                </p>

                {/* Star Rating */}
                <div className="mb-5">
                  <StarRating count={testimonial.stars} />
                </div>

                {/* Customer Name */}
                <p
                  className="text-sm tracking-wide"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    color: '#493E36',
                    opacity: 0.7,
                    fontWeight: 400,
                  }}
                >
                  &mdash; {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
