"use client";

import { type ReactNode } from "react";

// NOTE: Route protection is now handled by middleware.ts at the edge.
// By the time this component renders, the middleware has already verified
// the user is authenticated and is_admin. This component simply renders children.
export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
