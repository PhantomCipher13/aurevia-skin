'use client';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Serums', href: '/shop' },
    { label: 'Moisturizers', href: '/shop' },
    { label: 'Mists & Toners', href: '/shop' },
    { label: 'Gift Sets', href: '/shop' },
  ],
  Company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Ingredients', href: '/#ingredients' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
  ],
  Help: [
    { label: 'FAQ', href: '/contact' },
    { label: 'Shipping', href: '/contact' },
    { label: 'Returns', href: '/contact' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

const socialIcons = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.808-2.425.853 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.481 1.806 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.134-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
];

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#342A24' }}>
      {/* ── TOP SECTION: Brand Watermark Statement ── */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: '1px solid rgba(234,217,195,0.08)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-20 text-center">
          {/* Large watermark text */}
          <h2
            className="text-7xl lg:text-9xl font-bold tracking-[0.15em] uppercase select-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: 'rgba(234,217,195,0.08)',
              lineHeight: 1,
              marginBottom: '1.5rem',
            }}
          >
            AUREVIA
          </h2>
          {/* Tagline */}
          <p
            className="text-sm lg:text-base tracking-wide max-w-md mx-auto"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              color: '#EAD9C3',
              fontWeight: 300,
              lineHeight: 1.8,
              letterSpacing: '0.04em',
            }}
          >
            Luxury skincare crafted for naturally radiant skin.
          </p>
        </div>
      </div>

      {/* ── MAIN SECTION: 5-Column Grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <h3
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#EAD9C3',
                marginBottom: '1.25rem',
                fontWeight: 400,
              }}
            >
              Aurevia Skin
            </h3>
            <p
              className="text-[12px] leading-[1.8] max-w-[240px]"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                color: '#EAD9C3',
                opacity: 0.55,
              }}
            >
              Where science meets indulgence. Each formulation is a testament to
              our belief that skincare should be an act of luxury — effortless,
              refined, and transformative.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
                color: '#C7A064',
                marginBottom: '1.5rem',
              }}
            >
              Shop
            </h4>
            <ul>
              {footerLinks.Shop.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block transition-all duration-300"
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '12px',
                      color: '#EAD9C3',
                      opacity: 0.7,
                      marginBottom: '0.75rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#EAD9C3';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
                color: '#C7A064',
                marginBottom: '1.5rem',
              }}
            >
              Company
            </h4>
            <ul>
              {footerLinks.Company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block transition-all duration-300"
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '12px',
                      color: '#EAD9C3',
                      opacity: 0.7,
                      marginBottom: '0.75rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#EAD9C3';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
                color: '#C7A064',
                marginBottom: '1.5rem',
              }}
            >
              Help
            </h4>
            <ul>
              {footerLinks.Help.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block transition-all duration-300"
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '12px',
                      color: '#EAD9C3',
                      opacity: 0.7,
                      marginBottom: '0.75rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#EAD9C3';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Stay Connected */}
          <div>
            <h4
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
                color: '#C7A064',
                marginBottom: '1.5rem',
              }}
            >
              Stay Connected
            </h4>
            <div className="flex items-center gap-5">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="transition-colors duration-300"
                  style={{ color: '#EAD9C3' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C7A064';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#EAD9C3';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ borderTop: '1px solid rgba(234,217,195,0.15)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[10px] tracking-wider"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              color: '#EAD9C3',
              opacity: 0.4,
            }}
          >
            &copy; 2024 AUREVIA SKIN. All rights reserved.
          </p>

          <button
            onClick={handleBackToTop}
            className="group flex items-center gap-2 transition-colors duration-300 cursor-pointer"
            style={{ color: '#EAD9C3' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C7A064';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#EAD9C3';
            }}
          >
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              Back to Top
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
