"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const ease = [0.16, 1, 0.3, 1] as const;

type Filter = "all" | "pending" | "approved";

export default function AdminReviewsPage() {
  const sb = createClient();

  const [reviews, setReviews]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Filter>("pending");
  const [toast, setToast]       = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb
      .from("reviews")
      .select(`*, product:products(name, slug)`)
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const approve = async (id: string) => {
    setUpdating(id);
    await sb.from("reviews").update({ is_approved: true }).eq("id", id);
    // Update product review stats
    const review = reviews.find(r => r.id === id);
    if (review?.product_id) {
      const { data: allRev } = await sb.from("reviews").select("rating").eq("product_id", review.product_id).eq("is_approved", true);
      if (allRev) {
        const avg = allRev.reduce((s, r) => s + r.rating, 0) / allRev.length;
        await sb.from("products").update({ review_count: allRev.length, review_avg: avg }).eq("id", review.product_id);
      }
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: true } : r));
    showToast("Review approved and published");
    setUpdating(null);
  };

  const reject = async (id: string) => {
    setUpdating(id);
    await sb.from("reviews").delete().eq("id", id);
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast("Review removed");
    setUpdating(null);
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await sb.from("reviews").update({ is_featured: !current }).eq("id", id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_featured: !current } : r));
    showToast(!current ? "Review featured on product page" : "Review unfeatured");
  };

  const filtered = reviews.filter(r => {
    if (filter === "pending")  return !r.is_approved;
    if (filter === "approved") return r.is_approved;
    return true;
  });

  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Reviews" subtitle={`${reviews.filter(r => !r.is_approved).length} pending approval`} />

      <div className="flex-1 p-8">

        {/* Stats + Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(["all", "pending", "approved"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-xl text-[11px] tracking-[0.07em] uppercase font-medium transition-all"
                style={{
                  background: filter === f ? "rgba(199,160,100,0.18)" : "transparent",
                  border: "1px solid " + (filter === f ? "rgba(199,160,100,0.3)" : "rgba(199,160,100,0.1)"),
                  color: filter === f ? "#C7A064" : "rgba(234,217,195,0.4)",
                  fontFamily: "var(--font-body)",
                }}>
                {f === "all" ? `All (${reviews.length})` : f === "pending" ? `Pending (${reviews.filter(r => !r.is_approved).length})` : `Approved (${reviews.filter(r => r.is_approved).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.02)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.3)" }}>
              {filter === "pending" ? "No reviews pending approval 🎉" : "No reviews found"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review, i) => (
              <motion.div key={review.id}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease }}
                className="rounded-2xl p-5"
                style={{
                  background: review.is_approved ? "rgba(34,197,94,0.03)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${review.is_approved ? "rgba(34,197,94,0.1)" : "rgba(199,160,100,0.08)"}`,
                }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>
                        {review.reviewer_name}
                      </span>
                      <span className="text-[12px]" style={{ color: "#C7A064" }}>{stars(review.rating)}</span>
                      {review.verified_purchase && (
                        <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", fontFamily: "var(--font-body)" }}>
                          Verified Purchase
                        </span>
                      )}
                      {review.is_featured && (
                        <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(199,160,100,0.15)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Product */}
                    <p className="text-[10px] mb-2" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>
                      For: <span style={{ color: "#C7A064" }}>{review.product?.name ?? "Unknown Product"}</span>
                      {review.skin_type && ` · ${review.skin_type} skin`}
                    </p>

                    {/* Title + Body */}
                    {review.title && (
                      <p className="text-[13px] font-medium mb-1" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
                        "{review.title}"
                      </p>
                    )}
                    <p className="text-[12px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.55)" }}>
                      {review.body}
                    </p>
                    <p className="text-[10px] mt-2" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.25)" }}>
                      {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {!review.is_approved && (
                      <button
                        onClick={() => approve(review.id)}
                        disabled={updating === review.id}
                        className="px-4 py-2 rounded-xl text-[11px] tracking-[0.07em] uppercase font-medium transition-all"
                        style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a", fontFamily: "var(--font-body)" }}>
                        {updating === review.id ? "…" : "Approve"}
                      </button>
                    )}
                    <button
                      onClick={() => toggleFeatured(review.id, review.is_featured)}
                      className="px-4 py-2 rounded-xl text-[11px] tracking-[0.07em] uppercase font-medium transition-all"
                      style={{ background: "rgba(199,160,100,0.08)", color: "#C7A064", fontFamily: "var(--font-body)" }}>
                      {review.is_featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => reject(review.id)}
                      disabled={updating === review.id}
                      className="px-4 py-2 rounded-xl text-[11px] tracking-[0.07em] uppercase font-medium transition-all"
                      style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", fontFamily: "var(--font-body)" }}>
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl z-50"
            style={{ background: "#C7A064", color: "#fff", fontFamily: "var(--font-body)", fontSize: "13px" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
