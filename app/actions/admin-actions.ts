"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireAuth } from "@/lib/auth/permissions";
import { TenantSize, ClientStatus, PriorityLevel, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Super Admin creates a new client company (Tenant).
 */
export async function createTenantAction(formData: FormData) {
  const session = await requirePermission("clients.create");

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const companySize = (formData.get("companySize") as TenantSize) || "SMALL_BUSINESS";
  const website = formData.get("website") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const primaryContact = formData.get("primaryContact") as string;
  const retainerValueStr = formData.get("monthlyRetainerValue") as string;
  const monthlyRetainerValue = parseFloat(retainerValueStr || "0");

  if (!name || !email) {
    return { success: false, error: "Company name and email are required." };
  }

  try {
    const tenant = await prisma.tenant.create({
      data: {
        name,
        industry,
        companySize,
        website,
        email,
        phone,
        primaryContact,
        monthlyRetainerValue,
        clientStatus: ClientStatus.ONBOARDING,
        priorityLevel: PriorityLevel.MEDIUM,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        action: "CREATE_TENANT",
        entityType: "TENANT",
        entityId: tenant.id,
        description: `Registered new client company '${name}'.`,
      },
    });

    revalidatePath("/admin/tenants");
    return { success: true };
  } catch (error: any) {
    console.error("Create tenant error:", error);
    return { success: false, error: "Failed to create tenant company." };
  }
}

/**
 * Server Action: Create a new user (Staff or Client user).
 */
export async function createUserAction(formData: FormData) {
  const session = await requireAuth();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const roleName = formData.get("roleName") as string;
  const tenantId = (formData.get("tenantId") as string) || null;
  const title = formData.get("title") as string;

  if (!name || !email || !password || !roleName) {
    return { success: false, error: "Name, email, password, and role are required." };
  }

  try {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      return { success: false, error: "Invalid role selected." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        title,
        passwordHash,
        roleId: role.id,
        tenantId,
        status: UserStatus.ACTIVE,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        tenantId,
        action: "CREATE_USER",
        entityType: "USER",
        entityId: newUser.id,
        description: `Created user ${email} with role ${roleName}.`,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Create user error:", error);
    return { success: false, error: "Failed to create user." };
  }
}

/**
 * Server Action: Fetches Security Audit Logs for Super Admin console.
 */
export async function getAuditLogsAction() {
  const session = await requireAuth();

  const auditLogs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { name: true, email: true } },
      tenant: { select: { name: true } },
    },
  });

  return auditLogs;
}
