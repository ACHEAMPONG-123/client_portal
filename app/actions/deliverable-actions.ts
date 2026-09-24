"use server";

import { prisma } from "@/lib/prisma";
import { getTenantContext, requireAuth } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Submit a new deliverable or a new deliverable version.
 */
export async function submitDeliverableVersionAction(formData: FormData) {
  const session = await requireAuth();

  const deliverableId = formData.get("deliverableId") as string | null;
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const versionLabel = (formData.get("versionLabel") as string) || "V1";
  const externalDriveLink = formData.get("externalDriveLink") as string;
  const clientDescription = formData.get("clientDescription") as string;
  const internalNotes = formData.get("internalNotes") as string;

  if (!projectId || !name || !externalDriveLink) {
    return { success: false, error: "Project, name, and Google Drive link are required." };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    let targetDeliverableId = deliverableId;

    // Create or update deliverable
    if (!targetDeliverableId) {
      const newDeliverable = await prisma.deliverable.create({
        data: {
          name,
          projectId,
          tenantId: project.tenantId,
          creatorId: session.userId,
          currentVersion: versionLabel,
          status: "SUBMITTED",
          clientVisible: false, // Default to NOT client visible until PM approves
          clientApprovalRequired: true,
          approvalStatus: "PENDING",
          clientDescription,
          internalNotes,
          externalDriveLink,
        },
      });
      targetDeliverableId = newDeliverable.id;
    } else {
      await prisma.deliverable.update({
        where: { id: targetDeliverableId },
        data: {
          currentVersion: versionLabel,
          status: "SUBMITTED",
          externalDriveLink,
          clientDescription,
          internalNotes,
        },
      });
    }

    // Add version history record
    await prisma.deliverableVersion.create({
      data: {
        deliverableId: targetDeliverableId,
        versionLabel,
        submittedById: session.userId,
        externalDriveLink,
        description: clientDescription,
        reviewStatus: "SUBMITTED",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        tenantId: project.tenantId,
        action: "SUBMIT_DELIVERABLE_VERSION",
        entityType: "DELIVERABLE",
        entityId: targetDeliverableId,
        description: `Submitted ${versionLabel} for deliverable '${name}'.`,
      },
    });

    revalidatePath("/agency/tasks");
    revalidatePath("/client/approvals");

    return { success: true };
  } catch (error: any) {
    console.error("Submit deliverable version error:", error);
    return { success: false, error: "Failed to submit deliverable version." };
  }
}

/**
 * Server Action: Agency PM toggles deliverable client visibility.
 */
export async function setClientVisibilityAction(deliverableId: string, clientVisible: boolean) {
  const session = await requireAuth();

  try {
    const deliverable = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { clientVisible },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        tenantId: deliverable.tenantId,
        action: clientVisible ? "MAKE_DELIVERABLE_CLIENT_VISIBLE" : "HIDE_DELIVERABLE_FROM_CLIENT",
        entityType: "DELIVERABLE",
        entityId: deliverableId,
        description: `Set client visibility to ${clientVisible} for deliverable '${deliverable.name}'.`,
      },
    });

    revalidatePath("/agency/projects");
    revalidatePath("/client/approvals");

    return { success: true };
  } catch (error: any) {
    console.error("Set client visibility error:", error);
    return { success: false, error: "Failed to update client visibility." };
  }
}

/**
 * Server Action: Client approves a deliverable.
 */
export async function clientApproveDeliverableAction(deliverableId: string, comment?: string) {
  const { tenantId, userSession } = await getTenantContext();

  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
    });

    if (!deliverable || deliverable.tenantId !== tenantId) {
      return { success: false, error: "Deliverable not found or unauthorized access." };
    }

    // Update deliverable approval status
    await prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        approvalStatus: "APPROVED",
        status: "APPROVED",
      },
    });

    // Create approval record
    await prisma.approval.create({
      data: {
        deliverableId,
        tenantId,
        reviewerId: userSession.userId,
        status: "APPROVED",
        comment: comment || "Approved by client.",
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: userSession.userId,
        tenantId,
        action: "CLIENT_APPROVE_DELIVERABLE",
        entityType: "DELIVERABLE",
        entityId: deliverableId,
        description: `Client approved deliverable '${deliverable.name}' (${deliverable.currentVersion}).`,
      },
    });

    revalidatePath("/client/approvals");
    revalidatePath("/agency/tasks");

    return { success: true };
  } catch (error: any) {
    console.error("Client approve error:", error);
    return { success: false, error: "Failed to approve deliverable." };
  }
}

/**
 * Server Action: Client requests changes on a deliverable.
 */
export async function clientRequestChangesAction(
  deliverableId: string,
  requestedChanges: string
) {
  const { tenantId, userSession } = await getTenantContext();

  if (!requestedChanges) {
    return { success: false, error: "Please describe the requested changes." };
  }

  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
    });

    if (!deliverable || deliverable.tenantId !== tenantId) {
      return { success: false, error: "Deliverable not found or unauthorized access." };
    }

    // Update deliverable status to REVISION_REQUIRED
    await prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        approvalStatus: "CHANGES_REQUESTED",
        status: "REVISION_REQUIRED",
      },
    });

    // Create Revision Request entry
    await prisma.revisionRequest.create({
      data: {
        deliverableId,
        requestedById: userSession.userId,
        assignedToId: deliverable.creatorId,
        description: requestedChanges,
        status: "OPEN",
      },
    });

    // Create Approval record
    await prisma.approval.create({
      data: {
        deliverableId,
        tenantId,
        reviewerId: userSession.userId,
        status: "CHANGES_REQUESTED",
        requestedChanges,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: userSession.userId,
        tenantId,
        action: "CLIENT_REQUESTED_CHANGES",
        entityType: "DELIVERABLE",
        entityId: deliverableId,
        description: `Client requested changes on deliverable '${deliverable.name}'. Feedback: ${requestedChanges}`,
      },
    });

    revalidatePath("/client/approvals");
    revalidatePath("/agency/tasks");

    return { success: true };
  } catch (error: any) {
    console.error("Request changes error:", error);
    return { success: false, error: "Failed to submit revision request." };
  }
}

/**
 * Server Action: Fetches Task Board and Project selection list for Agency workspace.
 */
export async function getAgencyTaskBoardData() {
  const session = await requireAuth();

  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, tenantId: true },
  });

  const tasks = await prisma.task.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { name: true } },
      tenant: { select: { name: true } },
      assignee: { select: { name: true } },
    },
  });

  const deliverables = await prisma.deliverable.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { name: true } },
      tenant: { select: { name: true } },
      versions: { orderBy: { createdAt: "desc" } },
    },
  });

  return {
    userSession: session,
    projects,
    tasks,
    deliverables,
  };
}

/**
 * Server Action: Fetches Deliverables Visibility Matrix for Agency PMs.
 */
export async function getAgencyProjectsData() {
  const session = await requireAuth();

  const deliverables = await prisma.deliverable.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { name: true } },
      tenant: { select: { name: true } },
    },
  });

  return {
    userSession: session,
    deliverables,
  };
}

