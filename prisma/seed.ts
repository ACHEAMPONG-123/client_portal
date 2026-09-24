import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const rawConnStr = process.env.DATABASE_URL || "mysql://root@localhost:3306/client_portal";
const connectionString = rawConnStr.replace(/^mysql:\/\//, "mariadb://");
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("[SEED] Starting seed script...");

  // Clear existing data safely
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.googleDriveResource.deleteMany();
  await prisma.document.deleteMany();
  await prisma.revisionRequest.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.deliverableVersion.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.tenant.deleteMany();

  console.log("[SEED] Cleared existing database tables.");

  // 1. Roles & Permissions Setup
  const roleNames = [
    "SUPER_ADMIN",
    "ADMIN",
    "PROJECT_MANAGER",
    "DESIGNER",
    "DEVELOPER",
    "MARKETER",
    "CONTENT_CREATOR",
    "FINANCE",
    "SUPPORT",
    "CLIENT_ADMIN",
    "CLIENT_USER",
  ];

  const rolesMap: Record<string, string> = {};
  for (const name of roleNames) {
    const role = await prisma.role.create({
      data: {
        name,
        description: `System role for ${name.replace("_", " ")}`,
        isSystem: true,
      },
    });
    rolesMap[name] = role.id;
  }

  const permissionsList = [
    { key: "clients.view", description: "View client information" },
    { key: "clients.create", description: "Register new client tenant" },
    { key: "clients.edit", description: "Edit client information" },
    { key: "clients.delete", description: "Remove client tenant" },
    { key: "projects.view", description: "View projects" },
    { key: "projects.create", description: "Create new projects" },
    { key: "projects.edit", description: "Edit projects" },
    { key: "tasks.view", description: "View task list" },
    { key: "tasks.create", description: "Create new task" },
    { key: "tasks.assign", description: "Assign task to staff member" },
    { key: "tasks.submit", description: "Submit deliverable for task" },
    { key: "tasks.approve", description: "Approve deliverables" },
    { key: "documents.view", description: "View documents & drive links" },
    { key: "documents.upload", description: "Add drive links or documents" },
    { key: "documents.delete", description: "Delete document" },
    { key: "invoices.view", description: "View invoices & financial overview" },
    { key: "invoices.create", description: "Create & manage invoices" },
    { key: "reports.view", description: "View analytics & strategy reports" },
    { key: "reports.publish", description: "Publish marketing & SEO reports" },
  ];

  for (const perm of permissionsList) {
    const p = await prisma.permission.create({ data: perm });
    // Assign permissions to SUPER_ADMIN & ADMIN
    await prisma.rolePermission.create({
      data: { roleId: rolesMap["SUPER_ADMIN"], permissionId: p.id },
    });
    await prisma.rolePermission.create({
      data: { roleId: rolesMap["ADMIN"], permissionId: p.id },
    });

    if (perm.key.startsWith("projects.") || perm.key.startsWith("tasks.") || perm.key.startsWith("documents.")) {
      await prisma.rolePermission.create({
        data: { roleId: rolesMap["PROJECT_MANAGER"], permissionId: p.id },
      });
    }

    if (perm.key.startsWith("tasks.submit") || perm.key.startsWith("tasks.view")) {
      await prisma.rolePermission.create({
        data: { roleId: rolesMap["DESIGNER"], permissionId: p.id },
      });
      await prisma.rolePermission.create({
        data: { roleId: rolesMap["DEVELOPER"], permissionId: p.id },
      });
      await prisma.rolePermission.create({
        data: { roleId: rolesMap["MARKETER"], permissionId: p.id },
      });
    }

    if (perm.key.includes("view") || perm.key.includes("approve")) {
      await prisma.rolePermission.create({
        data: { roleId: rolesMap["CLIENT_ADMIN"], permissionId: p.id },
      });
      await prisma.rolePermission.create({
        data: { roleId: rolesMap["CLIENT_USER"], permissionId: p.id },
      });
    }
  }

  console.log("[SEED] Roles and permissions seeded.");

  // 2. Tenants (Companies)
  const acmeTenant = await prisma.tenant.create({
    data: {
      name: "Acme Corporation",
      logo: "/logos/acme.png",
      industry: "E-Commerce & Retail",
      companySize: "ENTERPRISE",
      website: "https://acmecorp.example.com",
      email: "contact@acmecorp.example.com",
      phone: "+1 (555) 234-5678",
      primaryContact: "Sarah Jenkins (VP Digital)",
      clientStatus: "ACTIVE",
      servicePackages: JSON.stringify(["Full Digital Retainer", "SEO Accelerator", "Web Development"]),
      monthlyRetainerValue: 12500.00,
      contractStart: new Date("2026-01-01"),
      contractEnd: new Date("2026-12-31"),
      priorityLevel: "HIGH",
      notes: "Enterprise account requiring weekly strategy syncs and strict turnaround SLAs.",
    },
  });

  const nexusTenant = await prisma.tenant.create({
    data: {
      name: "Nexus Tech Solutions",
      logo: "/logos/nexustech.png",
      industry: "Software & Cloud Services",
      companySize: "MEDIUM_BUSINESS",
      website: "https://nexustech.example.com",
      email: "hello@nexustech.example.com",
      phone: "+1 (555) 987-6543",
      primaryContact: "David Miller (CTO)",
      clientStatus: "ACTIVE",
      servicePackages: JSON.stringify(["SaaS Branding", "UI/UX Design System"]),
      monthlyRetainerValue: 8000.00,
      contractStart: new Date("2026-03-01"),
      contractEnd: new Date("2027-02-28"),
      priorityLevel: "MEDIUM",
      notes: "Focusing on upcoming v2 platform redesign and developer documentation branding.",
    },
  });

  console.log("[SEED] Tenants seeded (Acme Corp & Nexus Tech).");

  // 3. Password Hashing & Users
  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  const superAdminUser = await prisma.user.create({
    data: {
      email: "superadmin@agency.com",
      name: "Alex Vance",
      title: "Agency Founder & CEO",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["SUPER_ADMIN"],
      status: "ACTIVE",
    },
  });

  const pmUser = await prisma.user.create({
    data: {
      email: "pm@agency.com",
      name: "Marcus Aurelius",
      title: "Lead Project Manager",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["PROJECT_MANAGER"],
      status: "ACTIVE",
    },
  });

  const designerUser = await prisma.user.create({
    data: {
      email: "designer@agency.com",
      name: "Elena Rostova",
      title: "Senior UI/UX Designer",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["DESIGNER"],
      status: "ACTIVE",
    },
  });

  const devUser = await prisma.user.create({
    data: {
      email: "dev@agency.com",
      name: "Kofi Mensah",
      title: "Lead Frontend Developer",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["DEVELOPER"],
      status: "ACTIVE",
    },
  });

  const clientAdminAcme = await prisma.user.create({
    data: {
      email: "clientadmin@acme.com",
      name: "Sarah Jenkins",
      title: "VP of Marketing",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["CLIENT_ADMIN"],
      tenantId: acmeTenant.id,
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      email: "clientuser@acme.com",
      name: "Tom Holland",
      title: "Brand Strategist",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["CLIENT_USER"],
      tenantId: acmeTenant.id,
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      email: "clientadmin@nexustech.com",
      name: "David Miller",
      title: "Chief Technology Officer",
      passwordHash: defaultPasswordHash,
      roleId: rolesMap["CLIENT_ADMIN"],
      tenantId: nexusTenant.id,
      status: "ACTIVE",
    },
  });

  console.log("[SEED] Users seeded (Agency Staff & Client Accounts).");

  // 4. Projects for Acme Corp
  const acmeProject1 = await prisma.project.create({
    data: {
      name: "Acme E-Commerce Platform Redesign v3",
      tenantId: acmeTenant.id,
      projectManagerId: pmUser.id,
      projectType: "WEBSITE",
      status: "IN_PROGRESS",
      priority: "HIGH",
      startDate: new Date("2026-08-01"),
      deadline: new Date("2026-11-15"),
      progress: 65,
      budget: 35000.00,
      currency: "USD",
      clientApprovalRequired: true,
      description: "Full modern web development & headless storefront transformation for Acme Corp's flagship catalog.",
      internalNotes: "Frontend code architecture in Next.js App Router. Client requested gold accent details.",
    },
  });

  const acmeProject2 = await prisma.project.create({
    data: {
      name: "Q3 High-Intent Performance Marketing & SEO",
      tenantId: acmeTenant.id,
      projectManagerId: pmUser.id,
      projectType: "SEO",
      status: "IN_PROGRESS",
      priority: "URGENT",
      startDate: new Date("2026-07-01"),
      deadline: new Date("2026-09-30"),
      progress: 80,
      budget: 15000.00,
      currency: "USD",
      clientApprovalRequired: true,
      description: "Targeted organic ranking optimization and PPC conversion campaign.",
      internalNotes: "Monthly report dashboard linked via Google Drive folder.",
    },
  });

  // Project for Nexus Tech
  const nexusProject = await prisma.project.create({
    data: {
      name: "Nexus Cloud Developer Portal Branding",
      tenantId: nexusTenant.id,
      projectManagerId: pmUser.id,
      projectType: "BRANDING",
      status: "REVIEW",
      priority: "MEDIUM",
      startDate: new Date("2026-08-15"),
      deadline: new Date("2026-10-01"),
      progress: 90,
      budget: 18000.00,
      currency: "USD",
      clientApprovalRequired: true,
      description: "Complete design system, dark/light UI tokens, and brand identity guidelines.",
      internalNotes: "Awaiting client final signoff on V2 brand deck.",
    },
  });

  console.log("[SEED] Projects seeded.");

  // 5. Tasks & Deliverables for Acme Project 1
  const task1 = await prisma.task.create({
    data: {
      title: "Hero Section & Interactive Catalog Design (Figma)",
      projectId: acmeProject1.id,
      tenantId: acmeTenant.id,
      creatorId: pmUser.id,
      assigneeId: designerUser.id,
      status: "CLIENT_REVIEW",
      priority: "HIGH",
      deadline: new Date("2026-09-25"),
      description: "Design high-fidelity responsive wireframes for desktop & mobile hero section.",
      internalNotes: "Designer completed V2 based on Sarah's feedback regarding call-to-action button color.",
      clientVisibility: true,
    },
  });

  await prisma.task.create({
    data: {
      title: "API Checkout Integration & Payment Boundary",
      projectId: acmeProject1.id,
      tenantId: acmeTenant.id,
      creatorId: pmUser.id,
      assigneeId: devUser.id,
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      deadline: new Date("2026-10-10"),
      description: "Build secure tokenized payment endpoint integration.",
      internalNotes: "Internal dev task only. Hidden from client until fully QA tested.",
      clientVisibility: false,
    },
  });

  // Deliverable for Task 1
  const deliverable1 = await prisma.deliverable.create({
    data: {
      name: "Acme Storefront Homepage Concept V2",
      projectId: acmeProject1.id,
      taskId: task1.id,
      tenantId: acmeTenant.id,
      creatorId: designerUser.id,
      currentVersion: "V2",
      status: "CLIENT_VISIBLE",
      clientVisible: true,
      clientApprovalRequired: true,
      approvalStatus: "PENDING",
      internalNotes: "V2 reflects green primary buttons and gold accent highlights requested by client.",
      clientDescription: "Updated high-fidelity UI layout for the Acme main storefront homepage. Click the link to review interactive Figma prototype.",
      externalDriveLink: "https://drive.google.com/file/d/demo-acme-homepage-v2/view?usp=sharing",
    },
  });

  await prisma.deliverableVersion.create({
    data: {
      deliverableId: deliverable1.id,
      versionLabel: "V1",
      submittedById: designerUser.id,
      externalDriveLink: "https://drive.google.com/file/d/demo-acme-homepage-v1/view?usp=sharing",
      description: "Initial desktop layout wireframes",
      reviewStatus: "REVISION_REQUIRED",
      revisionNotes: "Client requested India Green (#138808) CTA buttons and Gold accent badges.",
    },
  });

  await prisma.deliverableVersion.create({
    data: {
      deliverableId: deliverable1.id,
      versionLabel: "V2",
      submittedById: designerUser.id,
      externalDriveLink: "https://drive.google.com/file/d/demo-acme-homepage-v2/view?usp=sharing",
      description: "Refined colors with white base, green buttons, and gold highlights.",
      reviewStatus: "CLIENT_VISIBLE",
      revisionNotes: "Submitted to client for approval.",
    },
  });

  console.log("[SEED] Tasks & Deliverables with Version History seeded.");

  // 6. Google Drive Resources Hub
  await prisma.googleDriveResource.createMany({
    data: [
      {
        tenantId: acmeTenant.id,
        projectId: acmeProject1.id,
        name: "Acme Official Brand Guidelines & Logo Assets",
        resourceType: "BRAND_ASSET",
        url: "https://drive.google.com/drive/folders/acme-brand-assets-2026",
        description: "Vector logos, font files (Inter Tight), and color specification sheets.",
        clientVisible: true,
      },
      {
        tenantId: acmeTenant.id,
        projectId: acmeProject1.id,
        name: "Website Deliverables & Prototype Drive Root",
        resourceType: "WEBSITE_FILES",
        url: "https://drive.google.com/drive/folders/acme-website-deliverables",
        description: "Contains all exported design assets, wireframes, and staging build builds.",
        clientVisible: true,
      },
      {
        tenantId: acmeTenant.id,
        projectId: acmeProject2.id,
        name: "August 2026 SEO & Performance Marketing Report",
        resourceType: "MARKETING_REPORTS",
        url: "https://drive.google.com/file/d/acme-seo-report-august-2026/view",
        description: "Comprehensive traffic analysis, keyword rankings, and ROI performance breakdown.",
        clientVisible: true,
      },
      {
        tenantId: nexusTenant.id,
        projectId: nexusProject.id,
        name: "Nexus Tech Brand Deck & Iconography Package",
        resourceType: "BRAND_ASSET",
        url: "https://drive.google.com/drive/folders/nexustech-brand-assets",
        description: "High-resolution SVG icon set and brand presentation slides.",
        clientVisible: true,
      },
    ],
  });

  console.log("[SEED] Google Drive Resources seeded.");

  // 7. Meetings (Cal.com integration links)
  await prisma.meeting.create({
    data: {
      tenantId: acmeTenant.id,
      type: "STRATEGY",
      hostId: pmUser.id,
      attendees: JSON.stringify(["sarah@acmecorp.example.com", "pm@agency.com"]),
      dateTime: new Date("2026-09-28T14:00:00Z"),
      timeZone: "America/New_York",
      externalBookingId: "cal-booking-acme-sync-9821",
      status: "SCHEDULED",
      notes: "Bi-weekly strategy sync to review Q4 performance marketing goals and website rollout date.",
      bookingUrl: "https://cal.com/agency-strategy/30min",
    },
  });

  // 8. Support Tickets / Requests
  await prisma.supportTicket.create({
    data: {
      ticketNumber: "REQ-2026-104",
      tenantId: acmeTenant.id,
      submittedById: clientAdminAcme.id,
      subject: "Add New Product Category Banner to Staging Homepage",
      category: "WEBSITE",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assigneeId: devUser.id,
      description: "We need the new Autumn promotional banner integrated into the top hero carousel on the staging environment.",
      internalNotes: "Dev assigned. High priority request.",
    },
  });

  // 9. Invoices
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: "INV-2026-089",
        tenantId: acmeTenant.id,
        projectId: acmeProject1.id,
        amount: 12500.00,
        tax: 0.00,
        total: 12500.00,
        currency: "USD",
        dueDate: new Date("2026-10-01"),
        status: "UNPAID",
        notes: "Monthly Digital Retainer & Website Milestone 2 Payment.",
      },
      {
        invoiceNumber: "INV-2026-072",
        tenantId: acmeTenant.id,
        projectId: acmeProject2.id,
        amount: 12500.00,
        tax: 0.00,
        total: 12500.00,
        currency: "USD",
        dueDate: new Date("2026-09-01"),
        paidDate: new Date("2026-08-29"),
        status: "PAID",
        paymentMethod: "Bank Wire Transfer",
        receiptUrl: "https://drive.google.com/file/d/receipt-inv-072/view",
        notes: "Paid in full. Thank you!",
      },
      {
        invoiceNumber: "INV-2026-091",
        tenantId: nexusTenant.id,
        projectId: nexusProject.id,
        amount: 8000.00,
        tax: 0.00,
        total: 8000.00,
        currency: "USD",
        dueDate: new Date("2026-09-15"),
        status: "OVERDUE",
        notes: "Branding Milestone 1 Retainer.",
      },
    ],
  });

  console.log("[SEED] Invoices seeded.");

  // 10. Audit Log Initial Entry
  await prisma.auditLog.create({
    data: {
      actorId: superAdminUser.id,
      action: "SYSTEM_INITIALIZED",
      entityType: "SYSTEM",
      description: "Database seeded with multi-tenant agency structure, roles, permissions, and initial client workspace data.",
    },
  });

  console.log("[SEED] Seed process completed successfully!");
}

main()
  .catch((e) => {
    console.error("[SEED ERROR] Seed script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
