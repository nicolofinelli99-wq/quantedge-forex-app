import { redirect } from "next/navigation";
import { requireAdminMember } from "@/lib/auth-guard";
import { AppShell } from "@/components/AppShell";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminMember();
  if (!admin) redirect("/login");

  return <AppShell sidebar={<AdminSidebar adminName={admin.name} />}>{children}</AppShell>;
}
