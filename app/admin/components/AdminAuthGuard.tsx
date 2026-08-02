"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const sb       = createClient();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If we are on the login page, don't block rendering. The login page handles its own auth redirection.
    if (pathname.startsWith("/admin/login")) {
      setAuthorized(true);
      return;
    }

    const check = async () => {
      const { data: { session } } = await sb.auth.getSession();

      if (!session?.user) {
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const { data: profile } = await sb
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (!profile?.is_admin) {
        await sb.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
    };

    check();

    // Listen for auth state changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [sb, router, pathname]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0B09" }}>
        <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: "#C7A064", borderRightColor: "rgba(199,160,100,0.3)" }} />
      </div>
    );
  }

  return <>{children}</>;
}
