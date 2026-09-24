"use client";

import React, { useState, useEffect } from "react";
import { createUserAction, getUsersAction } from "@/app/actions/admin-actions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Users, UserPlus, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Password123!");
  const [roleName, setRoleName] = useState("CLIENT_ADMIN");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersAction();
      setUsers(data);
    } catch (e) {
      console.error("Failed to load users", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("roleName", roleName);
    formData.append("title", title);

    const res = await createUserAction(formData);
    setSubmitting(false);

    if (res.success) {
      setIsOpen(false);
      setName("");
      setEmail("");
      loadUsers();
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
                Team & User Access Management
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Manage agency staff roles (PM, Designer, Developer, Marketer) and client user access credentials.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
              <UserPlus className="w-4 h-4" />
              <span>Invite / Create User</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Directory ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] font-bold">
                      <th className="py-3 px-3">Name & Title</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Assigned Role</th>
                      <th className="py-3 px-3">Tenant / Affiliation</th>
                      <th className="py-3 px-3">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#64748B] font-bold">
                          Loading user directory...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#94A3B8]">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3.5 px-3 font-bold text-[#0F172A]">
                            {u.name} <span className="text-[11px] font-normal text-[#64748B] block">{u.title || "User"}</span>
                          </td>
                          <td className="py-3.5 px-3 text-[#475569]">{u.email}</td>
                          <td className="py-3.5 px-3">
                            <Badge variant={u.role.name.startsWith("CLIENT_") ? "gold" : "inProgress"}>
                              {u.role.name}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-[#475569]">
                            {u.tenant?.name || "Agency Staff"}
                          </td>
                          <td className="py-3.5 px-3"><Badge variant="completed">{u.status || "ACTIVE"}</Badge></td>
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

      {/* Create User Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create / Invite User"
        description="Add a staff member or client account with role permissions."
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@agency.com"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Role *</label>
              <select
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="DESIGNER">Designer</option>
                <option value="DEVELOPER">Developer</option>
                <option value="MARKETER">Marketer</option>
                <option value="CLIENT_ADMIN">Client Admin</option>
                <option value="CLIENT_USER">Client User</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Password</label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#138808]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
