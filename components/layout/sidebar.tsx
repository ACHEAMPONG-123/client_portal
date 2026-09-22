"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  FileCheck,
  FolderKanban,
  HelpCircle,
  CreditCard,
  Building2,
  Users,
  ShieldAlert,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
  tenantName?: string;
}

export function Sidebar({ tenantName = "Acme Corporation" }: SidebarProps) {
  const pathname = usePathname();

  const isClient = pathname.startsWith("/client");
  const isAgency = pathname.startsWith("/agency");
  const isAdmin = pathname.startsWith("/admin");

  const clientNav = [
    { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
    { name: "Google Drive Hub", href: "/client/drive", icon: FolderGit2 },
    { name: "Approval Center", href: "/client/approvals", icon: FileCheck },
    { name: "Support Requests", href: "/client/requests", icon: HelpCircle },
    { name: "Invoices & Billing", href: "/client/invoices", icon: CreditCard },
  ];

  const agencyNav = [
    { name: "My Task Board", href: "/agency/tasks", icon: CheckSquare },
    { name: "Projects & Visibility", href: "/agency/projects", icon: FolderKanban },
  ];

  const adminNav = [
    { name: "Client Tenants", href: "/admin/tenants", icon: Building2 },
    { name: "Team & User Access", href: "/admin/users", icon: Users },
    { name: "Security Audit Logs", href: "/admin/audit", icon: ShieldAlert },
  ];

  let activeNav = clientNav;
  if (isAgency) activeNav = agencyNav;
  if (isAdmin) activeNav = adminNav;

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] min-h-screen flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Logo & Agency Header */}
        <div className="p-5 border-b border-[#F1F5F9] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs border border-[#E2E8F0] bg-[#138808]">
            <img src="/logo.svg" alt="Agency Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#0F172A] tracking-tight leading-none">
              Client Portal
            </h1>
            <p className="text-[11px] font-semibold text-[#138808] mt-1">
              Digital Agency SaaS
            </p>
          </div>
        </div>

        {/* Client Tenant Card Widget */}
        <div className="mx-4 my-4 p-3.5 bg-[#F2F3F4] rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#64748B]">Active Account</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#138808]">
              ACTIVE
            </span>
          </div>
          <p className="text-sm font-bold text-[#0F172A] truncate">{tenantName}</p>
        </div>

        {/* Workspace Navigation Links */}
        <nav className="px-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            {isClient ? "Client Workspace" : isAgency ? "Agency Command" : "Super Admin"}
          </div>
          {activeNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#E8F5E9] text-[#138808] border-l-4 border-[#138808]"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#138808]" : "text-[#64748B]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Support Links */}
      <div className="p-4 border-t border-[#F1F5F9] space-y-2">
        <a
          href="https://cal.com/agency-strategy/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#138808] text-white hover:bg-[#0F6E06] transition-colors shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Book Strategy Call</span>
        </a>
        <a
          href="https://wa.me/15552345678"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#F2F3F4] text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#138808]" />
          <span>WhatsApp Support</span>
        </a>
      </div>
    </aside>
  );
}
