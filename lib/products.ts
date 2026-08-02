/* ─── AUREVIA SKIN — Full Product Catalog ─── */
// Image note: original 4 products use .png, new 12 use .jpg

export interface ProductVariant {
  id: string;
  name: string;
  size: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  comparePrice?: number;
  image: string;
  gallery?: string[];
  category: string;
  tags: string[];
  details: string;
  ingredients: string;
  howToUse: string;
  size: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  benefits: string[];
  skinType: string[];
  concern: string[];
  variants?: ProductVariant[];
}

export const categories = [
  { slug: "serums", name: "Serums & Treatments", description: "Concentrated actives for targeted results" },
  { slug: "moisturizers", name: "Moisturizers", description: "Hydration for every skin type" },
  { slug: "cleansers", name: "Cleansers", description: "Gentle formulas that respect your barrier" },
  { slug: "toners", name: "Toners & Mists", description: "Balance, prep, and refresh" },
  { slug: "eye-care", name: "Eye Care", description: "Delicate care for the eye area" },
  { slug: "masks", name: "Masks & Exfoliants", description: "Intensive weekly treatments" },
  { slug: "sun-care", name: "Sun Care", description: "Protection without compromise" },
  { slug: "oils", name: "Face Oils & Balms", description: "Botanical-rich nourishment" },
];

