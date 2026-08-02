"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok">("loading");
  const checked = useRef(false);

  useEffect(() => {
    // Login page: never block it
    if (pathname.startsWith("/admin/login")) {
      setStatus("ok");
      return;
    }

    // Only run the auth check once per page load
    if (checked.current) return;
    checked.current = true;

    (async () => {
      try {
        const sb = createClient();

        // Use getUser() — this makes a real network call to verify the token
        // getSession() can return stale/null data on first load with @supabase/ssr
        const { data: { user }, error } = await sb.auth.getUser();

        if (error || !user) {
          window.location.replace("/admin/login");
          return;
        }

        const { data: profile } = await sb
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (!profile?.is_admin) {
          await sb.auth.signOut();
          window.location.replace("/admin/login");
          return;
        }

        setStatus("ok");
      } catch {
        window.location.replace("/admin/login");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
