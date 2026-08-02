-- ============================================================
-- AUREVIA SKIN — Complete Database Schema + Seed Data
-- Paste this entire file into Supabase SQL Editor and Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USER PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins view all addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses USING (auth.uid() = user_id);
CREATE POLICY "Admins view all addresses" ON public.addresses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 3. CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 4. COLLECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active collections" ON public.collections;
DROP POLICY IF EXISTS "Admins manage collections" ON public.collections;
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage collections" ON public.collections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 5. PRODUCTS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  status product_status DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  size TEXT,
  details TEXT,
  ingredients TEXT,
  how_to_use TEXT,
  skin_type TEXT,
  concern TEXT,
  meta_title TEXT,
  meta_description TEXT,
  review_count INTEGER DEFAULT 0,
  review_avg DECIMAL(3,2) DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins manage all products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins manage all products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 6. PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage product images" ON public.product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 7. INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  track_inventory BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change INTEGER NOT NULL,
  reason TEXT,
  admin_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage inventory" ON public.inventory;
DROP POLICY IF EXISTS "Anyone can check stock" ON public.inventory;
CREATE POLICY "Admins manage inventory" ON public.inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "Anyone can check stock" ON public.inventory FOR SELECT USING (TRUE);

-- ============================================================
-- 8. COUPONS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type coupon_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can look up active coupon by code" ON public.coupons;
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Anyone can look up coupon" ON public.coupons FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 9. CART
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.cart(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart;
DROP POLICY IF EXISTS "Users manage own cart items" ON public.cart_items;
CREATE POLICY "Users manage own cart" ON public.cart USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart items" ON public.cart_items USING (
  EXISTS (SELECT 1 FROM public.cart WHERE id = cart_id AND user_id = auth.uid())
);

-- ============================================================
-- 10. ORDERS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending','confirmed','processing','packed','shipped','delivered','cancelled','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending','paid','failed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  tracking_number TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  product_slug TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can track by order number" ON public.orders;

CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can track by order number" ON public.orders FOR SELECT USING (TRUE);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage all orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "Anyone view timeline" ON public.order_timeline FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage timeline" ON public.order_timeline FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 11. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  images TEXT[],
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  verified_purchase BOOLEAN DEFAULT FALSE,
  skin_type TEXT,
  concern TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can add reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins manage all reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Anyone can submit review" ON public.reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage all reviews" ON public.reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 12. WISHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist;
CREATE POLICY "Users manage own wishlist" ON public.wishlist USING (auth.uid() = user_id);

