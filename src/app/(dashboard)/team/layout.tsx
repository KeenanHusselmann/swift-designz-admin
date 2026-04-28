import { requireAdmin } from "@/lib/auth";

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
