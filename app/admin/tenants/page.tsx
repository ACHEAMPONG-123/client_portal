"use client";

import React, { useState, useEffect } from "react";
import { createTenantAction, getTenantsAction } from "@/app/actions/admin-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Building2, PlusCircle, ExternalLink } from "lucide-react";

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("SMALL_BUSINESS");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [monthlyRetainerValue, setMonthlyRetainerValue] = useState("5000");
  const [submitting, setSubmitting] = useState(false);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const data = await getTenantsAction();
      setTenants(data);
    } catch (e) {
      console.error("Failed to load tenants", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("industry", industry);
    formData.append("companySize", companySize);
    formData.append("website", website);
    formData.append("email", email);
    formData.append("primaryContact", primaryContact);
    formData.append("monthlyRetainerValue", monthlyRetainerValue);

    const res = await createTenantAction(formData);
    setSubmitting(false);

    if (res.success) {
      setIsOpen(false);
      setName("");
      setEmail("");
      loadTenants();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2F3F4]">
      <Sidebar userRole="SUPER_ADMIN" tenantName="Super Admin Console" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={{ name: "Alex Vance", email: "superadmin@agency.com", roleName: "SUPER_ADMIN" }} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Client Tenants & Company Directory
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Super Admin workspace to onboard client companies, manage retainers, and oversee tenant isolation.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
              <PlusCircle className="w-4 h-4" />
              <span>Register New Client</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 py-8 text-center text-xs font-bold text-[#64748B]">
                Loading Tenant Workspaces...
              </div>
            ) : tenants.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-xs font-bold text-[#94A3B8]">
                No client tenant companies found. Register one above.
              </div>
            ) : (
              tenants.map((t) => (
                <Card key={t.id} className="hover:border-[#138808] transition-all">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{t.name}</CardTitle>
                        <Badge variant="active">{t.clientStatus || "ACTIVE"}</Badge>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {t.industry || "General"} • {t.companySize ? t.companySize.replace("_", " ") : "Small Business"}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[#E8F5E9] text-[#138808] rounded-xl font-bold text-xs">
                      ${t.monthlyRetainerValue ? Number(t.monthlyRetainerValue).toLocaleString() : "0"}/mo
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-2 text-xs text-[#475569]">
                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
                      <p><strong className="text-[#0F172A]">Primary Contact:</strong> {t.primaryContact || "N/A"}</p>
                      <p><strong className="text-[#0F172A]">Email:</strong> {t.email || "N/A"}</p>
                      <p><strong className="text-[#0F172A]">Website:</strong> {t.website || "N/A"}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                      <span className="text-[11px] text-[#94A3B8]">ID: {t.id}</span>
                      <a href="/client/dashboard" className="font-bold text-[#138808] hover:underline flex items-center gap-1">
                        Inspect Workspace <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Register Tenant Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Register New Client Company"
        description="Create a new isolated tenant workspace for your digital agency client."
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Global Tech"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Fintech / SaaS"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              >
                <option value="STARTUP">Startup</option>
                <option value="SMALL_BUSINESS">Small Business</option>
                <option value="MEDIUM_BUSINESS">Medium Business</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Company Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@apex.com"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Monthly Retainer ($ USD)</label>
              <input
                type="number"
                value={monthlyRetainerValue}
                onChange={(e) => setMonthlyRetainerValue(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? "Registering..." : "Create Client Tenant"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
