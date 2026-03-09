import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "bagdarai-token";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard": ["student"],
  "/test": ["student"],
  "/analysis": ["student"],
  "/chat": ["student"],
  "/simulations": ["student"],
  "/quests": ["student"],
  "/leaderboard": ["student"],
  "/mentors": ["student"],
  "/admin": ["admin"],
  "/director": ["director"],
  "/curator-dashboard": ["curator"],
  "/parent": ["parent"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret"
    );
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    const allowedRoles = PROTECTED_ROUTES[matchedRoute];
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/test/:path*",
    "/analysis/:path*",
    "/chat/:path*",
    "/simulations/:path*",
    "/quests/:path*",
    "/leaderboard/:path*",
    "/mentors/:path*",
    "/admin/:path*",
    "/director/:path*",
    "/curator-dashboard/:path*",
    "/parent/:path*",
  ],
};
