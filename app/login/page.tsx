"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAction(formData);
    setLoading(false);

    if (!res.success || !res.roleName) {
      setError(res.error || "Login failed.");
      return;
    }

    // Redirect based on role
    const role = res.roleName;
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      router.push("/admin/tenants");
    } else if (role.startsWith("CLIENT_")) {
      router.push("/client/dashboard");
    } else {
      router.push("/agency/tasks");
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F2F3F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full overflow-hidden shadow-md bg-white p-1 border border-[#E2E8F0] mb-4">
          <img src="/logo.svg" alt="Agency Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Digital Agency Client Portal
        </h2>
        <p className="mt-1 text-xs text-[#64748B] font-semibold">
          High-End SaaS Platform • Multi-Tenant Enterprise Security
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E2E8F0] rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs font-semibold text-[#DC2626]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A] focus:bg-white focus:border-[#138808] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A] focus:bg-white focus:border-[#138808] focus:outline-none transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full py-2.5"
            >
              {loading ? "Authenticating..." : "Sign In to Client Portal"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Selector for Testing */}
          <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
            <div className="flex items-center space-x-1 text-xs font-bold text-[#0F172A] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>One-Click Role Quick Selectors (Demo)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                onClick={() => fillDemoAccount("clientadmin@acme.com")}
                type="button"
                className="p-2 text-left bg-[#F2F3F4] hover:bg-[#E8F5E9] hover:border-[#A5D6A7] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
              >
                <p className="font-bold text-[#0F172A]">Acme Client Admin</p>
                <p className="text-[10px] text-[#138808] truncate">clientadmin@acme.com</p>
              </button>
              <button
                onClick={() => fillDemoAccount("superadmin@agency.com")}
                type="button"
                className="p-2 text-left bg-[#F2F3F4] hover:bg-[#E8F5E9] hover:border-[#A5D6A7] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
              >
                <p className="font-bold text-[#0F172A]">Super Admin</p>
                <p className="text-[10px] text-[#138808] truncate">superadmin@agency.com</p>
              </button>
              <button
                onClick={() => fillDemoAccount("pm@agency.com")}
                type="button"
                className="p-2 text-left bg-[#F2F3F4] hover:bg-[#E8F5E9] hover:border-[#A5D6A7] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
              >
                <p className="font-bold text-[#0F172A]">Project Manager</p>
                <p className="text-[10px] text-[#138808] truncate">pm@agency.com</p>
              </button>
              <button
                onClick={() => fillDemoAccount("designer@agency.com")}
                type="button"
                className="p-2 text-left bg-[#F2F3F4] hover:bg-[#E8F5E9] hover:border-[#A5D6A7] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
              >
                <p className="font-bold text-[#0F172A]">Designer</p>
                <p className="text-[10px] text-[#138808] truncate">designer@agency.com</p>
              </button>
            </div>
            <p className="text-[10px] text-[#94A3B8] text-center mt-2 font-medium">
              Demo password for all accounts: <code className="font-bold text-[#0F172A]">Password123!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