export const products: Product[] = [
  /* ── SERUMS ── */
  {
    slug: "radiance-serum",
    name: "Radiance Serum",
    tagline: "Brightens, hydrates & improves glow",
    description: "Our hero brightening formula with triple-weight Hyaluronic Acid and clinical-grade Niacinamide for visibly luminous skin in 2 weeks.",
    price: 1899,
    comparePrice: 2399,
    image: "/images/product-radiance-serum.png",
    category: "serums",
    tags: ["brightening", "hydration", "bestseller"],
    details: "Our signature serum combines triple-weight Hyaluronic Acid with 5% Niacinamide to deeply hydrate and visibly brighten your complexion. The lightweight, fast-absorbing formula delivers visible results in just 2 weeks — proven in clinical studies.",
    ingredients: "Aqua, Hyaluronic Acid (3 molecular weights), Niacinamide 5%, Rice Water Extract, Peptide Complex, Vitamin E, Aloe Vera, Jojoba Oil, Panthenol",
    howToUse: "Apply 2–3 drops to clean, slightly damp face and neck morning and evening. Gently press into skin. Follow with moisturizer.",
    size: "30ml / 1.0 fl oz",
    sku: "AUR-SRM-001",
    stock: 58,
    rating: 4.9,
    reviewCount: 241,
    isBestseller: true,
    isFeatured: true,
    benefits: ["Brightens dull skin", "Plumps with hydration", "Reduces dark spots", "Improves texture"],
    skinType: ["All skin types", "Dry", "Normal", "Oily"],
    concern: ["Dullness", "Uneven tone", "Dehydration", "Dark spots"],
  },
  {
    slug: "vitamin-c-serum",
    name: "Vitamin C Brightening Serum",
    tagline: "20% Vitamin C for visible radiance",
    description: "A potent yet stable 20% Vitamin C (ethyl ascorbic acid) formula that visibly fades dark spots and protects against environmental damage.",
    price: 2199,
    comparePrice: 2799,
    image: "/images/product-vitamin-c-serum.jpg",
    category: "serums",
    tags: ["brightening", "vitamin-c", "antioxidant", "new"],
    details: "Formulated with ethyl ascorbic acid — the most stable, bioavailable form of Vitamin C — this serum delivers 20% active concentration without the irritation. Ferulic acid and Vitamin E amplify antioxidant protection while boosting efficacy.",
    ingredients: "Aqua, Ethyl Ascorbic Acid 20%, Ferulic Acid, Tocopherol (Vitamin E), Niacinamide, Hyaluronic Acid, Glycerin, Panthenol, Allantoin",
    howToUse: "Apply 3–4 drops to clean skin every morning before SPF. Avoid eye area. Start 2–3x per week if new to Vitamin C.",
    size: "30ml / 1.0 fl oz",
    sku: "AUR-SRM-002",
    stock: 42,
    rating: 4.8,
    reviewCount: 118,
    isNew: true,
    benefits: ["Fades dark spots", "Boosts radiance", "Antioxidant protection", "Evens skin tone"],
    skinType: ["Normal", "Dry", "Combination"],
    concern: ["Dark spots", "Dullness", "Uneven tone", "Environmental damage"],
  },
  {
    slug: "retinol-renewal-serum",
    name: "Retinol Renewal Serum",
    tagline: "Gentle retinol for visible anti-aging",
    description: "0.3% encapsulated retinol paired with ceramides and peptides for visible wrinkle reduction without the sensitivity of traditional retinol.",
    price: 2499,
    image: "/images/product-retinol-serum.jpg",
    category: "serums",
    tags: ["anti-aging", "retinol", "renewal"],
    details: "Our encapsulated retinol technology releases active gradually into skin, dramatically reducing irritation while maintaining full efficacy. The ceramide-rich base ensures your barrier stays strong throughout the renewal cycle.",
    ingredients: "Aqua, Encapsulated Retinol 0.3%, Ceramide NP, Ceramide AP, Ceramide EOP, Peptide Complex, Squalane, Bakuchiol, Glycerin, Bisabolol",
    howToUse: "Apply a pea-sized amount to clean skin 2–3 evenings per week. Increase to nightly as tolerated. Always follow with moisturizer. Use SPF in the morning.",
    size: "30ml / 1.0 fl oz",
    sku: "AUR-SRM-003",
    stock: 35,
    rating: 4.7,
    reviewCount: 89,
    benefits: ["Reduces fine lines", "Improves texture", "Boosts cell renewal", "Firms skin"],
    skinType: ["Normal", "Dry", "Combination", "Mature"],
    concern: ["Fine lines & wrinkles", "Uneven texture", "Loss of firmness", "Dullness"],
  },
  {
    slug: "peptide-firming-serum",
    name: "Peptide Firming Serum",
    tagline: "Multi-peptide complex for lifted, firm skin",
    description: "A concentrated blend of 7 peptides targeting elasticity, firmness and the visible signs of aging for a sculpted appearance.",
    price: 2799,
    comparePrice: 3299,
    image: "/images/product-peptide-serum.jpg",
    category: "serums",
    tags: ["anti-aging", "firming", "peptides"],
    details: "Seven clinically studied peptides — including Matrixyl 3000, Argireline, and Leuphasyl — work synergistically to stimulate collagen, relax facial tension, and visibly lift. Hyaluronic acid and glycerin lock in lasting hydration.",
    ingredients: "Aqua, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7 (Matrixyl 3000), Acetyl Hexapeptide-3 (Argireline), Leuphasyl, Hyaluronic Acid, Glycerin, Panthenol",
    howToUse: "Apply 3–4 drops morning and evening after cleansing and toning. Gently press into skin using upward lifting motions.",
    size: "30ml / 1.0 fl oz",
    sku: "AUR-SRM-004",
    stock: 28,
    rating: 4.8,
    reviewCount: 67,
    isFeatured: true,
    benefits: ["Firms and lifts", "Reduces wrinkle depth", "Boosts collagen", "Improves elasticity"],
    skinType: ["All skin types", "Mature", "Normal", "Dry"],
    concern: ["Loss of firmness", "Fine lines & wrinkles", "Sagging skin"],
  },

  /* ── MOISTURIZERS ── */
  {
    slug: "cloud-cream",
    name: "Cloud Cream Moisturizer",
    tagline: "Deep hydration for soft, supple skin",
    description: "Ultra-lightweight whipped cream that melts into skin for 72-hour hydration. Ceramide-enriched formula strengthens the skin barrier.",
    price: 1699,
    image: "/images/product-cloud-cream.png",
    category: "moisturizers",
    tags: ["hydration", "barrier", "bestseller"],
    details: "Ultra-lightweight yet deeply nourishing, this whipped cream moisturizer melts into skin to deliver 72-hour hydration. Ceramide-enriched formula strengthens your skin barrier — proven in clinical studies to increase moisture by 68% in 4 weeks.",
    ingredients: "Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Shea Butter, Squalane, Hyaluronic Acid, Vitamin E, Green Tea Extract, Aloe Vera, Cholesterol, Fatty Acids",
    howToUse: "Apply a pearl-sized amount to face and neck after serum. Gently massage in upward motions until fully absorbed. Morning and evening.",
    size: "50ml / 1.7 fl oz",
    sku: "AUR-CRM-001",
    stock: 71,
    rating: 4.9,
    reviewCount: 318,
    isBestseller: true,
    benefits: ["72-hour hydration", "Strengthens barrier", "Lightweight feel", "Soothing"],
    skinType: ["All skin types", "Dry", "Normal", "Sensitive"],
    concern: ["Dehydration", "Dry skin", "Sensitivity", "Barrier damage"],
  },
  {
    slug: "ceramide-repair-cream",
    name: "Ceramide Repair Cream",
    tagline: "Intensive barrier repair for sensitive skin",
    description: "A rich, deeply restorative formula with the exact ceramide ratio found in healthy human skin — for compromised, sensitised or dry skin.",
    price: 1999,
    image: "/images/product-ceramide-cream.jpg",
    category: "moisturizers",
    tags: ["barrier", "sensitive", "repair", "ceramide"],
    details: "Formulated with three ceramides — NP, AP, and EOP — in the ratio naturally found in healthy human skin (1:2:1 ceramide:cholesterol:fatty acid). This emulates the lipid matrix of your stratum corneum for genuine barrier repair, not just surface hydration.",
    ingredients: "Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Linoleic Acid, Glycerin, Shea Butter, Colloidal Oatmeal, Bisabolol, Allantoin, Panthenol",
    howToUse: "Apply generously to clean skin morning and night. Can be used over serums or treatments as the final moisturising step. Ideal for post-procedure skin.",
    size: "50ml / 1.7 fl oz",
    sku: "AUR-CRM-002",
    stock: 39,
    rating: 4.7,
    reviewCount: 94,
    isNew: true,
    benefits: ["Repairs skin barrier", "Reduces redness", "Calms sensitivity", "Deeply nourishing"],
    skinType: ["Dry", "Sensitive", "Compromised"],
    concern: ["Sensitivity", "Redness", "Dry skin", "Eczema-prone"],
  },

  /* ── CLEANSERS ── */
  {
    slug: "gentle-foam-cleanser",
    name: "Gentle Foam Cleanser",
    tagline: "Purifies without stripping",
    description: "A pH-balanced, SLS-free foam cleanser that removes impurities, sunscreen and makeup while preserving your skin's natural moisture barrier.",
    price: 899,
    image: "/images/product-gentle-cleanser.jpg",
    category: "cleansers",
    tags: ["cleansing", "gentle", "foam"],
    details: "Unlike harsh surfactant cleansers, our gentle foam uses mild amino acid-derived surfactants that match skin's natural pH of 5.5. Removes 99.9% of makeup and sunscreen in one pass while leaving skin feeling soft — never tight or stripped.",
    ingredients: "Aqua, Sodium Cocoyl Glutamate, Cocamidopropyl Betaine, Glycerin, Aloe Vera, Panthenol, Allantoin, Centella Asiatica, Rose Water",
    howToUse: "Pump 2–3 times onto damp hands. Massage gently onto wet face for 30–60 seconds. Rinse thoroughly with lukewarm water. Morning and evening.",
    size: "150ml / 5.0 fl oz",
    sku: "AUR-CLN-001",
    stock: 95,
    rating: 4.8,
    reviewCount: 203,
    isBestseller: true,
    benefits: ["Removes makeup & SPF", "pH balanced", "Non-stripping", "Leaves skin soft"],
    skinType: ["All skin types", "Sensitive", "Dry", "Normal"],
    concern: ["Dehydration", "Sensitivity", "Over-cleansing damage"],
  },
  {
    slug: "micellar-cleansing-water",
    name: "Micellar Cleansing Water",
    tagline: "No-rinse gentle makeup remover",
    description: "Micelle technology effortlessly lifts makeup, SPF and impurities without rubbing. Formulated with soothing rose water and panthenol.",
    price: 799,
    image: "/images/product-micellar-water.jpg",
    category: "cleansers",
    tags: ["cleansing", "micellar", "makeup-remover"],
    details: "French pharmacist-inspired micellar technology uses tiny oil molecules suspended in soft water to attract and lift makeup, pollution and excess sebum. No need to rub or rinse — perfect as a first cleanse before your foaming cleanser.",
    ingredients: "Aqua, Poloxamer 184 (Micelles), Glycerin, Rose Water, Panthenol, Allantoin, Chamomile Extract, Cucumber Extract, Sodium Chloride",
    howToUse: "Apply to a cotton pad and gently press onto face. Wipe away without rubbing. No rinsing required. Can be used as a first cleanse for double-cleansing.",
    size: "200ml / 6.7 fl oz",
    sku: "AUR-CLN-002",
    stock: 68,
    rating: 4.6,
    reviewCount: 147,
    benefits: ["Removes all makeup", "No need to rinse", "Soothes skin", "Zero rubbing"],
    skinType: ["All skin types"],
    concern: ["Makeup removal", "Sensitivity", "Time-saving"],
  },

  /* ── TONERS & MISTS ── */
  {
    slug: "barrier-mist",
    name: "Dew Barrier Mist",
    tagline: "Refreshes, soothes & protects",
    description: "A fine micro-mist that instantly refreshes and soothes skin while reinforcing your moisture barrier. Perfect for all-day hydration.",
    price: 1199,
    image: "/images/product-barrier-mist.png",
    category: "toners",
    tags: ["mist", "hydration", "bestseller", "barrier"],
    details: "A fine micro-mist that instantly refreshes and soothes skin while reinforcing your moisture barrier. Perfect for on-the-go hydration throughout the day, over or under makeup.",
    ingredients: "Rose Water, Centella Asiatica, Ceramides, Glycerin, Panthenol, Cucumber Extract, Chamomile, Sodium PCA",
    howToUse: "Hold 6–8 inches from face and mist evenly. Use throughout the day over makeup or bare skin. Shake gently before use.",
    size: "100ml / 3.4 fl oz",
    sku: "AUR-MST-001",
    stock: 12,
    rating: 4.8,
    reviewCount: 176,
    isBestseller: true,
    benefits: ["Instant hydration", "Sets makeup", "Refreshes on-the-go", "Soothes redness"],
    skinType: ["All skin types"],
    concern: ["Dehydration", "Redness", "Midday refresh"],
  },
  {
    slug: "niacinamide-toner",
    name: "Niacinamide Clarifying Toner",
    tagline: "Minimises pores, controls oil",
    description: "10% Niacinamide + Zinc PCA toner that visibly minimises pores, controls shine and reduces blemishes without stripping.",
    price: 999,
    image: "/images/product-toner.jpg",
    category: "toners",
    tags: ["niacinamide", "pores", "oily-skin", "clarifying"],
    details: "10% pharmaceutical-grade Niacinamide combined with Zinc PCA targets enlarged pores, sebum overproduction and post-acne marks simultaneously. The lightweight, alcohol-free formula absorbs in seconds and layers beautifully under serums and moisturizers.",
    ingredients: "Aqua, Niacinamide 10%, Zinc PCA 1%, Hyaluronic Acid, Witch Hazel (alcohol-free), Glycerin, Allantoin, Green Tea Extract",
    howToUse: "Apply to a cotton pad and sweep over clean face morning and evening. Avoid eye area. Follow with serum or moisturizer.",
    size: "150ml / 5.0 fl oz",
    sku: "AUR-TNR-001",
    stock: 53,
    rating: 4.7,
    reviewCount: 132,
    isNew: true,
    benefits: ["Minimises pores", "Controls oil", "Reduces blemishes", "Brightens"],
    skinType: ["Oily", "Combination", "Normal"],
    concern: ["Large pores", "Oiliness", "Blemishes", "Uneven tone"],
  },

  /* ── OILS ── */
  {
    slug: "night-oil",
    name: "Night Recovery Oil",
    tagline: "Repairs & restores while you sleep",
    description: "A luxurious blend of cold-pressed botanical oils that work overnight to repair, nourish and restore your skin to visibly smoother radiance.",
    price: 2299,
    image: "/images/product-night-oil.png",
    category: "oils",
    tags: ["oils", "night", "bestseller", "anti-aging"],
    details: "A luxurious blend of cold-pressed botanical oils that work overnight to repair, nourish, and restore your skin. Wake up to a visibly smoother, more radiant complexion.",
    ingredients: "Rosehip Seed Oil, Argan Oil, Bakuchiol (natural retinol alternative), Sea Buckthorn Oil, Vitamin C (ascorbyl tetraisopalmitate), Lavender Essential Oil, Jojoba Oil",
    howToUse: "Apply 3–4 drops to cleansed face as the final step in your evening routine. Gently press and pat into skin. Do not rub.",
    size: "30ml / 1.0 fl oz",
    sku: "AUR-OIL-001",
    stock: 34,
    rating: 4.9,
    reviewCount: 198,
    isBestseller: true,
    isFeatured: true,
    benefits: ["Overnight repair", "Reduces fine lines", "Deep nourishment", "Morning glow"],
    skinType: ["Dry", "Normal", "Mature"],
    concern: ["Dryness", "Fine lines", "Dullness", "Lack of radiance"],
  },
  {
    slug: "glow-facial-oil",
    name: "Glow Facial Oil",
    tagline: "Instant glow in 3 drops",
    description: "A lightweight, non-greasy blend of 9 botanical oils rich in fatty acids and antioxidants that gives skin an instant luminous glow.",
    price: 2499,
    comparePrice: 2999,
    image: "/images/product-glow-oil.jpg",
    category: "oils",
    tags: ["glow", "oils", "radiance", "new"],
    details: "This award-winning face oil absorbs in under 60 seconds, leaving zero residue. The biocompatible blend of chia seed, marula, and sea buckthorn oils delivers essential fatty acids and fat-soluble vitamins directly into the lipid bilayer of the skin.",
    ingredients: "Squalane, Marula Oil, Chia Seed Oil, Sea Buckthorn Oil, Rosehip Seed Oil, Vitamin E, Sea Kelp Extract, Calendula CO2 Extract, Chamomile CO2 Extract",
    howToUse: "Press 3 drops between palms to warm, then press gently onto face. Can be mixed into moisturizer or worn alone. Morning or evening.",
    size: "30ml / 1.0 fl oz",
    sku: "AUR-OIL-002",
    stock: 22,
    rating: 4.8,
    reviewCount: 74,
    isNew: true,
    benefits: ["Instant glow", "Non-greasy", "Deeply nourishing", "Fast-absorbing"],
    skinType: ["All skin types", "Dry", "Dull"],
    concern: ["Dullness", "Dryness", "Lack of radiance"],
  },

  /* ── EYE CARE ── */
  {
    slug: "eye-revive-complex",
    name: "Eye Revive Complex",
    tagline: "Brightens, depuffs & firms the eye area",
    description: "A multi-action eye treatment targeting dark circles, puffiness and fine lines with caffeine, peptides and vitamin K.",
    price: 1999,
    image: "/images/product-eye-cream.jpg",
    category: "eye-care",
    tags: ["eye-care", "anti-aging", "firming"],
    details: "Three targeted actives work simultaneously around the delicate eye area: Caffeine constricts blood vessels to reduce dark circles and puffiness; tripeptide EYK strengthens fragile skin and reduces pigmentation; Vitamin K targets under-eye pooling.",
    ingredients: "Aqua, Caffeine, Tripeptide-1 (EYK), Vitamin K2, Hyaluronic Acid, Peptide Complex, Retinol (micro-encapsulated), Colloidal Gold, Arnica Extract",
    howToUse: "Dispense a tiny amount (rice grain size) and gently tap around the orbital bone with ring finger morning and evening. Avoid applying too close to the eye.",
    size: "15ml / 0.5 fl oz",
    sku: "AUR-EYE-001",
    stock: 41,
    rating: 4.8,
    reviewCount: 109,
    isFeatured: true,
    benefits: ["Reduces dark circles", "Depuffs", "Firms eye area", "Minimises crow's feet"],
    skinType: ["All skin types"],
    concern: ["Dark circles", "Puffiness", "Fine lines around eyes", "Drooping"],
  },

  /* ── MASKS ── */
  {
    slug: "deep-hydration-mask",
    name: "Deep Hydration Overnight Mask",
    tagline: "Wake up to glass skin",
    description: "A leave-on sleeping mask with hyaluronic acid and ceramides that works overnight to plump, smooth and restore skin to its most luminous state.",
    price: 1499,
    image: "/images/product-hydrating-mask.jpg",
    category: "masks",
    tags: ["mask", "overnight", "hydration", "sleeping-mask"],
    details: "Apply as the final step 2–3 evenings per week and let our concentrated formula work while you sleep. Triple-weight hyaluronic acid penetrates multiple skin layers while the occlusive seal prevents moisture loss — so you wake up to visibly plumper, more radiant skin.",
    ingredients: "Aqua, Hyaluronic Acid (3 molecular weights), Ceramide NP, Glycerin, Squalane, Centella Asiatica, Allantoin, Beta-glucan, Niacinamide, Honey Extract",
    howToUse: "Apply a generous layer to cleansed skin as the last step in your evening routine 2–3 nights per week. Do not rinse. Wake up, gently massage any excess into skin.",
    size: "75ml / 2.5 fl oz",
    sku: "AUR-MSK-001",
    stock: 47,
    rating: 4.9,
    reviewCount: 156,
    isBestseller: true,
    benefits: ["Overnight plumping", "Glass skin effect", "Intense hydration", "Smoothing"],
    skinType: ["All skin types", "Dry", "Dehydrated"],
    concern: ["Dehydration", "Dullness", "Rough texture"],
  },
  {
    slug: "exfoliating-enzyme-mask",
    name: "Exfoliating Enzyme Mask",
    tagline: "Resurfaces without the scrub",
    description: "Papaya and pineapple enzymes gently dissolve dead skin cells for brighter, smoother skin in 10 minutes — no physical abrasion needed.",
    price: 1299,
    image: "/images/product-enzyme-mask.jpg",
    category: "masks",
    tags: ["mask", "exfoliant", "enzyme", "brightening"],
    details: "Unlike harsh physical scrubs that create micro-tears, enzyme exfoliation works by breaking the peptide bonds between dead skin cells using Papain (papaya) and Bromelain (pineapple). The result: perfectly smooth, bright skin with zero risk of damage. Gentle enough for sensitive types.",
    ingredients: "Aqua, Papain (Papaya Extract), Bromelain (Pineapple Extract), Lactic Acid, Kaolin, Glycerin, Panthenol, Calendula Extract, Allantoin",
    howToUse: "Apply a generous layer to dry skin avoiding eye area. Leave for 5–10 minutes. Rinse thoroughly with lukewarm water. Use 1–2 times per week.",
    size: "75ml / 2.5 fl oz",
    sku: "AUR-MSK-002",
    stock: 33,
    rating: 4.7,
    reviewCount: 88,
    isNew: true,
    benefits: ["Removes dead skin", "Brightens instantly", "Smooths texture", "Gentle exfoliation"],
    skinType: ["All skin types", "Sensitive"],
    concern: ["Dull skin", "Rough texture", "Uneven tone"],
  },

  /* ── SUN CARE ── */
  {
    slug: "mineral-spf50",
    name: "Mineral SPF 50 Sunscreen",
    tagline: "Invisible protection. Zero white cast.",
    description: "A 100% mineral, broad-spectrum SPF 50 PA++++ that disappears into skin with no white cast — formulated for all skin tones.",
    price: 1599,
    comparePrice: 1999,
    image: "/images/product-spf-sunscreen.jpg",
    category: "sun-care",
    tags: ["spf", "mineral", "sunscreen", "protection"],
    details: "Our mineral UV filters — non-nano Zinc Oxide and Titanium Dioxide — sit on the skin surface and physically deflect UVA and UVB rays. The lightweight serum-gel formula is powered by Tinosorb M to eliminate white cast and provide photo-stable, reef-safe protection.",
    ingredients: "Aqua, Zinc Oxide 12%, Titanium Dioxide 6%, Glycerin, Niacinamide, Hyaluronic Acid, Squalane, Cetyl Alcohol, Bisabolol, Allantoin, Vitamin E",
    howToUse: "Apply generously as the final step in your morning routine, after moisturizer. Reapply every 2 hours if outdoors. One quarter teaspoon for face and neck.",
    size: "50ml / 1.7 fl oz",
    sku: "AUR-SPF-001",
    stock: 62,
    rating: 4.8,
    reviewCount: 214,
    isBestseller: true,
    isFeatured: true,
    benefits: ["Broad-spectrum SPF 50", "No white cast", "Reef-safe", "Lightweight wear"],
    skinType: ["All skin types", "Sensitive", "Oily"],
    concern: ["UV protection", "Photoaging", "Sensitive skin SPF"],
  },

  /* ── LIP CARE ── */
  {
    slug: "lip-revival-balm",
    name: "Lip Revival Treatment",
    tagline: "Plumping hydration for perfect lips",
    description: "A peptide-rich lip treatment that hydrates, plumps and protects lips 24 hours — with a glossy finish and SPF 15 protection.",
    price: 699,
    image: "/images/product-lip-balm.jpg",
    category: "oils",
    tags: ["lip", "balm", "plumping", "spf"],
    details: "Beyond basic hydration, our lip treatment uses volumising peptides and hyaluronic acid spheres to subtly plump the lip border while shea butter and squalane melt in for deep moisture. SPF 15 helps prevent further UV-induced lip damage.",
    ingredients: "Squalane, Shea Butter, Castor Oil, Beeswax, Hyaluronic Acid Spheres, Peptide Complex, Vitamin E, SPF 15 (Octinoxate), Peppermint Oil, Vitamin C",
    howToUse: "Apply generously to lips as needed throughout the day. Use as the final step in your skincare routine or alone for instant hydration.",
    size: "10ml / 0.3 fl oz",
    sku: "AUR-LIP-001",
    stock: 87,
    rating: 4.6,
    reviewCount: 93,
    benefits: ["Plumps lips", "24-hour hydration", "SPF protection", "Glossy finish"],
    skinType: ["All skin types"],
    concern: ["Dry/chapped lips", "Loss of lip volume"],
  },
];

/* ── Helper functions ── */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.category.includes(q) ||
      p.concern.some((c) => c.toLowerCase().includes(q))
  );
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug && (p.category === product.category || p.tags.some((t) => product.tags.includes(t))))
    .slice(0, limit);
}
