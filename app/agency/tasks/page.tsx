"use client";

import React, { useState, useEffect } from "react";
import { submitDeliverableVersionAction } from "@/app/actions/deliverable-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CheckSquare, Upload, PlusCircle, ExternalLink, Lock } from "lucide-react";

export default function AgencyTaskBoardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [versionLabel, setVersionLabel] = useState("V2");
  const [externalDriveLink, setExternalDriveLink] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("name", name);
    formData.append("versionLabel", versionLabel);
    formData.append("externalDriveLink", externalDriveLink);
    formData.append("clientDescription", clientDescription);
    formData.append("internalNotes", internalNotes);

    const res = await submitDeliverableVersionAction(formData);
    setSubmitting(false);

    if (res.success) {
      setIsOpen(false);
      setName("");
      setExternalDriveLink("");
      setInternalNotes("");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2F3F4]">
      <Sidebar userRole="DESIGNER" tenantName="Agency Workspace" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={{ name: "Elena Rostova", email: "designer@agency.com", roleName: "DESIGNER" }} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Agency Task Board & Deliverables
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Internal team workspace for designers, developers, and marketers. Submit work versions and process revisions.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
              <Upload className="w-4 h-4" />
              <span>Submit Deliverable Version</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task Column 1: Assigned / In Progress */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Assigned / In Progress</CardTitle>
                  <Badge variant="inProgress">1 Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#138808]">Acme E-Commerce</span>
                    <Badge variant="urgent">HIGH</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">API Checkout Integration</h4>
                  <p className="text-[11px] text-[#64748B]">Build tokenized payment boundary endpoint.</p>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-[#94A3B8] border-t border-[#E2E8F0]">
                    <span>Assignee: Kofi Mensah</span>
                    <span className="flex items-center gap-1 font-semibold text-[#DC2626]">
                      <Lock className="w-3 h-3" /> Internal Only
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Column 2: Submitted / Under Internal Review */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Under Review (PM Check)</CardTitle>
                  <Badge variant="pending">1 Submitted</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#138808]">Acme E-Commerce</span>
                    <Badge variant="gold">V2</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Hero Section Homepage Wireframes</h4>
                  <p className="text-[11px] text-[#64748B]">Updated CTA buttons to India Green with Gold accent badges.</p>
                  <a
                    href="https://drive.google.com/file/d/demo-acme-homepage-v2/view"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#138808] hover:underline pt-1"
                  >
                    Drive Link ↗
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Task Column 3: Client Review / Approved */}
            <Card>
              <CardHeader className="pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Client Visible / Approved</CardTitle>
                  <Badge variant="completed">1 Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="p-4 rounded-xl border border-[#A5D6A7] bg-[#E8F5E9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#138808]">Nexus Tech</span>
                    <Badge variant="active">Client Review</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Developer Portal Brand Guidelines</h4>
                  <p className="text-[11px] text-[#475569]">Waiting for final signoff from David Miller.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Version Uploader Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Submit Deliverable Version"
        description="Upload a new version (V1, V2, V3) with Google Drive resource link."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Select Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            >
              <option value="">-- Select Project --</option>
              <option value="clx_acme_proj1">Acme E-Commerce Platform Redesign v3</option>
              <option value="clx_nexus_proj">Nexus Cloud Developer Portal Branding</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Deliverable Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Storefront Hero Wireframes V3"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Version Label</label>
              <input
                type="text"
                required
                value={versionLabel}
                onChange={(e) => setVersionLabel(e.target.value)}
                placeholder="V2"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Google Drive Link *</label>
            <input
              type="url"
              required
              value={externalDriveLink}
              onChange={(e) => setExternalDriveLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Client-Facing Description</label>
            <textarea
              rows={2}
              value={clientDescription}
              onChange={(e) => setClientDescription(e.target.value)}
              placeholder="Description visible to client upon approval..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Internal Agency Notes (Hidden from Client)</label>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Internal comments for PM or dev team..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Upload Version"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
