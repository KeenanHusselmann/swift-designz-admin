import { redirect } from "next/navigation";
import { getProfile } from "@/app/auth/actions";

export default async function AccountingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  // Admins always have access; viewers need the accounting_access flag
  if (profile?.role !== "admin" && !profile?.accounting_access) {
    redirect("/");
  }

  return <>{children}</>;
}
