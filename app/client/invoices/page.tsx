"use client";

import React, { useState, useEffect } from "react";
import { getClientDashboardData } from "@/app/actions/client-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CreditCard, ExternalLink, CheckCircle2, DollarSign } from "lucide-react";

export default function ClientInvoicesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await getClientDashboardData();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulatePayment = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedInvoice(null);
        loadData();
      }, 1500);
    }, 1200);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#F2F3F4] flex items-center justify-center font-sans text-xs font-bold text-[#64748B]">
        Loading Invoices & Billing...
      </div>
    );
  }

  const { userSession, tenant, invoices } = data;

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
              Invoices & Billing Hub
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Review monthly agency retainers, milestone invoices, payment status, and receipts.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Directory ({invoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold">
                      <th className="py-3 px-3">Invoice #</th>
                      <th className="py-3 px-3">Due Date</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {invoices.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-[#0F172A]">{inv.invoiceNumber}</p>
                          <p className="text-[11px] text-[#64748B]">{inv.notes || "Agency Services"}</p>
                        </td>
                        <td className="py-3.5 px-3 text-[#475569]">
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3 font-extrabold text-[#0F172A]">
                          ${Number(inv.total).toLocaleString()} {inv.currency}
                        </td>
                        <td className="py-3.5 px-3">
                          <Badge
                            variant={
                              inv.status === "PAID"
                                ? "completed"
                                : inv.status === "OVERDUE"
                                ? "urgent"
                                : "pending"
                            }
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          {inv.receiptUrl && (
                            <a
                              href={inv.receiptUrl}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
                            >
                              <span>Receipt</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {inv.status !== "PAID" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setSelectedInvoice(inv)}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Invoice</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Payment Gateway Modal Boundary */}
      <Dialog
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Pay Invoice ${selectedInvoice?.invoiceNumber}`}
        description="Secure payment entry boundary for agency retainer."
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#64748B]">Total Amount Due</p>
              <p className="text-xl font-extrabold text-[#0F172A]">
                ${selectedInvoice ? Number(selectedInvoice.total).toLocaleString() : "0"} USD
              </p>
            </div>
            <Badge variant="pending">UNPAID</Badge>
          </div>

          <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl text-[#138808] flex items-center space-x-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Clean integration boundary ready for Stripe, Paystack, or custom gateway integration.</span>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" disabled={paying || success} onClick={handleSimulatePayment}>
              {paying ? "Processing..." : success ? "Payment Received!" : "Process Test Payment"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
