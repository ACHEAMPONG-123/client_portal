import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { getClientDashboardData } from "@/app/actions/client-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  FileCheck,
  CreditCard,
  PhoneCall,
  MessageCircle,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

export default async function ClientDashboardPage() {
  const data = await getClientDashboardData();
  const { userSession, tenant, projects, pendingApprovals, driveResources, supportTickets, invoices } = data;

  const activeProjectsCount = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "REVIEW").length;
  const pendingCount = pendingApprovals.length;
  const unpaidInvoicesCount = invoices.filter((i) => i.status === "UNPAID" || i.status === "OVERDUE").length;

  return (
    <div className="flex min-h-screen bg-[#F2F3F4]">
      <Sidebar userRole={userSession.roleName} tenantName={tenant.name} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={{
            name: userSession.name,
            email: userSession.email,
            roleName: userSession.roleName,
            tenantName: tenant.name,
          }}
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Header Banner */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  Welcome back, {userSession.name.split(" ")[0]} 👋
                </h1>
                <Badge variant="active" className="text-xs">
                  {tenant.name}
                </Badge>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Monitor active agency projects, review client-facing deliverables, access Google Drive resources, and track invoices.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Link href="/client/requests">
                <Button variant="outline" size="sm">
                  <PlusCircle className="w-3.5 h-3.5 text-[#138808]" />
                  <span>Submit Request</span>
                </Button>
              </Link>
              <a href="https://cal.com/agency-strategy/30min" target="_blank" rel="noreferrer">
                <Button variant="primary" size="sm">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Book Strategy Call</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Metric Cards Grid (Matching Inspo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <Card className="hover:border-[#CBD5E1] transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#64748B]">Active Projects</span>
                  <FolderGit2 className="w-4 h-4 text-[#138808]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-[#0F172A]">{activeProjectsCount}</span>
                  <span className="text-[11px] font-semibold text-[#138808]">+12% vs last month</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">In progress & under review</p>
              </CardContent>
            </Card>

            {/* Metric 2 */}
            <Card className="hover:border-[#CBD5E1] transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#64748B]">Pending Approvals</span>
                  <FileCheck className="w-4 h-4 text-[#FFD700]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-[#0F172A]">{pendingCount}</span>
                  {pendingCount > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFDE7] text-[#B78103] border border-[#FFE082]">
                      Action Required
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#16A34A]">All Approved</span>
                  )}
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Deliverables waiting for review</p>
              </CardContent>
            </Card>

            {/* Metric 3 */}
            <Card className="hover:border-[#CBD5E1] transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#64748B]">Drive Resources</span>
                  <FolderOpen className="w-4 h-4 text-[#0284C7]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-[#0F172A]">{driveResources.length}</span>
                  <span className="text-[11px] font-semibold text-[#0284C7]">Folders & Files</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Google Drive linked assets</p>
              </CardContent>
            </Card>

            {/* Metric 4 */}
            <Card className="hover:border-[#CBD5E1] transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#64748B]">Billing Status</span>
                  <CreditCard className="w-4 h-4 text-[#6366F1]" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    ${tenant.monthlyRetainerValue ? Number(tenant.monthlyRetainerValue).toLocaleString() : "0"}
                  </span>
                  <span className="text-[11px] font-semibold text-[#64748B]">/mo Retainer</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  {unpaidInvoicesCount > 0 ? `${unpaidInvoicesCount} invoice pending` : "Account in good standing"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals Alert Section */}
          {pendingApprovals.length > 0 && (
            <div className="bg-[#FFFDE7] border border-[#FFE082] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-[#B78103]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Deliverables Awaiting Your Approval ({pendingApprovals.length})
                  </h3>
                </div>
                <Link href="/client/approvals">
                  <Button variant="gold" size="sm">
                    Review All Approvals
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingApprovals.slice(0, 2).map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#138808]">{item.project.name}</span>
                        <Badge variant="gold">{item.currentVersion}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{item.name}</h4>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{item.clientDescription || "No description provided."}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
                      <span className="text-[#94A3B8]">Submitted by {item.creator.name}</span>
                      <Link href="/client/approvals">
                        <span className="font-bold text-[#138808] hover:underline flex items-center gap-1">
                          Review & Approve <ExternalLink className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Dashboard Layout Grid (Projects Table + Tasks Widget) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Active Projects Table */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Active Client Projects ({projects.length})</CardTitle>
                    <p className="text-xs text-[#64748B]">Real-time milestone progress & status tracking</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold">
                          <th className="py-3 px-3">Project Name</th>
                          <th className="py-3 px-3">Type</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3">Progress</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {projects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="py-3.5 px-3">
                              <p className="font-bold text-[#0F172A]">{proj.name}</p>
                              <p className="text-[11px] text-[#64748B]">PM: {proj.projectManager?.name || "Unassigned"}</p>
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-[#475569] capitalize">
                              {proj.projectType.toLowerCase().replace("_", " ")}
                            </td>
                            <td className="py-3.5 px-3">
                              <Badge
                                variant={
                                  proj.status === "COMPLETED"
                                    ? "completed"
                                    : proj.status === "IN_PROGRESS"
                                    ? "inProgress"
                                    : proj.status === "REVIEW"
                                    ? "pending"
                                    : "neutral"
                                }
                              >
                                {proj.status.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="w-28 space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-[#0F172A]">
                                  <span>{proj.progress}%</span>
                                </div>
                                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#138808] h-full rounded-full transition-all duration-300"
                                    style={{ width: `${proj.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <Link href="/client/drive">
                                <span className="font-bold text-[#138808] hover:underline">View Assets</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Google Drive Links Hub Quick Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Google Drive Resources Hub</CardTitle>
                    <p className="text-xs text-[#64748B]">Direct access to project files, brand guides & reports</p>
                  </div>
                  <Link href="/client/drive">
                    <Button variant="outline" size="sm">View All Resources</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {driveResources.map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#138808] transition-all flex items-start space-x-3 group"
                      >
                        <div className="p-2 rounded-lg bg-[#E8F5E9] text-[#138808] shrink-0">
                          <FolderGit2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#138808] truncate">
                              {res.name}
                            </h4>
                            <ExternalLink className="w-3 h-3 text-[#94A3B8] group-hover:text-[#138808]" />
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">{res.description}</p>
                          <span className="inline-block text-[10px] font-semibold text-[#138808] mt-1">
                            Google Drive Link ↗
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Today's Tasks & Support Requests Widget */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Support & Service Tickets</CardTitle>
                  <p className="text-xs text-[#64748B]">Recent website & marketing requests</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supportTickets.length === 0 ? (
                    <p className="text-xs text-[#94A3B8] py-4 text-center">No active requests.</p>
                  ) : (
                    supportTickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0F172A]">{ticket.ticketNumber}</span>
                          <Badge variant={ticket.status === "RESOLVED" ? "completed" : "inProgress"}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-[#475569]">{ticket.subject}</p>
                        <p className="text-[11px] text-[#64748B] line-clamp-2">{ticket.description}</p>
                      </div>
                    ))
                  )}

                  <Link href="/client/requests" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Submit New Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Direct Agency Contact Widget */}
              <Card className="bg-gradient-to-br from-white to-[#F2F3F4]">
                <CardHeader>
                  <CardTitle className="text-base">Agency Account Contact</CardTitle>
                  <p className="text-xs text-[#64748B]">Direct assistance & consultation</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-[#E2E8F0]">
                    <div className="w-10 h-10 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      SJ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Sarah Jenkins</p>
                      <p className="text-[11px] text-[#64748B]">Lead Account Director</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href="https://wa.me/15552345678"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#E8F5E9] text-[#138808] border border-[#A5D6A7] hover:bg-[#C8E6C9] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <a
                      href="mailto:sarah@agency.com"
                      className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <span>Send Direct Email</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
