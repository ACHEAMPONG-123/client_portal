import React from "react";
import { getAuditLogsAction } from "@/app/actions/admin-actions";

export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";

export default async function AdminAuditPage() {
  const auditLogs = await getAuditLogsAction();

  return (
    <div className="flex min-h-screen bg-[#F2F3F4]">
      <Sidebar userRole="SUPER_ADMIN" tenantName="Super Admin Console" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={{ name: "Alex Vance", email: "superadmin@agency.com", roleName: "SUPER_ADMIN" }} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Security & Compliance Audit Trail
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Immutable log of user authentication, administrative changes, deliverable approvals, and security events.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent System Audit Events ({auditLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold">
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3">Actor / User</th>
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Tenant Scope</th>
                      <th className="py-3 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-3 text-[#64748B] font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#0F172A]">
                          {log.actor?.name || "System"}
                          <span className="block text-[10px] font-normal text-[#94A3B8]">{log.actor?.email}</span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="neutral">{log.action}</Badge>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#475569]">
                          {log.tenant?.name || "Global / System"}
                        </td>
                        <td className="py-3 px-3 text-[#475569]">{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
