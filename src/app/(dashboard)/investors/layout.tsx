import { requireAdminOrInvestor } from "@/lib/auth";

export default async function InvestorsLayout({ children }: { children: React.ReactNode }) {
  await requireAdminOrInvestor();
  return <>{children}</>;
}
