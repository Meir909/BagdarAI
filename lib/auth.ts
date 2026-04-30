import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { createClient as createSupabaseBrowser } from "@supabase/supabase-js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const COOKIE_NAME = "bagdarai-token";

export interface JWTPayload {
  userId: string;
  role: string;
  email?: string;
  name: string;
}

export function signToken(payload: JWTPayload, remember = false): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: remember ? "30d" : "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Verify a Supabase access token and map to JWTPayload */
async function verifySupabaseToken(accessToken: string): Promise<JWTPayload | null> {
  try {
    const supabase = createSupabaseBrowser(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) return null;
    return {
      userId: user.id,
      role: user.user_metadata?.role ?? "student",
      email: user.email,
      name: user.user_metadata?.name ?? user.email ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * getSession — works with:
 *  1. Authorization: Bearer <supabase_token> header (BagdarAI-app API calls)
 *  2. Legacy JWT cookie bagdarai-token (main web app)
 *  3. Supabase session cookie sb-* (main web app with Supabase auth)
 */
export async function getSession(): Promise<JWTPayload | null> {
  // 1. Bearer token from Authorization header (BagdarAI-app)
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = await verifySupabaseToken(token);
    if (payload) return payload;
  }

  // 2. Legacy JWT cookie
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get(COOKIE_NAME)?.value;
  if (jwtToken) {
    const payload = verifyToken(jwtToken);
    if (payload) return payload;
  }

  // 3. Supabase session cookie
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user) {
      return {
        userId: user.id,
        role: user.user_metadata?.role ?? "student",
        email: user.email,
        name: user.user_metadata?.name ?? user.email ?? "",
      };
    }
  } catch {}

  return null;
}

export async function getSessionFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  // 1. Bearer token
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifySupabaseToken(token);
  }

  // 2. Legacy JWT cookie
  const jwtToken = request.cookies.get(COOKIE_NAME)?.value;
  if (jwtToken) return verifyToken(jwtToken);

  return null;
}

export function setAuthCookie(token: string, remember = false): { name: string; value: string; options: object } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
      path: "/",
    },
  };
}

export { COOKIE_NAME };
