import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that do not require authentication
const publicRoutes = ["/", "/login", "/register", "/verify-email", "/reset-password", "/confirm-reset-password", "/products"];

// Routes that require verification (must be verified to access)
const verifiedOnlyRoutes = ["/profile", "/cart", "/transaction", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const hasToken = !!accessToken || request.cookies.has("refreshToken");

  // Skip static files
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

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // 1. If not logged in and trying to access protected route, redirect to home
  if (!isPublicRoute && !hasToken) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(homeUrl);
  }

  // 2. If logged in but accessing verified-only route while unverified
  if (hasToken && verifiedOnlyRoutes.some(route => pathname.startsWith(route))) {
    try {
      if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        if (!payload.emailVerifiedAt) {
          const homeUrl = new URL("/", request.url);
          homeUrl.searchParams.set("unverified", "true");
          return NextResponse.redirect(homeUrl);
        }
      }
    } catch (e) {
      // If token is invalid/corrupt, let it pass or redirect to login
    }
  }

  // 3. Prevent logged-in users from seeing auth pages
  if ((pathname === "/login" || pathname === "/register") && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
  ],
};
