import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that do not require authentication
const publicRoutes = ["/", "/login","/verify-email"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  // Let Next.js handle static files, API routes, and _next/image requests without interference
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes(".svg") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // Check if the route is explicitly public
  const isPublicRoute = publicRoutes.includes(pathname);

  // 1. If user is trying to access a protected route WITHOUT a token, redirect to /login
  if (!isPublicRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user is trying to access /login WITH a token, redirect to /dashboard
  if (pathname === "/login" && hasToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
  ],
};
