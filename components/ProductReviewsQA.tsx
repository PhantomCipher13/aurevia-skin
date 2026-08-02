"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1] as const;

/* ─── Types ──────────────────────────────────────────── */
interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  skinType?: string;
  concern?: string;
  /** Photos the customer attached — shown as a photo grid in the review */
  photos?: string[];
  /** Which product image this review is about */
  productImage: string;
  monthsUsed?: number;
  ageBracket?: string;
}

interface QA {
  id: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answer: string;
  answeredBy: "Brand" | "Customer";
  votes: number;
}

interface Props {
  productSlug: string;
  productName: string;
  productImage: string;
  rating: number;
  reviewCount: number;
}

/* ─── Reviews keyed by product slug ──────────────────── */
const REVIEWS_BY_SLUG: Record<string, Review[]> = {
  "radiance-serum": [
    {
      id: "r1", name: "Priya M.", location: "Mumbai", rating: 5, date: "12 Jul 2026",
      title: "Literally transformed my skin in 2 weeks",
      body: "I've tried so many serums but this one actually works. My skin looks noticeably brighter and my dark spots from old acne have faded significantly. The texture is lightweight and absorbs beautifully — no stickiness. I wear it under my SPF every morning now. These photos are literally 3 weeks apart.",
      verified: true, helpful: 47, skinType: "Combination", concern: "Dark spots, dullness",
      photos: ["/images/skin-before.jpg", "/images/skin-after.jpg", "/images/product-radiance-serum.png"],
      productImage: "/images/product-radiance-serum.png", monthsUsed: 2, ageBracket: "25–34",
    },
    {
      id: "r2", name: "Ananya K.", location: "Delhi", rating: 5, date: "5 Jul 2026",
      title: "Best serum I've ever used — the glow is real",
      body: "The glow from this serum is real. People keep asking me what I'm doing differently. I've been using it for 6 weeks and my skin tone is so much more even. The hyaluronic acid in it keeps me hydrated all day even in the Delhi heat. Worth every rupee.",
      verified: true, helpful: 38, skinType: "Dry", concern: "Hydration, glow",
      photos: ["/images/product-radiance-serum.png"],
      productImage: "/images/product-radiance-serum.png", monthsUsed: 1, ageBracket: "18–24",
    },
    {
      id: "r3", name: "Sneha R.", location: "Bangalore", rating: 4, date: "28 Jun 2026",
      title: "Lovely glow, slightly pricey but worth it",
      body: "The results are undeniable — my skin is glowing and the texture feels so soft. I'm giving 4 stars only because the bottle runs out faster than I expected at this price point. That said, a little goes a long way so I'm on my second purchase already!",
      verified: true, helpful: 22, skinType: "Normal", concern: "General skincare",
      photos: ["/images/product-radiance-serum.png"],
      productImage: "/images/product-radiance-serum.png", monthsUsed: 2, ageBracket: "25–34",
    },
    {
      id: "r4", name: "Kavya S.", location: "Hyderabad", rating: 5, date: "20 Jun 2026",
      title: "Game changer for hyperpigmentation",
      body: "I've had stubborn hyperpigmentation from years of sun exposure and nothing worked until this. Combined with their SPF, I've seen a 60% improvement in 8 weeks. It's now a permanent part of my routine. My dermatologist is impressed!",
      verified: true, helpful: 31, skinType: "Oily", concern: "Hyperpigmentation",
      photos: ["/images/skin-after.jpg", "/images/product-radiance-serum.png"],
      productImage: "/images/product-radiance-serum.png", monthsUsed: 3, ageBracket: "35–44",
    },
  ],
  "cloud-cream": [
    {
      id: "r1", name: "Meera J.", location: "Jaipur", rating: 5, date: "8 Jul 2026",
      title: "Perfect for Indian summers — actually hydrating!",
      body: "I never thought I'd find a moisturiser that's actually hydrating without feeling heavy in our climate. This cloud cream melts into skin, gives a soft matte finish and keeps my skin comfortable all day even in 40-degree heat. It's extraordinary.",
      verified: true, helpful: 63, skinType: "Oily", concern: "Lightweight hydration",
      photos: ["/images/product-cloud-cream.png"],
      productImage: "/images/product-cloud-cream.png", monthsUsed: 2, ageBracket: "25–34",
    },
    {
      id: "r2", name: "Pooja L.", location: "Ahmedabad", rating: 5, date: "1 Jul 2026",
      title: "My eczema-prone skin finally loves a moisturiser",
      body: "I started using this after my dermatologist recommended ceramide-based moisturisers for my eczema-prone skin. The relief was almost immediate — no more tightness, no flaking, and my eczema patches are calmer than they've ever been.",
      verified: true, helpful: 41, skinType: "Dry/Eczema-prone", concern: "Barrier repair",
      photos: ["/images/product-cloud-cream.png", "/images/skin-after.jpg"],
      productImage: "/images/product-cloud-cream.png", monthsUsed: 4, ageBracket: "18–24",
    },
    {
      id: "r3", name: "Simran B.", location: "Chandigarh", rating: 5, date: "22 Jun 2026",
      title: "Worth every rupee — genuinely dreamy texture",
      body: "Yes it's expensive but you get what you pay for. My skin is the most hydrated it's been in years. I use it morning and night and go through one jar in about 2 months. The texture is genuinely dreamy — like applying a light cloud.",
      verified: true, helpful: 27, skinType: "Combination", concern: "Hydration",
      photos: ["/images/product-cloud-cream.png"],
      productImage: "/images/product-cloud-cream.png", monthsUsed: 1, ageBracket: "35–44",
    },
  ],
  "vitamin-c-serum": [
    {
      id: "r1", name: "Rhea T.", location: "Pune", rating: 5, date: "10 Jul 2026",
      title: "Most stable Vitamin C formula I've tried",
      body: "I've gone through 5 different Vitamin C serums that all oxidised quickly and turned orange. This one stays clear even after 3 months! The formula doesn't sting or irritate my sensitive skin, and my tan has definitely faded.",
      verified: true, helpful: 52, skinType: "Sensitive", concern: "Tan, brightening",
      photos: ["/images/product-vitamin-c-serum.png", "/images/skin-before.jpg", "/images/skin-after.jpg"],
      productImage: "/images/product-vitamin-c-serum.png", monthsUsed: 3, ageBracket: "25–34",
    },
    {
      id: "r2", name: "Ishita V.", location: "Chennai", rating: 5, date: "3 Jul 2026",
      title: "20% Vitamin C without the irritation — finally!",
      body: "20% without the irritation — I didn't believe it was possible. My skin adjusted in just one week and now I use it every morning. The ferulic acid combination really does boost efficacy — I can tell because my skin has never looked so even-toned.",
      verified: true, helpful: 29, skinType: "Normal", concern: "Even skin tone",
      photos: ["/images/product-vitamin-c-serum.png"],
      productImage: "/images/product-vitamin-c-serum.png", monthsUsed: 2, ageBracket: "35–44",
    },
  ],
};

