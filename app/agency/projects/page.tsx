"use client";

import React, { useState } from "react";
import { setClientVisibilityAction } from "@/app/actions/deliverable-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, FolderKanban, CheckCircle2 } from "lucide-react";

export default function AgencyProjectsPage() {
  const [clientVisible, setClientVisible] = useState(true);

  const toggleVisibility = async () => {
    // Demo action toggle
    await setClientVisibilityAction("demo_deliverable_id", !clientVisible);
    setClientVisible(!clientVisible);
  };

  return (
    <div className="flex min-h-screen bg-[#F2F3F4]">
      <Sidebar userRole="PROJECT_MANAGER" tenantName="Agency PM Console" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={{ name: "Marcus Aurelius", email: "pm@agency.com", roleName: "PROJECT_MANAGER" }} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Project Management & Client Visibility Controls
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Review internal deliverables before making them visible to client accounts.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Deliverable Client Visibility Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold">
                      <th className="py-3 px-3">Client Company</th>
                      <th className="py-3 px-3">Deliverable Name</th>
                      <th className="py-3 px-3">Version</th>
                      <th className="py-3 px-3">Internal Status</th>
                      <th className="py-3 px-3">Client Visibility</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-3.5 px-3 font-bold text-[#0F172A]">Acme Corporation</td>
                      <td className="py-3.5 px-3 font-semibold text-[#0F172A]">Storefront Homepage Concept</td>
                      <td className="py-3.5 px-3"><Badge variant="gold">V2</Badge></td>
                      <td className="py-3.5 px-3"><Badge variant="inProgress">Under Review</Badge></td>
                      <td className="py-3.5 px-3">
                        {clientVisible ? (
                          <Badge variant="active">Visible to Client</Badge>
                        ) : (
                          <Badge variant="neutral">Hidden from Client</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Button variant={clientVisible ? "outline" : "primary"} size="sm" onClick={toggleVisibility}>
                          {clientVisible ? (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Hide from Client</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Make Client Visible</span>
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
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