-- ============================================================
-- 13. NEWSLETTER
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter;
DROP POLICY IF EXISTS "Admins view newsletter" ON public.newsletter;
CREATE POLICY "Anyone can subscribe" ON public.newsletter FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins view newsletter" ON public.newsletter FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 14. CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins view messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins view messages" ON public.contact_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 15. BLOG POSTS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  category TEXT,
  tags TEXT[],
  status blog_status DEFAULT 'draft',
  author_name TEXT DEFAULT 'AUREVIA Team',
  author_id UUID REFERENCES public.profiles(id),
  meta_title TEXT,
  meta_description TEXT,
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status ON public.blog_posts(status);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins manage blog" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage blog" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 16. SITE SETTINGS (CMS key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 17. ANALYTICS EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  product_id UUID REFERENCES public.products(id),
  order_id UUID REFERENCES public.orders(id),
  value DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins view analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Anyone can track events" ON public.analytics_events;
CREATE POLICY "Admins view analytics" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "Anyone can track events" ON public.analytics_events FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- 18. PRODUCT Q&A
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_qa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  asked_by TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_qa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published QA" ON public.product_qa FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can ask question" ON public.product_qa FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage QA" ON public.product_qa FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================================
-- 19. SEED DATA — Categories
-- ============================================================
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Serums', 'serums', 'Concentrated treatments for targeted skin concerns', 1),
  ('Moisturizers', 'moisturizers', 'Hydrating creams and lotions for all skin types', 2),
  ('Toners & Mists', 'toners-mists', 'Refreshing toners and setting mists', 3),
  ('Facial Oils', 'facial-oils', 'Nourishing oils for deep skin repair', 4),
  ('Cleansers', 'cleansers', 'Gentle cleansers for all skin types', 5),
  ('Eye Care', 'eye-care', 'Targeted treatments for the delicate eye area', 6),
  ('Masks', 'masks', 'Weekly treatment masks for deep skin care', 7),
  ('Sun Care', 'sun-care', 'Daily sun protection for healthy skin', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 20. SEED DATA — Collections
-- ============================================================
INSERT INTO public.collections (name, slug, description, display_order) VALUES
  ('Bestsellers', 'bestsellers', 'Our most-loved products loved by thousands', 1),
  ('New Arrivals', 'new-arrivals', 'Latest additions to the AUREVIA lineup', 2),
  ('The Glow Edit', 'glow-edit', 'Everything you need for glass skin', 3),
  ('Anti-Aging', 'anti-aging', 'Science-backed formulas for youthful skin', 4),
  ('Sensitive Skin', 'sensitive-skin', 'Gentle formulas for sensitive and reactive skin', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 21. SEED DATA — Products (15 products, prices in INR)
-- ============================================================
INSERT INTO public.products (name, slug, description, long_description, price, sku, is_featured, size, details, ingredients, how_to_use, skin_type, concern, display_order)
SELECT name, slug, description, long_description, price, sku, is_featured, size, details, ingredients, how_to_use, skin_type, concern, display_order
FROM (VALUES
  (
    'Radiance Serum',
    'radiance-serum',
    'Brightens, hydrates & improves glow in 4 weeks',
    'Our bestselling vitamin C serum packed with 10% stabilised ascorbic acid, hyaluronic acid and niacinamide to brighten, hydrate and even skin tone. Clinically tested and dermatologist approved for all skin types.',
    1899.00, 'AUR-SRM-001', TRUE,
    '30ml / 1 fl oz',
    'Fragrance-free · Paraben-free · Dermatologist tested · Suitable for all skin types',
    'Aqua, Ascorbic Acid 10%, Sodium Hyaluronate, Niacinamide 5%, Glycerin, Panthenol, Allantoin, Tocopherol, Citric Acid',
    'Apply 3–4 drops to clean, dry skin morning and evening. Press gently into face, neck and décolletage. Follow with moisturiser and SPF in the morning.',
    'All Skin Types', 'Brightening, Hyperpigmentation, Uneven Tone', 1
  ),
  (
    'Cloud Cream Moisturizer',
    'cloud-cream',
    'Deep 72-hour hydration for soft, supple skin',
    'An ultra-light, fast-absorbing moisturiser that delivers 72-hour hydration. Formulated with ceramides and peptides to strengthen the skin barrier and prevent moisture loss throughout the day.',
    1699.00, 'AUR-CRM-001', TRUE,
    '50ml / 1.7 fl oz',
    'Fragrance-free · Non-comedogenic · Dermatologist tested · For all skin types',
    'Aqua, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Niacinamide, Sodium Hyaluronate, Panthenol, Carbomer',
    'Apply a pearl-sized amount to face and neck morning and evening after serum. Smooth gently in upward circular motions.',
    'All Skin Types', 'Hydration, Dry Skin, Barrier Repair', 2
  ),
  (
    'Dew Barrier Mist',
    'dew-barrier-mist',
    'Refreshes, soothes & protects throughout the day',
    'A refreshing mist that locks in moisture, soothes redness and protects your skin barrier throughout the day. Infused with centella asiatica and rose water for instant calming and hydration.',
    1199.00, 'AUR-MST-001', FALSE,
    '100ml / 3.4 fl oz',
    'Alcohol-free · Fragrance-free · Suitable for sensitive skin',
    'Aqua, Centella Asiatica Extract, Sodium Hyaluronate, Rosa Damascena Water, Panthenol, Glycerin, Aloe Barbadensis Leaf Juice',
    'Shake gently. Hold bottle 20–30cm from face and mist evenly. Use over makeup or on bare skin anytime for a hydration boost.',
    'Sensitive, Dry, Combination', 'Redness, Sensitivity, Hydration', 3
  ),
  (
    'Night Recovery Oil',
    'night-oil',
    'Repairs & restores skin while you sleep',
    'A luxurious blend of plant-based oils with bakuchiol (a natural retinol alternative) and peptides to support skin renewal overnight. Wake up to visibly firmer, more radiant skin.',
    2299.00, 'AUR-OIL-001', TRUE,
    '30ml / 1 fl oz',
    'Vegan · Cruelty-free · Cold-pressed oils · Suitable for dry and mature skin',
    'Squalane, Rosa Canina Seed Oil, Simmondsia Chinensis Seed Oil, Bakuchiol 1%, Peptide Complex, Tocopherol, Evening Primrose Oil',
    'Apply 4–5 drops to face and neck as the last step in your evening routine. Gently press into skin and allow to fully absorb before sleep.',
    'Dry, Mature, Normal', 'Anti-aging, Firmness, Overnight Repair', 4
  ),
  (
    'Vitamin C Brightening Serum',
    'vitamin-c-serum',
    '15% vitamin C for maximum brightening power',
    'A potent vitamin C serum with 15% L-ascorbic acid, ferulic acid and vitamin E for enhanced stability and efficacy. Visibly reduces dark spots and boosts collagen production for brighter, younger-looking skin.',
    2199.00, 'AUR-VCS-001', TRUE,
    '30ml / 1 fl oz',
    'Clinically tested · Vegan · Paraben-free · Suitable for normal to oily skin',
    'Aqua, Ascorbic Acid 15%, Ferulic Acid, Tocopherol, Zinc Sulphate, Sodium Hyaluronate, Glycerin, Citric Acid',
    'Apply 2–3 drops to cleansed skin in the morning before moisturiser. Always follow with SPF. Start with every other day if new to vitamin C.',
    'Normal, Oily, Combination', 'Dark Spots, Dullness, Anti-aging', 5
  ),
  (
    'Retinol Renewal Serum',
    'retinol-serum',
    '0.3% encapsulated retinol for visible anti-aging results',
    'A gentle yet effective encapsulated retinol serum that minimises irritation while delivering clinically proven results. Reduces fine lines, improves skin texture and increases cell turnover for visibly younger-looking skin.',
    2499.00, 'AUR-RTS-001', TRUE,
    '30ml / 1 fl oz',
    'Encapsulated retinol for reduced irritation · Dermatologist tested · Fragrance-free',
    'Aqua, Retinol 0.3% (Encapsulated), Sodium Hyaluronate, Niacinamide, Glycerin, Squalane, Allantoin, Tocopherol',
    'Apply 3–4 drops to face and neck at night only, after cleansing. Avoid eye area. Start 2–3 times per week and increase gradually. Always use SPF during the day.',
    'Normal, Oily, Combination, Mature', 'Fine Lines, Wrinkles, Texture, Anti-aging', 6
  ),
  (
    'Peptide Firming Serum',
    'peptide-serum',
    'Multi-peptide complex for visibly firmer skin',
    'A concentrated peptide serum with 6 clinically studied peptides that signal the skin to produce more collagen and elastin. Visibly firms, plumps and smooths skin texture with consistent use.',
    2799.00, 'AUR-PFS-001', FALSE,
    '30ml / 1 fl oz',
    'Vegan · Cruelty-free · Fragrance-free · For all skin types',
    'Aqua, Acetyl Hexapeptide-3, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Copper Tripeptide-1, Sodium Hyaluronate, Glycerin, Niacinamide',
    'Apply 3–4 drops to clean skin morning and evening. May be mixed with moisturiser or layered under it. Safe for use around eye area.',
    'All Skin Types', 'Firmness, Fine Lines, Loss of Elasticity', 7
  ),
  (
    'Gentle Foam Cleanser',
    'gentle-cleanser',
    'Soft lather, deep cleanse without stripping',
    'A pH-balanced, soap-free foam cleanser that effectively removes makeup, impurities and excess oil without stripping the skin\'s natural moisture. Leaves skin feeling clean, soft and perfectly balanced.',
    899.00, 'AUR-CLN-001', FALSE,
    '150ml / 5.1 fl oz',
    'pH-balanced · Soap-free · Fragrance-free · Suitable for all skin types',
    'Aqua, Cocamidopropyl Betaine, Sodium Lauroyl Sarcosinate, Glycerin, Panthenol, Centella Asiatica Extract, Allantoin, Citric Acid',
    'Wet face with lukewarm water. Pump 1–2 times onto palm and work into a lather. Massage gently onto face for 60 seconds. Rinse thoroughly.',
    'All Skin Types', 'Cleansing, Pore Care', 8
  ),
  (
    'Niacinamide Clarifying Toner',
    'niacinamide-toner',
    '10% niacinamide to refine pores and even tone',
    'A lightweight, alcohol-free toner with 10% niacinamide and zinc that minimises pores, controls excess oil and visibly reduces blemishes. Works to even skin tone and brighten dull skin with consistent use.',
    999.00, 'AUR-TNR-001', FALSE,
    '200ml / 6.8 fl oz',
    'Alcohol-free · Fragrance-free · Non-comedogenic · Suitable for oily and acne-prone skin',
    'Aqua, Niacinamide 10%, Zinc PCA, Sodium Hyaluronate, Glycerin, Panthenol, Allantoin, Potassium Azeloyl Diglycinate',
    'After cleansing, soak a cotton pad and sweep gently across face, avoiding eye area. Or apply directly with palms and pat into skin. Use morning and evening.',
    'Oily, Combination, Acne-prone', 'Pores, Oiliness, Blemishes, Uneven Tone', 9
  ),
  (
    'Mineral SPF 50+ Sunscreen',
    'mineral-spf',
    'Broad spectrum SPF 50+ with zero white cast',
    'A lightweight mineral sunscreen with 100% physical filters that provides broad-spectrum UVA/UVB protection. Developed specifically for Indian skin tones with zero white cast, comfortable texture and antioxidant protection.',
    1799.00, 'AUR-SPF-001', FALSE,
    '50ml / 1.7 fl oz',
    'Mineral filters · PA++++ · No white cast · Water-resistant 80 min · Fragrance-free',
    'Zinc Oxide 15%, Titanium Dioxide 5%, Aqua, Cyclopentasiloxane, Niacinamide, Tocopherol, Sodium Hyaluronate, Glycerin',
    'As the final step in your morning routine, apply generously to face and neck at least 15 minutes before sun exposure. Reapply every 2 hours when outdoors.',
    'All Skin Types', 'Sun Protection, Anti-aging, Hyperpigmentation', 10
  ),
  (
    'Ceramide Repair Cream',
    'ceramide-cream',
    'Intensive barrier repair for dry and damaged skin',
    'A rich, nourishing cream with 3 essential ceramides, cholesterol and fatty acids that mimic the skin\'s natural barrier. Clinically shown to restore the skin barrier and relieve dryness within 24 hours.',
    1999.00, 'AUR-CRC-001', FALSE,
    '50ml / 1.7 fl oz',
    'Fragrance-free · Steroid-free · Suitable for eczema-prone skin · Dermatologist tested',
    'Aqua, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Fatty Acids, Niacinamide, Panthenol',
    'Apply generously to face, neck and body morning and evening. For very dry or irritated skin, apply a thicker layer at night. Safe for sensitive skin and eczema-prone skin.',
    'Dry, Sensitive, Eczema-prone', 'Barrier Repair, Dryness, Sensitivity', 11
  ),
  (
    'Micellar Cleansing Water',
    'micellar-water',
    'Effortless makeup removal with zero rinsing',
    'A gentle micellar cleansing water that dissolves makeup, SPF and impurities in one sweep without rubbing or rinsing. Infused with hyaluronic acid to leave skin hydrated, not stripped.',
    799.00, 'AUR-MCW-001', FALSE,
    '200ml / 6.8 fl oz',
    'No-rinse formula · Fragrance-free · Alcohol-free · Suitable for sensitive skin',
    'Aqua, Poloxamer 184, Glycerin, Sodium Hyaluronate, Panthenol, Disodium EDTA, Phenoxyethanol',
    'Saturate a cotton pad and hold against eye, lip or face for 5–10 seconds. Wipe away gently. No rinsing required. Use as a first cleanse or for quick refresh.',
    'All Skin Types', 'Makeup Removal, Cleansing', 12
  ),
  (
    'Hyaluronic Acid Eye Cream',
    'eye-cream',
    'Plumps, hydrates and brightens the eye area',
    'A gentle yet potent eye cream with triple-weight hyaluronic acid and caffeine to visibly reduce puffiness, dark circles and fine lines around the delicate eye area. Clinically tested and ophthalmologist approved.',
    1499.00, 'AUR-EYE-001', FALSE,
    '15ml / 0.5 fl oz',
    'Ophthalmologist tested · Fragrance-free · Suitable for contact lens wearers',
    'Aqua, Sodium Hyaluronate (High/Mid/Low MW), Caffeine, Peptide Complex, Niacinamide, Vitamin K, Allantoin, Glycerin',
    'Using your ring finger, gently tap a small amount around the entire eye area morning and evening. Do not rub. Use before heavier creams.',
    'All Skin Types', 'Dark Circles, Puffiness, Fine Lines', 13
  ),
  (
    'Enzyme Exfoliating Mask',
    'enzyme-mask',
    'Papaya enzyme mask for instant radiance',
    'A gentle enzyme-based exfoliating mask with papaya and pineapple enzymes that dissolve dead skin cells without physical scrubbing. Leaves skin instantly smoother, brighter and more refined in just 10 minutes.',
    1299.00, 'AUR-MSK-001', FALSE,
    '75ml / 2.5 fl oz',
    'Vegan · Cruelty-free · No physical exfoliants · Suitable for sensitive skin',
    'Aqua, Carica Papaya Fruit Extract, Bromelain (Pineapple Enzyme), Kaolin, Sodium Hyaluronate, Glycerin, Allantoin, Panthenol',
    'Apply a thin layer to clean, dry skin. Leave for 10–15 minutes. Rinse thoroughly with warm water. Use 1–2 times per week. Avoid using with active breakouts.',
    'All Skin Types', 'Texture, Dullness, Pore Refinement', 14
  ),
  (
    'Lip Nourishing Balm',
    'lip-balm',
    'Intensive overnight lip treatment with ceramides',
    'A rich, non-sticky lip balm that heals, hydrates and plumps dry, chapped lips with ceramides, shea butter and hyaluronic acid. Can be used as an overnight lip mask for deeply moisturised lips by morning.',
    499.00, 'AUR-LIP-001', FALSE,
    '15ml / 0.5 fl oz',
    'Fragrance-free · Non-sticky · Safe to ingest · Vegan',
    'Cera Alba, Squalane, Sodium Hyaluronate, Ceramide NP, Butyrospermum Parkii (Shea) Butter, Tocopherol, Castor Oil',
    'Apply liberally throughout the day or use as an overnight lip mask before bed. Reapply as needed for continuous lip comfort.',
    'All Skin Types', 'Dryness, Chapping, Lip Care', 15
  )
) AS t(name, slug, description, long_description, price, sku, is_featured, size, details, ingredients, how_to_use, skin_type, concern, display_order)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

-- ============================================================
-- 22. PRODUCT IMAGES (map to existing /images/ files)
-- ============================================================
INSERT INTO public.product_images (product_id, url, alt, position, is_primary)
SELECT p.id, img.url, img.alt, img.pos, TRUE
FROM public.products p
JOIN (VALUES
  ('radiance-serum',   '/images/product-radiance-serum.png', 'AUREVIA Radiance Serum', 0),
  ('cloud-cream',      '/images/product-cloud-cream.png',    'AUREVIA Cloud Cream Moisturizer', 0),
  ('dew-barrier-mist', '/images/product-barrier-mist.png',   'AUREVIA Dew Barrier Mist', 0),
  ('night-oil',        '/images/product-night-oil.png',      'AUREVIA Night Recovery Oil', 0),
  ('vitamin-c-serum',  '/images/product-vitamin-c-serum.png','AUREVIA Vitamin C Serum', 0),
  ('retinol-serum',    '/images/product-retinol-serum.png',  'AUREVIA Retinol Renewal Serum', 0),
  ('peptide-serum',    '/images/product-peptide-serum.jpg',  'AUREVIA Peptide Firming Serum', 0),
  ('gentle-cleanser',  '/images/product-gentle-cleanser.png','AUREVIA Gentle Foam Cleanser', 0),
  ('niacinamide-toner','/images/product-toner.png',          'AUREVIA Niacinamide Toner', 0),
  ('mineral-spf',      '/images/product-spf-sunscreen.png',  'AUREVIA Mineral SPF 50+', 0),
  ('ceramide-cream',   '/images/product-ceramide-cream.jpg', 'AUREVIA Ceramide Repair Cream', 0),
  ('micellar-water',   '/images/product-micellar-water.jpg', 'AUREVIA Micellar Cleansing Water', 0),
  ('eye-cream',        '/images/product-eye-cream.png',      'AUREVIA Eye Cream', 0),
  ('enzyme-mask',      '/images/product-enzyme-mask.jpg',    'AUREVIA Enzyme Mask', 0),
  ('lip-balm',         '/images/product-lip-balm.png',       'AUREVIA Lip Balm', 0)
) AS img(slug, url, alt, pos) ON p.slug = img.slug
ON CONFLICT DO NOTHING;

-- ============================================================
-- 23. INVENTORY (all products)
-- ============================================================
INSERT INTO public.inventory (product_id, quantity, low_stock_threshold)
SELECT id,
  CASE slug
    WHEN 'radiance-serum'   THEN 248
    WHEN 'cloud-cream'      THEN 185
    WHEN 'vitamin-c-serum'  THEN 162
    WHEN 'retinol-serum'    THEN 134
    WHEN 'night-oil'        THEN 98
    WHEN 'peptide-serum'    THEN 76
    WHEN 'ceramide-cream'   THEN 145
    WHEN 'mineral-spf'      THEN 210
    WHEN 'gentle-cleanser'  THEN 320
    WHEN 'niacinamide-toner'THEN 285
    WHEN 'dew-barrier-mist' THEN 198
    WHEN 'micellar-water'   THEN 267
    WHEN 'eye-cream'        THEN 89
    WHEN 'enzyme-mask'      THEN 112
    WHEN 'lip-balm'         THEN 8
    ELSE 100
  END,
  10
FROM public.products
ON CONFLICT (product_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  updated_at = NOW();

-- ============================================================
-- 24. SEED REVIEWS (realistic Indian customer reviews)
-- ============================================================
INSERT INTO public.reviews (product_id, reviewer_name, reviewer_email, rating, title, body, verified_purchase, is_approved, is_featured, skin_type, concern, created_at)
SELECT p.id, r.reviewer_name, r.reviewer_email, r.rating, r.title, r.body, r.verified_purchase, TRUE, r.is_featured, r.skin_type, r.concern, r.created_at
FROM public.products p
JOIN (VALUES
  -- Radiance Serum reviews
  ('radiance-serum', 'Priya Sharma', 'priya.s@gmail.com', 5, 'Transformed my skin in 3 weeks!',
   'I have been dealing with hyperpigmentation for years and this serum has genuinely changed my skin. My dark spots are noticeably lighter and my overall complexion is so much brighter. The texture is lightweight and absorbs quickly without any stickiness. Will definitely repurchase!',
   TRUE, TRUE, 'Combination', 'Dark Spots, Dullness', NOW() - INTERVAL '45 days'),
  ('radiance-serum', 'Meera Joshi', 'meera.j@gmail.com', 5, 'Finally found my HG serum',
   'I''ve tried so many vitamin C serums and this one is hands down the best. No irritation, no orange staining and actually delivers results. My skin looks visibly brighter in the morning and colleagues keep asking what I''ve changed in my routine!',
   TRUE, FALSE, 'Oily', 'Brightening', NOW() - INTERVAL '30 days'),
  ('radiance-serum', 'Ananya Krishnan', 'ananya.k@gmail.com', 4, 'Good but pricey',
   'Really effective serum - I can see the difference in my skin tone after 6 weeks of consistent use. The only reason for 4 stars is the price point, but honestly the results justify it. My skin barrier feels stronger too.',
   TRUE, FALSE, 'Dry', 'Hyperpigmentation', NOW() - INTERVAL '20 days'),

  -- Cloud Cream reviews
  ('cloud-cream', 'Simran Kaur', 'simran.k@gmail.com', 5, 'Best moisturiser I have ever used',
   'I have extremely dry skin and this cream is absolutely perfect. The texture is like whipped butter but it absorbs so quickly with no greasy residue. My skin stays hydrated all day even in AC. This is a permanent staple in my routine.',
   TRUE, TRUE, 'Dry', 'Hydration', NOW() - INTERVAL '40 days'),
  ('cloud-cream', 'Kavya Reddy', 'kavya.r@gmail.com', 5, 'Perfect for our Indian climate',
   'Most foreign moisturisers feel too heavy for Indian summers but this is perfection. Lightweight, hydrating and doesn''t cause breakouts. I use it morning and night and my skin has never felt better.',
   TRUE, FALSE, 'Oily', 'Hydration, Oil Control', NOW() - INTERVAL '15 days'),

  -- Vitamin C Serum reviews
  ('vitamin-c-serum', 'Tara Venkatesh', 'tara.v@gmail.com', 5, 'Visible results in 2 weeks',
   'I started using this after seeing it recommended online and I am blown away. The oxidation-resistant formula is clearly effective - no orange/yellow staining and my skin genuinely glows in the morning. Sun spots are fading noticeably.',
   TRUE, TRUE, 'Normal', 'Dark Spots, Anti-aging', NOW() - INTERVAL '35 days'),
  ('vitamin-c-serum', 'Nandini Iyer', 'nandini.i@gmail.com', 4, 'Slightly tingly but very effective',
   'Slight tingling at first which I expected from a 15% vitamin C. After a week my skin adjusted and now I love it. My dull, tired skin has completely transformed. Would recommend starting with every other day if you''re sensitive.',
   FALSE, FALSE, 'Sensitive', 'Dullness, Brightening', NOW() - INTERVAL '22 days'),

  -- Retinol Serum reviews
  ('retinol-serum', 'Rhea Malhotra', 'rhea.m@gmail.com', 5, 'Gentle yet incredibly effective',
   'I was scared to start retinol after a bad experience with another brand but the encapsulated formula in this is SO much gentler. Zero peeling or irritation and my skin texture has improved massively. Fine lines around my eyes are noticeably softer.',
   TRUE, TRUE, 'Combination', 'Fine Lines, Texture', NOW() - INTERVAL '50 days'),
  ('retinol-serum', 'Pallavi Shukla', 'pallavi.s@gmail.com', 5, 'Holy grail anti-aging product',
   'At 38 I was starting to notice signs of aging and this serum has genuinely turned back time. My skin looks more youthful and my pores appear smaller. The key is consistency - I''ve been using it for 3 months now.',
   TRUE, FALSE, 'Dry', 'Anti-aging, Firmness', NOW() - INTERVAL '12 days'),

  -- Night Oil reviews
  ('night-oil', 'Deepika Verma', 'deepika.v@gmail.com', 5, 'I wake up glowing every morning',
   'The overnight transformation is real. I apply this as the last step in my PM routine and every morning my skin looks plumper, more hydrated and genuinely glowing. The texture is silky and absorbs beautifully. No greasiness on pillow either!',
   TRUE, TRUE, 'Dry', 'Hydration, Glow, Overnight Repair', NOW() - INTERVAL '28 days'),

  -- Peptide Serum reviews
  ('peptide-serum', 'Ishita Bansal', 'ishita.b@gmail.com', 5, 'Noticeable firming in 4 weeks',
   'My skin visibly looks more lifted and firm. The texture is very lightweight and layering is a breeze. My cheeks look plumper and the nasolabial lines are softer. Very impressed with the quality of this product.',
   TRUE, FALSE, 'Mature', 'Firmness, Anti-aging', NOW() - INTERVAL '18 days'),

  -- Gentle Cleanser reviews
  ('gentle-cleanser', 'Pooja Nair', 'pooja.n@gmail.com', 5, 'Gentle enough for my eczema-prone skin',
   'I have struggled to find a cleanser that doesn''t flare up my eczema. This one is a dream - it removes all my makeup and SPF without any tightness or irritation. My skin actually feels soft and comfortable after washing.',
   TRUE, TRUE, 'Sensitive', 'Sensitivity, Cleansing', NOW() - INTERVAL '32 days'),

  -- Mineral SPF reviews
  ('mineral-spf', 'Aishwarya Pillai', 'aish.p@gmail.com', 5, 'Finally a sunscreen that doesn''t white-cast on Indian skin',
   'Every Indian who wears sunscreen knows the struggle of white cast. This one genuinely has ZERO white cast on my NC40 skin tone. Absorbs beautifully, doesn''t pill under makeup and I actually enjoy wearing it.',
   TRUE, TRUE, 'Oily', 'Sun Protection', NOW() - INTERVAL '25 days'),

  -- Eye Cream reviews
  ('eye-cream', 'Kritika Agarwal', 'kritika.a@gmail.com', 4, 'Dark circles improving gradually',
   'I have had stubborn dark circles for years and while this is not a miracle solution, it is genuinely helping. After 6 weeks of consistent use my under-eyes look more rested and the puffiness I get in the morning has reduced significantly.',
   TRUE, FALSE, 'All Skin Types', 'Dark Circles, Puffiness', NOW() - INTERVAL '42 days')
) AS r(product_slug, reviewer_name, reviewer_email, rating, title, body, verified_purchase, is_featured, skin_type, concern, created_at)
ON p.slug = r.product_slug
ON CONFLICT DO NOTHING;

-- Update review counts on products
UPDATE public.products p
SET
  review_count = sub.cnt,
  review_avg = sub.avg_rating
FROM (
  SELECT product_id, COUNT(*) as cnt, ROUND(AVG(rating)::numeric, 2) as avg_rating
  FROM public.reviews
  WHERE is_approved = TRUE
  GROUP BY product_id
) sub
WHERE p.id = sub.product_id;

-- ============================================================
-- 25. SEED BLOG POSTS
-- ============================================================
INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image_url, category, tags, status, author_name, read_time, published_at, created_at)
VALUES
(
  'The Perfect Morning Glow Routine',
  'perfect-morning-glow-routine',
  'Start your day with this 5-step routine that primes your skin for all-day radiance and protection.',
  '## Your Morning Ritual for Radiant Skin

A consistent morning routine is the foundation of healthy, glowing skin. After years of research and working with leading dermatologists, we''ve developed the ultimate 5-step morning routine that works for all skin types.

### Step 1: Cleanse
Begin with our **Gentle Foam Cleanser**. Even if your skin isn''t visibly dirty in the morning, overnight products, dead skin cells and excess sebum accumulate. A gentle cleanse removes these without stripping your skin''s natural barrier.

*Pro tip: Use lukewarm water — hot water strips the skin''s natural oils.*

### Step 2: Tone
Apply our **Niacinamide Clarifying Toner** with a cotton pad or your palms. This step balances your skin''s pH, minimises pores and preps your skin for better product absorption.

### Step 3: Treat
Apply your targeted serum. For brightening and protection, we recommend our **Radiance Serum** or **Vitamin C Brightening Serum** in the morning. Pat gently into skin — never rub.

### Step 4: Moisturise
Lock in the serum with our **Cloud Cream Moisturiser**. This creates a protective film that prevents transepidermal water loss throughout the day.

### Step 5: Protect
The non-negotiable final step: **Mineral SPF 50+**. Apply generously as the very last step, at least 15 minutes before sun exposure. No skincare routine is complete without sun protection.

## Consistency Is Everything

Results don''t happen overnight. Commit to this routine for at least 8 weeks to see a real transformation in your skin. Take a weekly photo in the same lighting to track your progress — you''ll be amazed.',
  '/images/journal-morning.png',
  'Routine', ARRAY['Morning Routine', 'Glow', 'Skincare Basics', 'SPF'],
  'published', 'AUREVIA Editorial Team', 7,
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '22 days'
),
(
  'Understanding Skin Hydration vs Moisture',
  'skin-hydration-vs-moisture',
  'Many people confuse hydration and moisture. Learn the science behind the difference and how to address both for truly balanced skin.',
  '## Hydration vs Moisture: What''s the Difference?

One of the most common misconceptions in skincare is using "hydration" and "moisture" interchangeably. While they sound similar, they address completely different skin needs — and understanding the difference will transform your routine.

### What Is Hydration?

Hydration refers to **water content** in the skin cells. Dehydrated skin lacks water and can show up as:
- Dullness and greyness
- Fine lines that "crinkle" when you pinch the skin
- Tightness even in oily skin types
- Skin that absorbs products very quickly

Hydrating ingredients draw water into the skin. Look for **humectants** like:
- Hyaluronic Acid (binds 1000x its weight in water)
- Glycerin
- Panthenol (Vitamin B5)
- Aloe vera

### What Is Moisture?

Moisture refers to the **lipid barrier** — the oils and fats that form a protective seal over the skin to prevent water from evaporating. A damaged moisture barrier shows up as:
- Sensitivity and redness
- Flakiness and roughness
- Burning or stinging from skincare products
- Persistent dryness despite using moisturiser

Moisturising ingredients seal in hydration. Look for **emollients and occlusives** like:
- Ceramides
- Squalane
- Shea butter
- Jojoba oil

### The AUREVIA Solution

Our **Cloud Cream Moisturiser** is designed to address both: hyaluronic acid provides deep hydration while ceramides and fatty acids rebuild the moisture barrier.

For severely dehydrated skin, try layering our **Dew Barrier Mist** under your moisturiser for an extra burst of hydration.',
  '/images/journal-hydration.png',
  'Science', ARRAY['Hydration', 'Moisturiser', 'Skin Science', 'Dry Skin'],
  'published', 'Dr. Anika Sharma, Consultant Dermatologist', 8,
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '17 days'
),
(
  'Building Your Skin Barrier: A Complete Guide',
  'building-skin-barrier',
  'Your skin barrier is your first line of defence. Learn how to repair and strengthen it with the right ingredients and habits.',
  '## The Skin Barrier: Your Skin''s Most Important Feature

The skin barrier (also called the stratum corneum) is the outermost layer of your skin. Think of it as a brick wall: skin cells are the bricks, and the lipids (ceramides, fatty acids, cholesterol) are the mortar holding everything together.

When this barrier is intact, your skin is healthy, comfortable and resilient. When it''s damaged, everything goes wrong.

### Signs of a Damaged Skin Barrier

- Persistent redness or inflammation
- Skin that stings or burns when you apply products
- Increased sensitivity to ingredients you previously tolerated
- Breakouts in unusual places
- Skin that feels raw or tight after cleansing

### Common Causes of Barrier Damage

**Over-exfoliation** is the leading cause of barrier damage. Using AHAs, BHAs and retinol simultaneously, or exfoliating daily, strips the protective lipids from your skin.

**Harsh cleansers** with sulphates disrupt the skin''s natural pH and remove essential oils.

**Environmental factors** including pollution, UV exposure and low humidity all contribute to barrier breakdown.

### How to Repair Your Barrier

1. **Simplify your routine** — Strip back to just cleanser, moisturiser and SPF for 2–4 weeks
2. **Add ceramides** — Our **Ceramide Repair Cream** contains three types of ceramides that directly replenish the skin''s lipid matrix
3. **Hydrate deeply** — Layer a hyaluronic acid serum under your moisturiser
4. **Avoid actives** — Pause retinol, AHAs and BHAs while your barrier heals
5. **Protect from UV** — UV damage accelerates barrier breakdown

Most people see significant improvement in 2–4 weeks with consistent, simplified care.',
  '/images/journal-barrier.png',
  'Education', ARRAY['Skin Barrier', 'Ceramides', 'Sensitive Skin', 'Repair'],
  'published', 'AUREVIA Science Team', 9,
  NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days'
),
(
  'The Night Recovery Ritual',
  'night-recovery-ritual',
  'Night time is when your skin does most of its repair work. Maximise your skin''s overnight renewal with this layered PM routine.',
  '## Why Night Time Skincare Matters More

Between 11pm and 4am, your skin enters repair mode. Cell turnover increases, collagen synthesis accelerates and damaged cells are replaced. This is why your PM routine is arguably more important than your AM routine.

### The AUREVIA Night Protocol

**Step 1: Double Cleanse**
Start with our **Micellar Cleansing Water** to dissolve sunscreen and makeup, followed by our **Gentle Foam Cleanser** for a thorough cleanse. Never sleep with SPF or makeup on.

**Step 2: Treat with Actives**
This is when to use your retinol or AHAs — never in the morning.

Our **Retinol Renewal Serum** at 0.3% is the sweet spot for results without irritation. Start 2–3 nights per week and build to nightly over 8–12 weeks.

**Step 3: Peptides**
Layer our **Peptide Firming Serum** over retinol, or use it on non-retinol nights. Peptides work beautifully overnight to stimulate collagen production.

**Step 4: Moisturise**
Apply the **Cloud Cream Moisturiser** to lock in all the goodness from your serums.

**Step 5: Face Oil (Optional)**
Seal everything with 4–5 drops of our **Night Recovery Oil**. Bakuchiol gently resurfaces while plant oils create a protective occlusive layer.

### Pro Tips for Better Night Skincare

- Change your pillowcase weekly (cotton is best for sensitive skin)
- Sleep on your back to prevent face creasing  
- Keep your bedroom cool and well-humidified
- Never skip the neck and décolletage',
  '/images/journal-night.png',
  'Ritual', ARRAY['Night Routine', 'Retinol', 'Peptides', 'Anti-aging'],
  'published', 'AUREVIA Editorial Team', 6,
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '7 days'
),
(
  'Retinol 101: Everything You Need to Know',
  'retinol-guide',
  'Retinol is the gold standard of anti-aging skincare. But how do you use it without the dreaded purge? We break it all down.',
  '## The Complete Guide to Retinol

Retinol is arguably the most researched and proven skincare ingredient for anti-aging. It has decades of clinical evidence behind it, yet many people avoid it because of the initial adjustment period. This guide will help you navigate retinol confidently.

### What Is Retinol?

Retinol is a form of Vitamin A that, when applied to skin, converts to retinoic acid — the active form that stimulates cell turnover, boosts collagen production and reduces the appearance of fine lines, wrinkles and dark spots.

### The Retinol Ladder

Different strengths suit different skin types and tolerances:

- **0.025%** — Perfect for beginners
- **0.05%** — Intermediate
- **0.1%** — Intermediate to advanced
- **0.3%** ← *This is our AUREVIA Retinol Serum*
- **0.5–1%** — Advanced users only

### Why Encapsulated Retinol?

Our Retinol Renewal Serum uses **encapsulated retinol** — tiny spheres that slowly release the active, reducing irritation dramatically while maintaining efficacy. This makes it suitable for those who''ve struggled with traditional retinol.',
  '/images/journal-morning.png',
  'Science', ARRAY['Retinol', 'Anti-aging', 'Vitamin A', 'Beginners Guide'],
  'published', 'Dr. Priya Rao, Dermatologist', 10,
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 26. SEED COUPONS
-- ============================================================
INSERT INTO public.coupons (code, type, value, min_order_amount, max_uses, is_active) VALUES
  ('WELCOME20', 'percentage', 20, 999, 500, TRUE),
  ('GLOW15', 'percentage', 15, 1499, NULL, TRUE),
  ('FLAT500', 'fixed', 500, 2999, 200, TRUE),
  ('FIRSTORDER', 'percentage', 10, 499, 1000, TRUE),
  ('SKIN10', 'percentage', 10, 0, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 27. SEED SITE SETTINGS
-- ============================================================
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_headline', '"Skin That Speaks\nFor Itself"'),
  ('hero_subtitle', '"Dermatologist-tested formulas. Clean ingredients. Effortless results."'),
  ('announcement_bar', '"Free Shipping on Orders Above ₹999 · 100% Clean Beauty · Dermatologist Tested"'),
  ('footer_tagline', '"Luxury skincare crafted for naturally radiant Indian skin."'),
  ('free_shipping_threshold', '999'),
  ('currency', '"INR"'),
  ('currency_symbol', '"₹"'),
  ('store_name', '"AUREVIA SKIN"'),
  ('store_phone', '"+91 98765 43210"'),
  ('store_email', '"hello@aureviaskin.com"'),
  ('instagram_url', '"https://instagram.com/aureviaskin"'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ============================================================
-- 28. PRODUCT-CATEGORY MAPPING
-- ============================================================
UPDATE public.products p SET category_id = c.id
FROM public.categories c
WHERE (p.slug IN ('radiance-serum','vitamin-c-serum','retinol-serum','peptide-serum') AND c.slug = 'serums')
   OR (p.slug IN ('cloud-cream','ceramide-cream') AND c.slug = 'moisturizers')
   OR (p.slug IN ('niacinamide-toner','dew-barrier-mist') AND c.slug = 'toners-mists')
   OR (p.slug IN ('night-oil') AND c.slug = 'facial-oils')
   OR (p.slug IN ('gentle-cleanser','micellar-water') AND c.slug = 'cleansers')
   OR (p.slug IN ('eye-cream') AND c.slug = 'eye-care')
   OR (p.slug IN ('enzyme-mask') AND c.slug = 'masks')
   OR (p.slug IN ('mineral-spf') AND c.slug = 'sun-care');

-- ============================================================
-- 29. PRODUCT-COLLECTION MAPPING
-- ============================================================
UPDATE public.products p SET collection_id = c.id
FROM public.collections c
WHERE (p.slug IN ('radiance-serum','cloud-cream','vitamin-c-serum','retinol-serum','night-oil','gentle-cleanser') AND c.slug = 'bestsellers')
   OR (p.slug IN ('enzyme-mask','ceramide-cream') AND c.slug = 'new-arrivals')
   OR (p.slug IN ('radiance-serum','vitamin-c-serum','mineral-spf','night-oil') AND c.slug = 'glow-edit')
   OR (p.slug IN ('retinol-serum','peptide-serum','night-oil') AND c.slug = 'anti-aging')
   OR (p.slug IN ('ceramide-cream','gentle-cleanser','dew-barrier-mist','enzyme-mask') AND c.slug = 'sensitive-skin');

-- ============================================================
-- COMPLETED
-- To make yourself an admin after creating your account:
-- UPDATE public.profiles SET is_admin = TRUE WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
-- ============================================================
