import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that do not require authentication
const publicRoutes = ["/", "/login", "/register", "/verify-email", "/reset-password", "/confirm-reset-password", "/products", "/login/employee"];

// Routes that require verification (must be verified to access)
const verifiedOnlyRoutes = ["/profile", "/cart", "/transaction", "/checkout"];

// Routes restricted by role
const customerOnlyRoutes = ["/cart", "/checkout", "/transaction"];
const employeeOnlyRoutes = ["/dashboard", "/manage-order"];

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

  // 1. If not logged in and trying to access protected route, redirect
  if (!isPublicRoute && !hasToken) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/manage-order")) {
      return NextResponse.redirect(new URL("/login/employee", request.url));
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based guarding
  if (hasToken && accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const role = payload.role;

      // Prevent logged-in users from seeing auth pages
      if ((pathname === "/login" || pathname === "/register" || pathname === "/login/employee")) {
        if (role === "EMPLOYEE") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Customer trying to access employee routes
      if (role === "CUSTOMER" && employeeOnlyRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Employee strict routing: ONLY allow employee routes
      if (role === "EMPLOYEE" && !employeeOnlyRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 3. If logged in but accessing verified-only route while unverified (for Customers)
      if (role === "CUSTOMER" && verifiedOnlyRoutes.some(route => pathname.startsWith(route))) {
        if (!payload.emailVerifiedAt) {
          const homeUrl = new URL("/", request.url);
          homeUrl.searchParams.set("unverified", "true");
          return NextResponse.redirect(homeUrl);
        }
      }
    } catch (e) {
      // Token invalid or other error
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
  ],
};
