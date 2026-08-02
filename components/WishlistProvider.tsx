"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

/* ── Types ── */
interface WishlistContextValue {
  items: string[]; // product IDs
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside <WishlistProvider>");
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const sb = createClient();
  const { user, isLoading: authLoading } = useAuth();

  const [items, setItems]     = useState<string[]>([]);
  const [isLoading, setLoad]  = useState(false);

  /* ── Load wishlist from DB ── */
  const loadWishlist = useCallback(async (uid: string) => {
    setLoad(true);
    const { data } = await sb
      .from("wishlist")
      .select("product_id")
      .eq("user_id", uid);
    setItems(data?.map(r => r.product_id) ?? []);
    setLoad(false);
  }, [sb]);

  useEffect(() => {
    if (authLoading) return;
    if (user) loadWishlist(user.id);
    else setItems([]);
  }, [user, authLoading, loadWishlist]);

  /* ── Toggle ── */
  const toggle = useCallback(async (productId: string) => {
    if (!user) return; // must be logged in to wishlist

    const isIn = items.includes(productId);
    if (isIn) {
      await sb.from("wishlist").delete()
        .eq("user_id", user.id).eq("product_id", productId);
      setItems(prev => prev.filter(id => id !== productId));
    } else {
      await sb.from("wishlist").insert({ user_id: user.id, product_id: productId });
      setItems(prev => [...prev, productId]);
    }
  }, [sb, user, items]);

  const isWishlisted = useCallback((pid: string) => items.includes(pid), [items]);

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}
