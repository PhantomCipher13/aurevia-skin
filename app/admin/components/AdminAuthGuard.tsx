"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");
  const checked = useRef(false);

  useEffect(() => {
    // Login page: never block it, always show it
    if (pathname.startsWith("/admin/login")) {
      setStatus("ok");
      return;
    }

    // Only run the check once per mount — never re-run on re-renders
    if (checked.current) return;
    checked.current = true;

    (async () => {
      const sb = createClient();
      const { data: { session } } = await sb.auth.getSession();

      if (!session?.user) {
        // Not logged in — go to login page
        window.location.replace("/admin/login");
        return;
      }

      const { data: profile } = await sb
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (!profile?.is_admin) {
        // Logged in but not admin — sign out and go to login
        await sb.auth.signOut();
        window.location.replace("/admin/login");
        return;
      }

      // All good — show the dashboard
      setStatus("ok");
    })();
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0B09" }}>
        <div
          className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "#C7A064", borderRightColor: "rgba(199,160,100,0.3)" }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
