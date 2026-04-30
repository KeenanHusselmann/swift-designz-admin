import { redirect } from "next/navigation";
import { getProfile } from "@/app/auth/actions";

export default async function AccountingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  // Admins and intern_admins always have access; viewers need the accounting_access flag
  const allowed =
    profile?.role === "admin" ||
    profile?.role === "intern_admin" ||
    profile?.accounting_access === true;
  if (!allowed) {
    redirect("/");
  }

  return <>{children}</>;
}
