import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "agency_portal_super_secret_jwt_key_2026_antigravity"
);

const COOKIE_NAME = "agency_portal_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  roleName: string;
  tenantId: string | null;
  permissions: string[];
}

/**
 * Creates an encrypted JWT session cookie valid for 7 days.
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Retrieves and validates the current active user session.
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Deletes the session cookie (Logout).
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
