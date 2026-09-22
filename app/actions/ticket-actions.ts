"use server";

import { prisma } from "@/lib/prisma";
import { getTenantContext, requireAuth } from "@/lib/auth/permissions";
import { TicketCategory, PriorityLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Client submits a new support request.
 */
export async function createTicketAction(formData: FormData) {
  const { tenantId, userSession } = await getTenantContext();

  if (!tenantId) {
    return { success: false, error: "Tenant context missing." };
  }

  const subject = formData.get("subject") as string;
  const category = (formData.get("category") as TicketCategory) || "GENERAL";
  const priority = (formData.get("priority") as PriorityLevel) || "MEDIUM";
  const description = formData.get("description") as string;

  if (!subject || !description) {
    return { success: false, error: "Subject and description are required." };
  }

  try {
    const ticketCount = await prisma.supportTicket.count({ where: { tenantId } });
    const ticketNumber = `REQ-2026-${100 + ticketCount + 1}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        tenantId,
        submittedById: userSession.userId,
        subject,
        category,
        priority,
        status: "OPEN",
        description,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: userSession.userId,
        tenantId,
        action: "CREATE_SUPPORT_TICKET",
        entityType: "SUPPORT_TICKET",
        entityId: ticket.id,
        description: `Created support ticket ${ticketNumber}: ${subject}`,
      },
    });

    revalidatePath("/client/requests");
    return { success: true, ticketNumber };
  } catch (error: any) {
    console.error("Create ticket error:", error);
    return { success: false, error: "Failed to create support ticket." };
  }
}
