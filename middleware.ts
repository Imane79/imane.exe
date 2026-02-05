import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback-secret-key",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session cookie
  const sessionCookie = request.cookies.get("session");

  // Check if user is trying to access admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  // If accessing admin routes
  if (isAdminRoute) {
    // No session cookie → redirect to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify the session token
    try {
      await jwtVerify(sessionCookie.value, SECRET_KEY);
      // Token is valid → allow access
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired → redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If accessing login page while already logged in
  if (isLoginRoute && sessionCookie) {
    try {
      await jwtVerify(sessionCookie.value, SECRET_KEY);
      // Already logged in → redirect to admin
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch (error) {
      // Invalid token → allow login page
      return NextResponse.next();
    }
  }

  // All other routes → allow access
  return NextResponse.next();
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    "/admin/:path*", // All admin routes
    "/login", // Login page
  ],
};
