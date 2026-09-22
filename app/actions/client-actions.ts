"use server";

import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/auth/permissions";

/**
 * Server Action: Fetches all tenant-isolated data for the Client Workspace Dashboard.
 * Enforces strict server-side tenant scoping.
 * Time complexity: O(N) where N is tenant projects count.
 * Space complexity: O(N)
 */
export async function getClientDashboardData(requestedTenantId?: string) {
  const { tenantId, userSession } = await getTenantContext(requestedTenantId);

  if (!tenantId) {
    throw new Error("No tenant context found.");
  }

  // 1. Fetch Tenant Company details
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  // 2. Fetch Active Projects
  const projects = await prisma.project.findMany({
    where: { tenantId },
    include: {
      projectManager: {
        select: { name: true, email: true, title: true, avatarUrl: true },
      },
      deliverables: {
        where: { clientVisible: true },
      },

    },
    orderBy: { updatedAt: "desc" },
  });

  // 3. Fetch Pending Approvals (Client-visible deliverables needing approval)
  const pendingApprovals = await prisma.deliverable.findMany({
    where: {
      tenantId,
      clientVisible: true,
      approvalStatus: "PENDING",
    },
    include: {
      project: { select: { name: true } },
      creator: { select: { name: true, title: true } },
      versions: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // 4. Fetch Google Drive Resources Hub
  const driveResources = await prisma.googleDriveResource.findMany({
    where: { tenantId, clientVisible: true },
    orderBy: { createdAt: "desc" },
  });

  // 5. Fetch Support Tickets / Requests
  const supportTickets = await prisma.supportTicket.findMany({
    where: { tenantId },
    include: {
      submittedBy: { select: { name: true } },
      assignee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 6. Fetch Invoices
  const invoices = await prisma.invoice.findMany({
    where: { tenantId },
    orderBy: { dueDate: "asc" },
  });

  // 7. Fetch Meetings
  const meetings = await prisma.meeting.findMany({
    where: { tenantId },
    orderBy: { dateTime: "asc" },
  });

  return {
    userSession,
    tenant,
    projects,
    pendingApprovals,
    driveResources,
    supportTickets,
    invoices,
    meetings,
  };
}
