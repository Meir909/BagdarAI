import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard": ["student"],
  "/test": ["student"],
  "/analysis": ["student"],
  "/chat": ["student"],
  "/admin": ["admin"],
  "/director": ["director"],
  "/curator-dashboard": ["curator"],
  "/parent": ["parent"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find matching protected route
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) return NextResponse.next();

  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const allowedRoles = PROTECTED_ROUTES[matchedRoute];
  if (!allowedRoles.includes(session.role)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/test/:path*",
    "/analysis/:path*",
    "/chat/:path*",
    "/admin/:path*",
    "/director/:path*",
    "/curator-dashboard/:path*",
    "/parent/:path*",
  ],
};
