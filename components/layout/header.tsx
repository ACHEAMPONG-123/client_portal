"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth-actions";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    roleName: string;
    tenantName?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const isClient = pathname.startsWith("/client");
  const isAgency = pathname.startsWith("/agency");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shrink-0 font-sans">
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search projects, deliverables, drive resources, or invoices..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F2F3F4] text-[#0F172A] rounded-lg border border-transparent focus:border-[#138808] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Workspace Switcher & User Profile Menu */}
      <div className="flex items-center space-x-4">
        {/* Workspace Switcher Bar */}
        <div className="hidden md:flex items-center p-1 bg-[#F2F3F4] rounded-lg border border-[#E2E8F0] text-xs font-semibold">
          <Link
            href="/client/dashboard"
            className={`px-3 py-1 rounded-md transition-all ${
              isClient ? "bg-white text-[#138808] shadow-xs font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Client Workspace
          </Link>
          <Link
            href="/agency/tasks"
            className={`px-3 py-1 rounded-md transition-all ${
              isAgency ? "bg-white text-[#138808] shadow-xs font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Agency Team
          </Link>
          <Link
            href="/admin/tenants"
            className={`px-3 py-1 rounded-md transition-all ${
              isAdmin ? "bg-white text-[#138808] shadow-xs font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Super Admin
          </Link>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F2F3F4] rounded-lg relative cursor-pointer transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD700] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 mb-3">
                <h4 className="text-xs font-bold text-[#0F172A]">Notifications</h4>
                <span className="text-[10px] bg-[#E8F5E9] text-[#138808] px-2 py-0.5 rounded-full font-bold">2 New</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2 rounded-lg bg-[#FFFDE7] border border-[#FFE082]">
                  <p className="font-semibold text-[#0F172A]">Deliverable Approved</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Acme Storefront Homepage V2 marked client visible.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="font-semibold text-[#0F172A]">New Support Request</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Req #104 assigned to Kofi Mensah.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center space-x-3 pl-3 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AG"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#0F172A] leading-none">{user?.name || "Demo User"}</p>
            <span className="text-[10px] font-semibold text-[#138808] capitalize">
              {user?.roleName?.replace("_", " ") || "SUPER_ADMIN"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
