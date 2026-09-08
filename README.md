<div align="center">

# ✦ AUREVIA SKIN

### A Full-Stack Luxury E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Live Site: [aurevia-skin.vercel.app](https://aurevia-skin.vercel.app)**

</div>

---

## Overview

Aurevia Skin is a **production-grade, full-stack luxury skincare e-commerce web application** built entirely from scratch. It features a public-facing storefront with editorial design, a complete customer account portal, and a full-featured data-driven admin dashboard — all backed by a real PostgreSQL database with Row Level Security.

This project demonstrates expertise in **modern full-stack web development**, covering everything from pixel-perfect UI engineering and cinematic animations to database design, authentication, REST API design, and CI/CD deployment.

---

## Live Preview

| Storefront | Admin Panel |
|:---:|:---:|
| aurevia-skin.vercel.app | aurevia-skin.vercel.app/admin |
| Public-facing luxury store | Password-protected management dashboard |

> **Admin Demo:** admin.aurevia@gmail.com / Aurevia@2026!Secure

---

## Key Features

### Storefront
- **Editorial Homepage** — Cinematic hero section, asymmetric product grid, floating testimonials, and a magazine-style journal layout
- **Shop & Product Pages** — Dynamic product catalog with slug-based routing, image gallery, and related products
- **Smooth Scroll & Animations** — Framer Motion scroll-reveal animations and Lenis smooth scrolling
- **Custom Cursor** — Bespoke cursor that magnetically reacts to interactive elements
- **Blog / Journal** — CMS-driven blog with article listing and full detail pages

### E-Commerce
- **Slide-out Cart Drawer** — Real-time cart with quantity controls, item removal, and animated free-shipping progress bar
- **Guest Login Gate** — Unauthenticated users adding items to cart are intercepted with a polished "Sign in to Shop" modal
- **Multi-step Checkout** — Address form, payment selection, and order confirmation with automatic order number generation
- **Coupon / Discount Codes** — Admin-configurable coupons (percentage or flat) validated at checkout
- **Order Tracking** — Customers can look up order status without logging in

### Customer Portal
- **Authentication** — Email/password auth with session persistence via @supabase/ssr (SSR-safe cookies, no hydration flicker)
- **Account Dashboard** — Order history, wishlist, saved addresses, and profile settings
- **Wishlist** — Add/remove products with persistent database storage

### Admin Dashboard (/admin)
A complete back-office management system:

| Page | Capability |
|:---|:---|
| **Dashboard** | Real-time revenue, orders, customer count — Today / This Week / This Month filters |
| **Products** | Full CRUD — create, edit, archive, feature products with image upload |
| **Orders** | Expand any order inline to update status and add tracking numbers |
| **Customers** | View all customers with total orders and lifetime spend |
| **Inventory** | Stock levels with low-stock alerts and quantity adjustment |
| **Collections** | Curated product groupings with full CRUD |
| **Coupons** | Create and toggle discount codes |
| **Reviews** | Approve or reject customer reviews before they go live |
| **Analytics** | Revenue charts and top-selling products |
| **Blog / CMS** | Write journal articles and edit homepage content |
| **Media Library** | Browse and manage uploaded images |

---

## Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Framework** | Next.js 16 (App Router) | SSR, routing, API routes, edge middleware |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Database** | Supabase (PostgreSQL) | Users, products, orders, reviews |
| **Auth** | Supabase Auth + @supabase/ssr | Cookie-based JWT, SSR-compatible |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive layouts |
| **Animations** | Framer Motion 12 | Scroll-reveal, layout animations, cart transitions |
| **Smooth Scroll** | Lenis | Buttery smooth scrolling |
| **Hero Animations** | GSAP 3 | Complex timeline animations |
| **Forms** | React Hook Form + Zod | Validated, performant forms |
| **Email** | Nodemailer | Transactional order emails |
| **Deployment** | Vercel | CI/CD — auto-deploys on every GitHub push |

---

## Project Structure

```
aurevia-skin/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── shop/                     # Product catalog
│   ├── products/[slug]/          # Dynamic product pages
│   ├── checkout/                 # Multi-step checkout
│   ├── blog/                     # Journal listing + detail
│   ├── account/                  # Protected customer portal
│   ├── auth/                     # Login, Register, Forgot Password
│   ├── admin/                    # Full admin dashboard (12+ sections)
│   └── api/                      # REST API routes
│       ├── orders/
│       ├── products/
│       ├── newsletter/
│       └── contact/
│
├── components/                   # 20+ reusable React components
│   ├── Navigation.tsx            # Header with cart drawer trigger
│   ├── CartDrawer.tsx            # Slide-out cart with live updates
│   ├── CartProvider.tsx          # Global cart state (Context API)
│   ├── AuthProvider.tsx          # Global auth state
│   ├── Hero.tsx                  # GSAP-animated hero
│   └── Bestsellers.tsx           # Editorial product grid
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server-side client
│   │   └── admin.ts              # Service role client
│   └── products.ts               # Typed product queries
│
├── supabase/
│   └── schema.sql                # Complete DB schema (20+ tables, RLS)
│
└── proxy.ts                      # Edge middleware for auth protection
```

---

## Database Design

20+ tables with full Row Level Security:

```
profiles          → Extends Supabase auth.users with role-based access (is_admin)
products          → Product catalog with status and display ordering
product_images    → Multiple images per product with primary flag
categories        → Product taxonomy
collections       → Curated product groupings
inventory         → Stock quantities with low-stock thresholds
orders            → Customer orders with full lifecycle tracking
order_items       → Individual line items per order
order_timeline    → Status change history for each order
cart / cart_items → Persistent cart storage per user session
reviews           → Customer reviews with admin approval workflow
coupons           → Discount codes (percentage or fixed)
blog_posts        → Journal articles
addresses         → Saved customer shipping addresses
wishlist          → Customer wishlists
contact_messages  → Contact form submissions
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone & Install
```bash
git clone https://github.com/PhantomCipher13/aurevia-skin.git
cd aurevia-skin
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up the Database
1. Go to Supabase Dashboard → SQL Editor
2. Paste and run the contents of `supabase/schema.sql`
3. Set your admin user:
```sql
UPDATE public.profiles SET is_admin = TRUE WHERE id = 'your-user-uuid';
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment

Zero-config deployment via Vercel:

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Every `git push` triggers automatic rebuild and deployment

---

## Security Architecture

- **Row Level Security (RLS)** — Postgres policies on every table. Users can only access their own data; admin operations require `is_admin = TRUE`.
- **Server-Side Auth** — Sessions handled via HTTP-only cookies using `@supabase/ssr`, preventing XSS token theft.
- **Edge Middleware** — `proxy.ts` runs on Vercel's Edge Network protecting all `/admin` routes before the page loads.
- **Service Role Isolation** — The service role key is only used in server-side API routes, never exposed to the browser.

---

## Skills Demonstrated

- Full-stack Next.js App Router architecture (SSR, ISR, Client Components, Server Actions)
- PostgreSQL database design with RLS security policies
- Role-based access control (RBAC) via Supabase Auth
- Complex UI animations with Framer Motion and GSAP
- TypeScript end-to-end — components, API responses, and DB queries fully typed
- Context API for global state (cart, auth, toast, wishlist) without Redux
- CI/CD pipeline — GitHub to Vercel with zero manual steps

---

<div align="center">

**Made with care for the craft.**

[Live Site](https://aurevia-skin.vercel.app) • [GitHub](https://github.com/PhantomCipher13/aurevia-skin)

</div>
