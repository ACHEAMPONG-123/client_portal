import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "agency_portal_super_secret_jwt_key_2026_antigravity"
);

const COOKIE_NAME = "agency_portal_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets, api routes, and public files pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let sessionPayload: Record<string, any> | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      sessionPayload = payload;
    } catch {
      sessionPayload = null;
    }
  }

  // 1. If trying to access protected routes without session -> redirect to /login
  if (!sessionPayload && (pathname.startsWith("/client") || pathname.startsWith("/agency") || pathname.startsWith("/admin") || pathname === "/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and hitting /login -> redirect to role dashboard
  if (sessionPayload && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Role-based Route Protection
  if (sessionPayload) {
    const role = sessionPayload.roleName;

    // Client routes: client admins, client users, or agency staff
    if (pathname.startsWith("/client") && !role.startsWith("CLIENT_") && !["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Agency routes: staff only
    if (pathname.startsWith("/agency") && role.startsWith("CLIENT_")) {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }

    // Admin routes: SUPER_ADMIN and ADMIN only
    if (pathname.startsWith("/admin") && !["SUPER_ADMIN", "ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
