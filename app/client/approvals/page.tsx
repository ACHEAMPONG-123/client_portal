"use client";

import React, { useState, useEffect } from "react";
import { getClientDashboardData } from "@/app/actions/client-actions";
import { clientApproveDeliverableAction, clientRequestChangesAction } from "@/app/actions/deliverable-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CheckCircle2, MessageSquare, ExternalLink, History, AlertCircle } from "lucide-react";

export default function ClientApprovalsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDeliverable, setSelectedDeliverable] = useState<any>(null);
  const [modalType, setModalType] = useState<"approve" | "changes" | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await getClientDashboardData();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveSubmit = async () => {
    if (!selectedDeliverable) return;
    setSubmitting(true);
    await clientApproveDeliverableAction(selectedDeliverable.id, comment);
    setSubmitting(false);
    setModalType(null);
    setComment("");
    loadData();
  };

  const handleChangesSubmit = async () => {
    if (!selectedDeliverable || !comment) return;
    setSubmitting(true);
    await clientRequestChangesAction(selectedDeliverable.id, comment);
    setSubmitting(false);
    setModalType(null);
    setComment("");
    loadData();
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex items-center justify-center font-sans text-xs font-bold text-[#64748B]">
        Loading Deliverables & Approval Center...
      </div>
    );
  }

  const { userSession, tenant, pendingApprovals, projects } = data;

  // Flatten all client-visible deliverables
  const allDeliverables = projects.flatMap((p: any) =>
    p.deliverables.map((d: any) => ({ ...d, projectName: p.name }))
  );

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
              Deliverable Approval Center
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Review submitted designs, website builds, and marketing assets. Approve deliverables or request revision changes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allDeliverables.length === 0 ? (
              <Card className="lg:col-span-2 py-12 text-center">
                <p className="text-xs font-bold text-[#94A3B8]">No deliverables currently submitted for approval.</p>
              </Card>
            ) : (
              allDeliverables.map((item: any) => (
                <Card key={item.id} className="flex flex-col justify-between space-y-4">
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#138808]">{item.projectName}</span>
                      <Badge
                        variant={
                          item.approvalStatus === "APPROVED"
                            ? "completed"
                            : item.approvalStatus === "CHANGES_REQUESTED"
                            ? "urgent"
                            : "gold"
                        }
                      >
                        {item.approvalStatus.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="gold">{item.currentVersion}</Badge>
                    </div>

                    <p className="text-xs text-[#64748B] mt-2">
                      {item.clientDescription || "Design prototype and deliverable specification submitted for review."}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Google Drive Link */}
                    {item.externalDriveLink && (
                      <a
                        href={item.externalDriveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between group hover:border-[#138808] transition-all"
                      >
                        <div className="flex items-center space-x-2 text-xs">
                          <History className="w-4 h-4 text-[#138808]" />
                          <span className="font-semibold text-[#0F172A]">Open Interactive Prototype / File</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#138808]" />
                      </a>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        disabled={item.approvalStatus === "APPROVED"}
                        onClick={() => {
                          setSelectedDeliverable(item);
                          setModalType("approve");
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{item.approvalStatus === "APPROVED" ? "Approved" : "Approve Work"}</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={item.approvalStatus === "APPROVED"}
                        onClick={() => {
                          setSelectedDeliverable(item);
                          setModalType("changes");
                        }}
                      >
                        <MessageSquare className="w-4 h-4 text-[#B78103]" />
                        <span>Request Changes</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Approve Dialog */}
      <Dialog
        isOpen={modalType === "approve"}
        onClose={() => setModalType(null)}
        title={`Approve ${selectedDeliverable?.name}`}
        description="Confirm client sign-off on this deliverable version."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Optional Sign-Off Note</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Approved for production deployment. Great job!"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" onClick={() => setModalType(null)}>Cancel</Button>
            <Button variant="primary" size="sm" disabled={submitting} onClick={handleApproveSubmit}>
              {submitting ? "Approving..." : "Confirm Approval"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog
        isOpen={modalType === "changes"}
        onClose={() => setModalType(null)}
        title={`Request Changes for ${selectedDeliverable?.name}`}
        description="Provide detailed feedback so our team can prepare revision V3."
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Requested Changes *</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please describe what adjustments or revisions are needed..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" onClick={() => setModalType(null)}>Cancel</Button>
            <Button variant="gold" size="sm" disabled={submitting || !comment} onClick={handleChangesSubmit}>
              {submitting ? "Submitting..." : "Send Revision Request"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
