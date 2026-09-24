"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, deleteSession, getSession, SessionPayload } from "@/lib/auth/session";

/**
 * Server Action: Authenticates user and initializes HTTP-only JWT session cookie.
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        tenant: true,
      },
    });

    if (!user) {
      return { success: false, error: "Invalid credentials." };
    }

    if (user.status !== "ACTIVE") {
      return { success: false, error: "Account is suspended or pending activation." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid credentials." };
    }

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.key);

    const payload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      roleName: user.role.name,
      tenantId: user.tenantId,
      permissions,
    };

    await createSession(payload);

    // Record audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        tenantId: user.tenantId,
        action: "USER_LOGIN",
        entityType: "USER",
        entityId: user.id,
        description: `User ${user.email} logged in successfully as ${user.role.name}.`,
      },
    });

    return { success: true, roleName: user.role.name };
  } catch (error: any) {
    console.error("Login action error:", error);
    const detail = process.env.NODE_ENV !== "production" && error?.message ? `: ${error.message}` : "";
    return { success: false, error: `An unexpected error occurred during login${detail}.` };
  }
}

/**
 * Server Action: Logs out the current user session.
 */
export async function logoutAction() {
  await deleteSession();
  return { success: true };
}

/**
 * Server Action: Get active session.
 */
export async function getCurrentUserAction() {
  return await getSession();
}
