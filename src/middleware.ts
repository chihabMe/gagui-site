import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin and /api/admin paths
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow login endpoints
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    // If already logged in and visiting /admin/login, redirect to /admin
    if (pathname === "/admin/login") {
      const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      if (token) {
        const user = await verifyAdminToken(token);
        if (user) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // Check authentication
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyAdminToken(token);
  if (!user) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(ADMIN_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
