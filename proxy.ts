import { NextResponse, type NextRequest } from "next/server";

/**
 * AUREVIA SKIN — Route Protection Proxy
 *
 * Admin routes → protected by "aurevia_admin" cookie set on admin login
 * Account routes → protected by "aurevia_session" cookie set on customer login
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes ────────────────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasAdminSession = request.cookies.has("aurevia_admin");
    if (!hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Customer account routes ─────────────────────────────────
  if (pathname.startsWith("/account")) {
    const isLoggedIn =
      request.cookies.has("aurevia_session") ||
      request.cookies.has("sb-access-token");
    if (!isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
