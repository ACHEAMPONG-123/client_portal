import React from "react";
import { getClientDashboardData } from "@/app/actions/client-actions";

export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderGit2, ExternalLink, FileText, Image as ImageIcon, PieChart, Shield } from "lucide-react";

export default async function ClientDriveHubPage() {
  const data = await getClientDashboardData();
  const { userSession, tenant, driveResources } = data;

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
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Google Drive Resources Hub
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Direct secure links to your company&apos;s Google Drive folders, brand assets, website files, and monthly reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {driveResources.map((res) => (
              <Card key={res.id} className="hover:border-[#138808] transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-xl bg-[#E8F5E9] text-[#138808]">
                      {res.resourceType === "BRAND_ASSET" ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : res.resourceType === "MARKETING_REPORTS" ? (
                        <PieChart className="w-5 h-5" />
                      ) : (
                        <FolderGit2 className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F2F3F4] text-[#64748B]">
                      {res.resourceType.replace("_", " ")}
                    </span>
                  </div>
                  <CardTitle className="text-base">{res.name}</CardTitle>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{res.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] mb-4">
                    <div className="flex items-center space-x-2 text-[11px] text-[#64748B]">
                      <Shield className="w-3.5 h-3.5 text-[#138808]" />
                      <span>Google Drive Authorized Access</span>
                    </div>
                  </div>

                  <a href={res.url} target="_blank" rel="noreferrer" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      <span>Open in Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
