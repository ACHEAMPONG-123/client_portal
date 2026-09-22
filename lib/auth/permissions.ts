import { getSession, SessionPayload } from "./session";

/**
 * Server Security Guard: Ensures user is authenticated.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: User session required");
  }
  return session;
}

/**
 * Server Security Guard: Ensures user has specific permission key or SUPER_ADMIN role.
 */
export async function requirePermission(permissionKey: string): Promise<SessionPayload> {
  const session = await requireAuth();
  
  if (session.roleName === "SUPER_ADMIN") return session;

  const hasPerm = session.permissions.includes(permissionKey);
  if (!hasPerm) {
    throw new Error(`FORBIDDEN: Missing required permission '${permissionKey}'`);
  }

  return session;
}

/**
 * Server Security Guard: Tenant Isolation Enforcer.
 * For client users, forces all DB queries to be scoped strictly to session.tenantId.
 * Prevents client-supplied tenantId tampering or cross-tenant leakage.
 */
export async function getTenantContext(requestedTenantId?: string): Promise<{
  tenantId: string | null;
  isAgencyStaff: boolean;
  isSuperAdmin: boolean;
  userSession: SessionPayload;
}> {
  const session = await requireAuth();

  const isSuperAdmin = session.roleName === "SUPER_ADMIN";
  const isAgencyStaff = [
    "SUPER_ADMIN",
    "ADMIN",
    "PROJECT_MANAGER",
    "DESIGNER",
    "DEVELOPER",
    "MARKETER",
    "CONTENT_CREATOR",
    "FINANCE",
    "SUPPORT",
  ].includes(session.roleName);

  // If client user, NEVER trust frontend/url requestedTenantId. Force session.tenantId!
  if (!isAgencyStaff) {
    if (!session.tenantId) {
      throw new Error("FORBIDDEN: Client user account has no associated tenant ID");
    }
    return {
      tenantId: session.tenantId,
      isAgencyStaff: false,
      isSuperAdmin: false,
      userSession: session,
    };
  }

  // If Agency Staff, they can optionally view a specific requested tenant, or all if null
  return {
    tenantId: requestedTenantId || session.tenantId || null,
    isAgencyStaff: true,
    isSuperAdmin,
    userSession: session,
  };
}
