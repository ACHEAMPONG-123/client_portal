import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardRedirect() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.roleName === "SUPER_ADMIN" || session.roleName === "ADMIN") {
    redirect("/admin/tenants");
  } else if (session.roleName.startsWith("CLIENT_")) {
    redirect("/client/dashboard");
  } else {
    redirect("/agency/tasks");
  }
}