/* Default reviews for any unlisted product */
const DEFAULT_REVIEWS: Review[] = [
  {
    id: "d1", name: "Aishwarya P.", location: "Mumbai", rating: 5, date: "14 Jul 2026",
    title: "Absolutely love this — my skin has genuinely changed",
    body: "I've been using this for 6 weeks now and the results are visible. My skin is smoother, more hydrated and people keep asking if I've had a facial. The formula is clean, absorbs well and doesn't irritate my sensitive skin at all.",
    verified: true, helpful: 34, skinType: "Sensitive", concern: "Overall skin health",
    photos: ["/images/skin-before.jpg", "/images/skin-after.jpg"],
    productImage: "/images/product-radiance-serum.png", monthsUsed: 2, ageBracket: "25–34",
  },
  {
    id: "d2", name: "Ritu S.", location: "Delhi", rating: 5, date: "7 Jul 2026",
    title: "Best skincare purchase I've made this year",
    body: "Genuinely surprised by how effective this is. I've tried many luxury brands and this performs better than products costing twice as much. I appreciate that the ingredients are science-backed. Already ordered my second one.",
    verified: true, helpful: 28, skinType: "Normal", concern: "Anti-aging",
    photos: ["/images/skin-after.jpg"],
    productImage: "/images/product-cloud-cream.png", monthsUsed: 3, ageBracket: "35–44",
  },
  {
    id: "d3", name: "Pallavi M.", location: "Bangalore", rating: 4, date: "29 Jun 2026",
    title: "Visible results within a month",
    body: "I started this after reading the ingredient explanation on their website and it convinced me. The ceramide combination is well-researched and I can see the difference. My skin barrier feels stronger and I'm experiencing less sensitivity.",
    verified: true, helpful: 19, skinType: "Combination", concern: "Barrier repair",
    photos: ["/images/product-radiance-serum.png"],
    productImage: "/images/product-barrier-mist.png", monthsUsed: 1, ageBracket: "25–34",
  },
  {
    id: "d4", name: "Neha K.", location: "Pune", rating: 5, date: "20 Jun 2026",
    title: "Premium product, premium results",
    body: "The packaging alone is beautiful but what matters is what's inside — and this delivers. I've been consistent with it for 2 months and my skin has never looked better. My friends keep asking what I'm doing and I happily say it's AUREVIA.",
    verified: true, helpful: 22, skinType: "Oily", concern: "Texture, pores",
    photos: ["/images/product-night-oil.png", "/images/skin-after.jpg"],
    productImage: "/images/product-night-oil.png", monthsUsed: 2, ageBracket: "18–24",
  },
];

