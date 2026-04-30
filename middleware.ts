import { createServerClient } from '@supabase/ssr'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://bagdarai-app.vercel.app",
  "http://localhost:3001",
  "http://localhost:3002",
];

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

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // Handle CORS preflight for /api/* routes
  if (request.method === "OPTIONS" && request.nextUrl.pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  let supabaseResponse = NextResponse.next({ request });

  // Attach CORS headers to all /api/* responses
  if (request.nextUrl.pathname.startsWith("/api/") && isAllowedOrigin) {
    supabaseResponse.headers.set("Access-Control-Allow-Origin", origin);
    supabaseResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    supabaseResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check auth session
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl;

  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) return supabaseResponse;

  if (!user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Get user role from user metadata
  const role = user.user_metadata?.role as string;

  const allowedRoles = PROTECTED_ROUTES[matchedRoute];
  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/api/:path*",
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
