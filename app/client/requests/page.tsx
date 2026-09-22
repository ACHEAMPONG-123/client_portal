"use client";

import React, { useState, useEffect } from "react";
import { getClientDashboardData } from "@/app/actions/client-actions";
import { createTicketAction } from "@/app/actions/ticket-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle, HelpCircle, Send } from "lucide-react";

export default function ClientRequestsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("WEBSITE");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("category", category);
    formData.append("priority", priority);
    formData.append("description", description);

    const res = await createTicketAction(formData);
    setSubmitting(false);

    if (res.success) {
      setIsOpen(false);
      setSubject("");
      setDescription("");
      loadData();
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex items-center justify-center font-sans text-xs font-bold text-[#64748B]">
        Loading Support & Requests Portal...
      </div>
    );
  }

  const { userSession, tenant, supportTickets } = data;

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Support & Service Requests
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Submit website updates, design changes, marketing inquiries, or technical support tickets.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Request</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request History ({supportTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportTickets.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] py-8 text-center">No service requests submitted yet.</p>
                ) : (
                  supportTickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-[#0F172A]">{ticket.ticketNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2E8F0] text-[#475569]">
                            {ticket.category}
                          </span>
                        </div>
                        <Badge
                          variant={
                            ticket.status === "RESOLVED"
                              ? "completed"
                              : ticket.status === "IN_PROGRESS"
                              ? "inProgress"
                              : "pending"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>

                      <h4 className="text-sm font-bold text-[#0F172A]">{ticket.subject}</h4>
                      <p className="text-xs text-[#64748B]">{ticket.description}</p>
                      <div className="text-[11px] text-[#94A3B8] pt-1">
                        Submitted by {ticket.submittedBy?.name || "Client User"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Submit Ticket Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Submit New Support Request"
        description="Describe your task or request for our agency team."
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Subject / Request Title *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Update promotional banner on staging site"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              >
                <option value="WEBSITE">Website Update</option>
                <option value="DESIGN">Design Request</option>
                <option value="CONTENT">Content Addition</option>
                <option value="MARKETING">Marketing Inquiry</option>
                <option value="TECH_SUPPORT">Technical Support</option>
                <option value="GENERAL">General Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Detailed Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, specifications, or link to relevant materials..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Request"}</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