/* ─── Q&A ─────────────────────────────────────────────── */
const DEFAULT_QA: QA[] = [
  { id: "q1", question: "Is this safe for sensitive skin?", askedBy: "Shruti K.", askedDate: "Jun 2026", answer: "Yes! Our formulas are dermatologist tested and free from synthetic fragrance, parabens and harsh sulphates — the most common irritants for sensitive skin. We always recommend a 24-hour patch test behind the ear before full use.", answeredBy: "Brand", votes: 14 },
  { id: "q2", question: "Can I use this during pregnancy?", askedBy: "Nandita R.", askedDate: "Jun 2026", answer: "We always recommend consulting your OB-GYN or dermatologist during pregnancy, as individual sensitivities vary. Our formulas avoid high-risk ingredients like high-dose retinoids and salicylic acid, but please check with your doctor.", answeredBy: "Brand", votes: 22 },
  { id: "q3", question: "How long does one bottle last?", askedBy: "Meghna P.", askedDate: "May 2026", answer: "With daily use (once or twice per day, 3–4 drops or a pea-sized amount), most products last 6–8 weeks. If you're using it just once daily it can stretch to 3 months!", answeredBy: "Customer", votes: 11 },
  { id: "q4", question: "What's the best order to layer skincare?", askedBy: "Tara V.", askedDate: "May 2026", answer: "General rule: thinnest to thickest consistency. Cleanser → Toner → Serum → Eye cream → Moisturiser → SPF (morning only). Wait 60 seconds between steps to allow each product to fully absorb.", answeredBy: "Brand", votes: 31 },
  { id: "q5", question: "Can I use multiple AUREVIA products together?", askedBy: "Kritika D.", askedDate: "Apr 2026", answer: "Absolutely — our products are formulated to work harmoniously together. The morning routine (Vitamin C + Cloud Cream + SPF) and evening routine (Retinol + Night Oil) are our most popular combinations.", answeredBy: "Brand", votes: 18 },
  { id: "q6", question: "Is there a return policy if it doesn't work for me?", askedBy: "Meenakshi R.", askedDate: "Apr 2026", answer: "Yes! We offer a 30-day satisfaction guarantee. If you're not happy with your results, contact us at support@aureviaskin.com and we'll arrange a full refund — no questions asked.", answeredBy: "Brand", votes: 25 },
];

/* ─── Sub-components ──────────────────────────────────── */
function StarRating({ rating, size = 14, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = interactive ? (hovered || rating) > i : rating > i;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 14 14"
            fill={filled ? "#C7A064" : "none"} stroke="#C7A064" strokeWidth="0.9"
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(i + 1)}>
            <path d="M7 1l1.56 3.17L12 4.64l-2.5 2.43.59 3.43L7 8.75l-3.09 1.75.59-3.43L2 4.64l3.44-.47L7 1z" />
          </svg>
        );
      })}
    </div>
  );
}

function RatingBar({ count, total, stars }: { count: number; total: number; stars: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5 group cursor-default">
      <span className="text-[11px] w-2.5 text-right" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>{stars}</span>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="#C7A064"><path d="M4.5 0.5l1 2 2.3.33-1.65 1.6.39 2.27L4.5 5.5 2.46 6.7l.39-2.27L.25 2.83 2.5 2.5z" /></svg>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(199,160,100,0.12)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.1 }}
          className="h-full rounded-full" style={{ background: "#C7A064" }} />
      </div>
      <span className="text-[11px] w-4 text-right" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>{count}</span>
    </div>
  );
}

