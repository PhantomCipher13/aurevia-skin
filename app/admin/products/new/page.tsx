"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../components/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const CATEGORIES = [
  { label: "Serums", slug: "serums" },
  { label: "Moisturizers", slug: "moisturizers" },
  { label: "Toners & Mists", slug: "toners-mists" },
  { label: "Facial Oils", slug: "facial-oils" },
  { label: "Cleansers", slug: "cleansers" },
  { label: "Eye Care", slug: "eye-care" },
  { label: "Masks", slug: "masks" },
  { label: "Sun Care", slug: "sun-care" },
];

function makeSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const sb = createClient();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    long_description: "",
    price: "",
    sale_price: "",
    sku: "",
    category_slug: "",
    size: "",
    details: "",
    ingredients: "",
    how_to_use: "",
    skin_type: "",
    concern: "",
    meta_title: "",
    meta_description: "",
    status: "active",
    is_featured: false,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [qty, setQty] = useState("100");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleNameChange = (name: string) => {
    setForm(prev => ({ ...prev, name, slug: makeSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent, status: "active" | "draft") => {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Name and price are required"); return; }

    setSaving(true);
    setError("");

    // Get category_id
    let category_id: string | null = null;
    if (form.category_slug) {
      const { data: cat } = await sb.from("categories").select("id").eq("slug", form.category_slug).single();
      category_id = cat?.id ?? null;
    }

    const { data: product, error: pErr } = await sb.from("products").insert({
      name: form.name,
      slug: form.slug || makeSlug(form.name),
      description: form.description,
      long_description: form.long_description,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      sku: form.sku || null,
      category_id,
      status,
      is_featured: form.is_featured,
      size: form.size,
      details: form.details,
      ingredients: form.ingredients,
      how_to_use: form.how_to_use,
      skin_type: form.skin_type,
      concern: form.concern,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      updated_at: new Date().toISOString(),
    }).select("id").single();

    if (pErr) { setError(pErr.message); setSaving(false); return; }

    // Add primary image
    if (imageUrl) {
      await sb.from("product_images").insert({
        product_id: product.id,
        url: imageUrl,
        alt: imageAlt || form.name,
        position: 0,
        is_primary: true,
      });
    }

    // Create inventory
    await sb.from("inventory").insert({
      product_id: product.id,
      quantity: parseInt(qty) || 0,
      low_stock_threshold: 10,
    });

    router.push("/admin/products");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(199,160,100,0.12)",
    color: "#EAD9C3",
    fontFamily: "var(--font-body)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
    color: "rgba(234,217,195,0.4)",
    fontFamily: "var(--font-body)",
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Add Product" subtitle="Create a new product" />

      <div className="flex-1 p-8 max-w-4xl">
        <form onSubmit={e => handleSubmit(e, form.status as "active" | "draft")}>

          {/* Basic Info */}
          <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.08)" }}>
            <h3 className="text-[14px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label style={labelStyle}>Product Name *</label>
                <input type="text" required value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  style={inputStyle} placeholder="e.g. Radiance Serum" />
              </div>
              <div>
                <label style={labelStyle}>URL Slug</label>
                <input type="text" value={form.slug}
                  onChange={e => set("slug", e.target.value)}
                  style={inputStyle} placeholder="auto-generated" />
              </div>
              <div>
                <label style={labelStyle}>SKU</label>
                <input type="text" value={form.sku}
                  onChange={e => set("sku", e.target.value)}
                  style={inputStyle} placeholder="AUR-SRM-001" />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>Short Description</label>
                <input type="text" value={form.description}
                  onChange={e => set("description", e.target.value)}
                  style={inputStyle} placeholder="Brightens, hydrates & improves glow" />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>Full Description</label>
                <textarea rows={5} value={form.long_description}
                  onChange={e => set("long_description", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                  placeholder="Detailed product description…" />
              </div>
            </div>
          </div>

          {/* Pricing & Category */}
          <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.08)" }}>
            <h3 className="text-[14px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
              Pricing & Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input type="number" required min="0" step="0.01" value={form.price}
                  onChange={e => set("price", e.target.value)}
                  style={inputStyle} placeholder="1899" />
              </div>
              <div>
                <label style={labelStyle}>Sale Price (₹)</label>
                <input type="number" min="0" step="0.01" value={form.sale_price}
                  onChange={e => set("sale_price", e.target.value)}
                  style={inputStyle} placeholder="Optional" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category_slug} onChange={e => set("category_slug", e.target.value)}
                  style={{ ...inputStyle }}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Initial Stock</label>
                <input type="number" min="0" value={qty}
                  onChange={e => setQty(e.target.value)}
                  style={inputStyle} placeholder="100" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.is_featured}
                onChange={e => set("is_featured", e.target.checked)}
                className="w-4 h-4 rounded" style={{ accentColor: "#C7A064" }} />
              <label htmlFor="featured" className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3", cursor: "pointer" }}>
                Mark as featured product
              </label>
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.08)" }}>
            <h3 className="text-[14px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Size / Volume</label>
                <input type="text" value={form.size} onChange={e => set("size", e.target.value)}
                  style={inputStyle} placeholder="30ml / 1 fl oz" />
              </div>
              <div>
                <label style={labelStyle}>Skin Type</label>
                <input type="text" value={form.skin_type} onChange={e => set("skin_type", e.target.value)}
                  style={inputStyle} placeholder="All Skin Types" />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>Concerns</label>
                <input type="text" value={form.concern} onChange={e => set("concern", e.target.value)}
                  style={inputStyle} placeholder="Brightening, Hyperpigmentation, Uneven Tone" />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>Key Details / Claims</label>
                <textarea rows={2} value={form.details} onChange={e => set("details", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                  placeholder="Fragrance-free · Paraben-free · Dermatologist tested" />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>Ingredients</label>
                <textarea rows={3} value={form.ingredients} onChange={e => set("ingredients", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                  placeholder="Aqua, Ascorbic Acid 10%, Sodium Hyaluronate…" />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>How to Use</label>
                <textarea rows={3} value={form.how_to_use} onChange={e => set("how_to_use", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                  placeholder="Apply 3-4 drops to clean, dry skin…" />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.08)" }}>
            <h3 className="text-[14px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
              Primary Image
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Image URL</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  style={inputStyle} placeholder="/images/product-name.png or Supabase URL" />
              </div>
              <div>
                <label style={labelStyle}>Alt Text</label>
                <input type="text" value={imageAlt} onChange={e => setImageAlt(e.target.value)}
                  style={inputStyle} placeholder="AUREVIA Product Name" />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(199,160,100,0.08)" }}>
            <h3 className="text-[14px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>SEO</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label style={labelStyle}>Meta Title</label>
                <input type="text" value={form.meta_title} onChange={e => set("meta_title", e.target.value)}
                  style={inputStyle} placeholder="Auto-generated from product name" />
              </div>
              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea rows={2} value={form.meta_description} onChange={e => set("meta_description", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                  placeholder="Short description for search engines (150-160 chars)" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-[12px]"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "var(--font-body)" }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={e => handleSubmit(e as any, "draft")}
              disabled={saving}
              className="px-8 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(199,160,100,0.15)", color: "#EAD9C3", fontFamily: "var(--font-body)" }}>
              Save as Draft
            </button>
            <button type="button" onClick={e => handleSubmit(e as any, "active")}
              disabled={saving}
              className="px-8 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold transition-all"
              style={{ background: saving ? "rgba(199,160,100,0.4)" : "#C7A064", color: "#fff", fontFamily: "var(--font-body)" }}>
              {saving ? "Creating…" : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
