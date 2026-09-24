"use client";

import React, { useState, useEffect } from "react";
import { setClientVisibilityAction, getAgencyProjectsData } from "@/app/actions/deliverable-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, FolderKanban, CheckCircle2 } from "lucide-react";

export default function AgencyProjectsPage() {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAgencyProjectsData();
      setUserSession(res.userSession);
      setDeliverables(res.deliverables);
    } catch (e) {
      console.error("Failed to load agency projects data", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleVisibility = async (deliverableId: string, currentStatus: boolean) => {
    await setClientVisibilityAction(deliverableId, !currentStatus);
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-[#F2F3F4]">
      <Sidebar userRole={userSession?.roleName || "PROJECT_MANAGER"} tenantName="Agency PM Console" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={{ name: userSession?.name || "Marcus Aurelius", email: userSession?.email || "pm@agency.com", roleName: userSession?.roleName || "PROJECT_MANAGER" }} />

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
              <CardTitle>Deliverable Client Visibility Matrix ({deliverables.length})</CardTitle>
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
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#64748B] font-bold">
                          Loading deliverables matrix...
                        </td>
                      </tr>
                    ) : deliverables.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                          No deliverables recorded in database.
                        </td>
                      </tr>
                    ) : (
                      deliverables.map((item) => (
                        <tr key={item.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3.5 px-3 font-bold text-[#0F172A]">{item.tenant?.name || "Global"}</td>
                          <td className="py-3.5 px-3 font-semibold text-[#0F172A]">{item.name}</td>
                          <td className="py-3.5 px-3"><Badge variant="gold">{item.currentVersion}</Badge></td>
                          <td className="py-3.5 px-3"><Badge variant="inProgress">{item.status}</Badge></td>
                          <td className="py-3.5 px-3">
                            {item.clientVisible ? (
                              <Badge variant="active">Visible to Client</Badge>
                            ) : (
                              <Badge variant="neutral">Hidden from Client</Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <Button
                              variant={item.clientVisible ? "outline" : "primary"}
                              size="sm"
                              onClick={() => toggleVisibility(item.id, item.clientVisible)}
                            >
                              {item.clientVisible ? (
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
                      ))
                    )}
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