/* Photo lightbox */
function PhotoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="relative max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt="Review photo" width={700} height={700} className="object-contain max-h-[85vh] w-auto" />
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
          style={{ background: "rgba(0,0,0,0.5)" }}>✕</button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main component ──────────────────────────────────── */
export default function ProductReviewsQA({ productSlug, productImage }: Props) {
  const [activeTab, setActiveTab] = useState<"reviews" | "qa">("reviews");
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showQAForm, setShowQAForm] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, title: "", body: "", skinType: "", ageBracket: "" });
  const [qaForm, setQaForm] = useState({ name: "", question: "" });
  const [submitted, setSubmitted] = useState<"review" | "qa" | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "critical">("recent");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const reviews = REVIEWS_BY_SLUG[productSlug] || DEFAULT_REVIEWS;
  const qa = DEFAULT_QA;

  const sortedReviews = [...reviews]
    .filter(r => filterRating === null || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful;
      if (sortBy === "critical") return a.rating - b.rating;
      return 0; // recent = original order
    });

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({ stars: n, count: reviews.filter(r => r.rating === n).length }));

  const inputStyle = { background: "#FFFFFF", border: "1px solid #EAD9C3", color: "#342A24", fontFamily: "var(--font-body)" };

  return (
    <section className="py-20 px-6" style={{ background: "#FBF8F4", borderTop: "1px solid #EAD9C3" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header + rating summary */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase font-semibold mb-2"
              style={{ fontFamily: "var(--font-body)", color: "#C7A064" }}>Community</p>
            <h2 className="text-[28px] leading-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#342A24", fontWeight: 400 }}>
              Reviews & Questions
            </h2>
          </div>

          {/* Rating card */}
          <div className="p-5 rounded-2xl flex items-center gap-6 flex-shrink-0"
            style={{ background: "#F6EEE4", border: "1px solid #EAD9C3" }}>
            <div className="text-center">
              <p className="text-[44px] font-light leading-none mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>{avgRating.toFixed(1)}</p>
              <StarRating rating={avgRating} size={13} />
              <p className="text-[10px] mt-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>
                {reviews.length} verified reviews
              </p>
            </div>
            <div className="space-y-1.5 min-w-[150px]">
              {ratingCounts.map(rc => (
                <button key={rc.stars} onClick={() => setFilterRating(filterRating === rc.stars ? null : rc.stars)}
                  className="w-full transition-opacity hover:opacity-80"
                  style={{ opacity: filterRating && filterRating !== rc.stars ? 0.4 : 1 }}>
                  <RatingBar stars={rc.stars} count={rc.count} total={reviews.length} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: "#F6EEE4", border: "1px solid #EAD9C3" }}>
          {(["reviews", "qa"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-6 py-2.5 rounded-lg text-[11px] tracking-[0.08em] uppercase font-semibold transition-all"
              style={{
                background: activeTab === tab ? "#342A24" : "transparent",
                color: activeTab === tab ? "#FFFFFF" : "#493E36",
                fontFamily: "var(--font-body)",
              }}>
              {tab === "reviews" ? `Reviews (${reviews.length})` : `Q&A (${qa.length})`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── REVIEWS TAB ── */}
          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              {/* Top row: sort + filter + write btn */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Filter active */}
                {filterRating && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px]"
                    style={{ background: "rgba(199,160,100,0.1)", border: "1px solid rgba(199,160,100,0.2)", fontFamily: "var(--font-body)", color: "#C7A064" }}>
                    ★ {filterRating} stars only
                    <button onClick={() => setFilterRating(null)} className="ml-1 hover:opacity-70">✕</button>
                  </div>
                )}
                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 rounded-xl text-[11px] outline-none"
                  style={{ background: "#F6EEE4", border: "1px solid #EAD9C3", color: "#342A24", fontFamily: "var(--font-body)" }}>
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="critical">Critical First</option>
                </select>
                <div className="flex-1" />
                <button onClick={() => setShowReviewForm(v => !v)}
                  className="px-5 py-2.5 rounded-full text-[10px] tracking-[0.12em] uppercase font-semibold transition-all hover:shadow-md active:scale-95"
                  style={{ background: "#342A24", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>
                  ✎ Write a Review
                </button>
              </div>

              {/* Review form */}
              <AnimatePresence>
                {showReviewForm && submitted !== "review" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 rounded-2xl overflow-hidden" style={{ border: "1px solid #EAD9C3" }}>
                    <div className="p-6" style={{ background: "#F6EEE4" }}>
                      <h3 className="text-[17px] mb-5" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>
                        Share Your Experience
                      </h3>
                      {/* Star picker */}
                      <div className="mb-5">
                        <p className="text-[10px] tracking-[0.1em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>
                          Your Rating *
                        </p>
                        <StarRating rating={reviewForm.rating} size={28} interactive
                          onRate={n => setReviewForm(f => ({ ...f, rating: n }))} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Your Name *</p>
                          <input value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Priya M." className="w-full px-4 py-3 rounded-xl text-[13px] outline-none" style={inputStyle} />
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Skin Type</p>
                          <select value={reviewForm.skinType} onChange={e => setReviewForm(f => ({ ...f, skinType: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl text-[13px] outline-none" style={inputStyle}>
                            <option value="">Select...</option>
                            <option>Dry</option><option>Oily</option><option>Combination</option>
                            <option>Normal</option><option>Sensitive</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Age Bracket</p>
                          <select value={reviewForm.ageBracket} onChange={e => setReviewForm(f => ({ ...f, ageBracket: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl text-[13px] outline-none" style={inputStyle}>
                            <option value="">Select...</option>
                            <option>18–24</option><option>25–34</option><option>35–44</option><option>45+</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Months Used</p>
                          <select className="w-full px-4 py-3 rounded-xl text-[13px] outline-none" style={inputStyle}>
                            <option>Less than 1 month</option><option>1–2 months</option>
                            <option>3–6 months</option><option>6+ months</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Review Title *</p>
                        <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="Summarise your experience..." className="w-full px-4 py-3 rounded-xl text-[13px] outline-none" style={inputStyle} />
                      </div>
                      <div className="mb-5">
                        <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Your Review *</p>
                        <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} rows={4}
                          placeholder="Tell us about your skin concerns, how you used this product and the results you saw..."
                          className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none" style={inputStyle} />
                      </div>
                      {/* Photo upload hint */}
                      <div className="mb-5 px-4 py-3 rounded-xl text-[12px] flex items-center gap-3"
                        style={{ background: "rgba(199,160,100,0.06)", border: "1px dashed rgba(199,160,100,0.3)", color: "#493E36", fontFamily: "var(--font-body)" }}>
                        <span style={{ fontSize: 20 }}>📷</span>
                        <span>You can attach up to 3 photos of your results. <span style={{ color: "#C7A064" }}>Upload photos</span></span>
                      </div>
                      <button onClick={() => { if (reviewForm.name && reviewForm.title && reviewForm.body) { setSubmitted("review"); setShowReviewForm(false); } }}
                        className="px-8 py-3 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold active:scale-95 transition-all"
                        style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>
                        Submit Review →
                      </button>
                    </div>
                  </motion.div>
                )}

                {submitted === "review" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-8 p-5 rounded-2xl text-center"
                    style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)" }}>
                    <p className="text-[15px] font-medium mb-1" style={{ fontFamily: "var(--font-body)", color: "#16a34a" }}>✓ Thank you for your review!</p>
                    <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>Your review will appear after moderation (usually within 24 hours).</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reviews list */}
              {sortedReviews.length === 0 ? (
                <p className="text-center py-12 text-[14px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                  No reviews match your filter. <button onClick={() => setFilterRating(null)} className="underline" style={{ color: "#C7A064" }}>Clear filter</button>
                </p>
              ) : (
                <div className="space-y-6">
                  {sortedReviews.map((review, i) => (
                    <motion.div key={review.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: "#FFFFFF", border: "1px solid rgba(199,160,100,0.1)", boxShadow: "0 2px 12px rgba(52,42,36,0.04)" }}>

                      {/* Review header */}
                      <div className="p-5 pb-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-medium flex-shrink-0"
                              style={{ background: "linear-gradient(135deg, rgba(199,160,100,0.2), rgba(199,160,100,0.08))", color: "#C7A064", fontFamily: "var(--font-heading)" }}>
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{review.name}</p>
                                {review.verified && (
                                  <span className="text-[8px] tracking-[0.08em] uppercase font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.12)", fontFamily: "var(--font-body)" }}>
                                    ✓ Verified Purchase
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                                {review.location} · {review.date}
                              </p>
                            </div>
                          </div>

                          {/* Product image thumbnail — right side */}
                          <div className="flex-shrink-0 flex flex-col items-center gap-1">
                            <div className="w-14 h-14 rounded-xl overflow-hidden"
                              style={{ background: "#F6EEE4", border: "1.5px solid #EAD9C3" }}>
                              <Image src={review.productImage} alt="Product reviewed"
                                width={56} height={56} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Stars row */}
                        <div className="flex items-center gap-3 mb-3">
                          <StarRating rating={review.rating} />
                          {review.monthsUsed && (
                            <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                              Used for {review.monthsUsed} month{review.monthsUsed > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        {/* Skin type / concern / age tags */}
                        <div className="flex gap-2 flex-wrap mb-3">
                          {review.skinType && (
                            <span className="text-[9px] tracking-[0.05em] px-2.5 py-1 rounded-full font-medium"
                              style={{ background: "rgba(199,160,100,0.08)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                              Skin Type: {review.skinType}
                            </span>
                          )}
                          {review.concern && (
                            <span className="text-[9px] tracking-[0.05em] px-2.5 py-1 rounded-full font-medium"
                              style={{ background: "rgba(199,160,100,0.08)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                              Concern: {review.concern}
                            </span>
                          )}
                          {review.ageBracket && (
                            <span className="text-[9px] tracking-[0.05em] px-2.5 py-1 rounded-full font-medium"
                              style={{ background: "rgba(73,62,54,0.06)", color: "#493E36", fontFamily: "var(--font-body)" }}>
                              Age: {review.ageBracket}
                            </span>
                          )}
                        </div>

                        {/* Title + body */}
                        <h4 className="text-[15px] font-semibold mb-2" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{review.title}</h4>
                        <p className="text-[13px] leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.75 }}>{review.body}</p>
                      </div>

                      {/* Customer photos — PROMINENT grid like real review sites */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="px-5 pb-4">
                          <p className="text-[9px] tracking-[0.1em] uppercase font-semibold mb-2.5"
                            style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                            Customer Photos ({review.photos.length})
                          </p>
                          <div className="flex gap-2.5 flex-wrap">
                            {review.photos.map((photo, pi) => (
                              <button key={pi} onClick={() => setLightboxSrc(photo)}
                                className="relative overflow-hidden rounded-xl transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                                style={{ width: 90, height: 90, flexShrink: 0, border: "2px solid #EAD9C3" }}>
                                <Image src={photo} alt={`Review photo ${pi + 1}`} fill
                                  className="object-cover" sizes="90px" />
                                {/* Overlay hint */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                  style={{ background: "rgba(52,42,36,0.35)" }}>
                                  <span className="text-white text-[18px]">🔍</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer: helpful */}
                      <div className="flex items-center gap-4 px-5 py-3.5"
                        style={{ borderTop: "1px solid rgba(199,160,100,0.07)", background: "rgba(251,248,244,0.5)" }}>
                        <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>Helpful?</span>
                        <button
                          onClick={() => setHelpedIds(s => { const n = new Set(s); n.has(review.id) ? n.delete(review.id) : n.add(review.id); return n; })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all"
                          style={{
                            background: helpedIds.has(review.id) ? "rgba(199,160,100,0.12)" : "rgba(73,62,54,0.04)",
                            color: helpedIds.has(review.id) ? "#C7A064" : "rgba(73,62,54,0.5)",
                            border: `1px solid ${helpedIds.has(review.id) ? "rgba(199,160,100,0.3)" : "transparent"}`,
                            fontFamily: "var(--font-body)",
                          }}>
                          👍 Yes ({review.helpful + (helpedIds.has(review.id) ? 1 : 0)})
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all"
                          style={{ color: "rgba(73,62,54,0.4)", fontFamily: "var(--font-body)" }}>
                          👎 No
                        </button>
                        <button className="ml-auto text-[11px] hover:text-[#C7A064] transition-colors"
                          style={{ fontFamily: "var(--font-body)", color: "rgba(73,62,54,0.3)" }}>
                          Report
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Q&A TAB ── */}
          {activeTab === "qa" && (
            <motion.div key="qa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              <div className="flex justify-end mb-6">
                <button onClick={() => setShowQAForm(v => !v)}
                  className="px-5 py-2.5 rounded-full text-[10px] tracking-[0.12em] uppercase font-semibold transition-all hover:shadow-md active:scale-95"
                  style={{ background: "#342A24", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>
                  ? Ask a Question
                </button>
              </div>

              <AnimatePresence>
                {showQAForm && submitted !== "qa" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 p-6 rounded-2xl overflow-hidden" style={{ background: "#F6EEE4", border: "1px solid #EAD9C3" }}>
                    <h3 className="text-[16px] mb-4" style={{ fontFamily: "var(--font-heading)", color: "#342A24" }}>Ask the AUREVIA Community</h3>
                    <div className="mb-4">
                      <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Your Name *</p>
                      <input value={qaForm.name} onChange={e => setQaForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Ananya S." className="w-full px-4 py-3 rounded-xl text-[13px] outline-none" style={inputStyle} />
                    </div>
                    <div className="mb-5">
                      <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.5 }}>Your Question *</p>
                      <textarea value={qaForm.question} onChange={e => setQaForm(f => ({ ...f, question: e.target.value }))} rows={3}
                        placeholder="e.g. Can I use this with retinol? Is it safe for oily skin?"
                        className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none" style={inputStyle} />
                    </div>
                    <button onClick={() => { if (qaForm.name && qaForm.question) { setSubmitted("qa"); setShowQAForm(false); } }}
                      className="px-8 py-3 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold active:scale-95 transition-all"
                      style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}>
                      Submit Question →
                    </button>
                  </motion.div>
                )}
                {submitted === "qa" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-8 p-5 rounded-2xl text-center"
                    style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)" }}>
                    <p className="text-[14px] font-medium mb-1" style={{ fontFamily: "var(--font-body)", color: "#16a34a" }}>✓ Question submitted!</p>
                    <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.6 }}>Our team typically responds within 24–48 hours.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {qa.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(199,160,100,0.1)" }}>
                    {/* Question */}
                    <div className="p-5" style={{ background: "#FFFFFF" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(73,62,54,0.06)" }}>❓</div>
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold mb-1" style={{ fontFamily: "var(--font-body)", color: "#342A24" }}>{item.question}</p>
                          <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.4 }}>
                            Asked by {item.askedBy} · {item.askedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Answer */}
                    <div className="p-5" style={{ background: "rgba(199,160,100,0.03)", borderTop: "1px solid rgba(199,160,100,0.08)" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                          style={{ background: item.answeredBy === "Brand" ? "#342A24" : "rgba(199,160,100,0.15)", color: "#C7A064" }}>
                          {item.answeredBy === "Brand" ? "A" : "C"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] tracking-[0.1em] uppercase font-semibold"
                              style={{ fontFamily: "var(--font-body)", color: item.answeredBy === "Brand" ? "#342A24" : "#C7A064" }}>
                              {item.answeredBy === "Brand" ? "AUREVIA SKIN Team" : "Customer"}
                            </span>
                            {item.answeredBy === "Brand" && (
                              <span className="text-[8px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(199,160,100,0.1)", color: "#C7A064", fontFamily: "var(--font-body)" }}>Official</span>
                            )}
                          </div>
                          <p className="text-[13px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.75 }}>{item.answer}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "#493E36", opacity: 0.35 }}>Helpful?</span>
                            <button onClick={() => setVotedIds(s => { const n = new Set(s); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all"
                              style={{
                                background: votedIds.has(item.id) ? "rgba(199,160,100,0.12)" : "rgba(73,62,54,0.04)",
                                color: votedIds.has(item.id) ? "#C7A064" : "rgba(73,62,54,0.4)",
                                border: `1px solid ${votedIds.has(item.id) ? "rgba(199,160,100,0.3)" : "transparent"}`,
                                fontFamily: "var(--font-body)",
                              }}>
                              👍 Yes ({item.votes + (votedIds.has(item.id) ? 1 : 0)})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && <PhotoLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      </AnimatePresence>
    </section>
  );
}
