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

/* ── Types ───────────────────────────────────────────── */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  stock?: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

/* ── Context ─────────────────────────────────────────── */
const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/* ── Local-storage key for guests ─────────────────────── */
const LS_KEY = "aurevia-cart";

function loadLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); }
  catch { return []; }
}

function saveLocalCart(items: CartItem[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

/* ── Provider ────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const sb = createClient();
  const { user, isLoading: authLoading } = useAuth();

  const [items, setItems]     = useState<CartItem[]>([]);
  const [cartId, setCartId]   = useState<string | null>(null);
  const [isLoading, setLoad]  = useState(false);

  /* ── Helpers ── */
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);

  /* ── Load DB cart for logged-in users ── */
  const loadDbCart = useCallback(async (uid: string) => {
    setLoad(true);
    // Get or create cart
    let { data: cart } = await sb.from("cart").select("id").eq("user_id", uid).single();
    if (!cart) {
      const { data: newCart } = await sb.from("cart").insert({ user_id: uid }).select("id").single();
      cart = newCart;
    }
    if (!cart) { setLoad(false); return; }
    setCartId(cart.id);

    // Load items with product details
    const { data: dbItems } = await sb
      .from("cart_items")
      .select(`
        id, quantity,
        product:products(id, name, slug, price, sale_price,
          images:product_images(url, is_primary))
      `)
      .eq("cart_id", cart.id);

    if (dbItems) {
      const mapped: CartItem[] = dbItems.map((row: any) => ({
        id: row.id,
        productId: row.product.id,
        name: row.product.name,
        slug: row.product.slug,
        price: row.product.sale_price ?? row.product.price,
        image: row.product.images?.find((i: any) => i.is_primary)?.url
          ?? row.product.images?.[0]?.url ?? "",
        quantity: row.quantity,
      }));
      setItems(mapped);
    }
    setLoad(false);
  }, [sb]);

  /* ── Merge guest cart into DB on login ── */
  const mergeLocalToDb = useCallback(async (uid: string, cId: string) => {
    const local = loadLocalCart();
    if (!local.length) return;

    for (const item of local) {
      await sb.from("cart_items").upsert(
        { cart_id: cId, product_id: item.productId, quantity: item.quantity },
        { onConflict: "cart_id,product_id" }
      );
    }
    localStorage.removeItem(LS_KEY);
  }, [sb]);

  /* ── Auth change → load appropriate cart ── */
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      loadDbCart(user.id).then(async () => {
        // merge any guest items
        const local = loadLocalCart();
        if (local.length && cartId) {
          await mergeLocalToDb(user.id, cartId);
          await loadDbCart(user.id);
        }
      });
    } else {
      setItems(loadLocalCart());
      setCartId(null);
    }
  }, [user, authLoading, cartId, loadDbCart, mergeLocalToDb]);

  /* ── Add item ── */
  const addItem = useCallback(async (newItem: Omit<CartItem, "id">) => {
    if (user && cartId) {
      // Check if already in cart
      const { data: existing } = await sb
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", newItem.productId)
        .single();

      if (existing) {
        await sb.from("cart_items")
          .update({ quantity: existing.quantity + newItem.quantity })
          .eq("id", existing.id);
      } else {
        await sb.from("cart_items").insert({
          cart_id: cartId,
          product_id: newItem.productId,
          quantity: newItem.quantity,
        });
      }
      await loadDbCart(user.id);
    } else {
      // Guest — localStorage
      setItems(prev => {
        const idx = prev.findIndex(i => i.productId === newItem.productId);
        let next: CartItem[];
        if (idx >= 0) {
          next = prev.map((i, n) =>
            n === idx ? { ...i, quantity: i.quantity + newItem.quantity } : i
          );
        } else {
          next = [...prev, { ...newItem, id: crypto.randomUUID() }];
        }
        saveLocalCart(next);
        return next;
      });
    }
  }, [user, cartId, sb, loadDbCart]);

  /* ── Remove item ── */
  const removeItem = useCallback(async (productId: string) => {
    if (user && cartId) {
      await sb.from("cart_items").delete()
        .eq("cart_id", cartId).eq("product_id", productId);
      await loadDbCart(user.id);
    } else {
      setItems(prev => {
        const next = prev.filter(i => i.productId !== productId);
        saveLocalCart(next);
        return next;
      });
    }
  }, [user, cartId, sb, loadDbCart]);

  /* ── Update quantity ── */
  const updateQty = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) { await removeItem(productId); return; }

    if (user && cartId) {
      await sb.from("cart_items")
        .update({ quantity })
        .eq("cart_id", cartId)
        .eq("product_id", productId);
      await loadDbCart(user.id);
    } else {
      setItems(prev => {
        const next = prev.map(i => i.productId === productId ? { ...i, quantity } : i);
        saveLocalCart(next);
        return next;
      });
    }
  }, [user, cartId, sb, loadDbCart, removeItem]);

  /* ── Clear cart ── */
  const clearCart = useCallback(async () => {
    if (user && cartId) {
      await sb.from("cart_items").delete().eq("cart_id", cartId);
      setItems([]);
    } else {
      setItems([]);
      localStorage.removeItem(LS_KEY);
    }
  }, [user, cartId, sb]);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addItem, removeItem, updateQty, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}
