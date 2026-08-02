import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ToastProvider } from "@/components/ToastProvider";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { WishlistProvider } from "@/components/WishlistProvider";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: false,
  preload: false,
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  adjustFontFallback: false,
  preload: false,
});

export const metadata: Metadata = {
  title: "AUREVIA SKIN — Premium Luxury Skincare | Naturally Radiant Skin",
  description:
    "Discover AUREVIA SKIN, a premium luxury skincare brand crafted to nourish, hydrate, and reveal naturally radiant skin. Dermatologist tested, cruelty free, clean ingredients.",
  keywords:
    "luxury skincare, premium skincare, serum, moisturizer, radiance, glow, clean beauty, cruelty free",
  openGraph: {
    title: "AUREVIA SKIN — Premium Luxury Skincare",
    description:
      "Premium skincare crafted to nourish, hydrate and reveal naturally radiant skin.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
    >
      <body
        className="min-h-screen"
        style={{ background: "#FBF8F4", color: "#493E36" }}
      >
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <SmoothScroll>{children}</SmoothScroll>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
