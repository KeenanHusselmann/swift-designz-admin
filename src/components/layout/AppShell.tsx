import { getProfile } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_TABLES = ["leads", "clients", "projects", "invoices", "documents", "investors", "employees", "ai_agents", "equipment"] as const;
type NavTable = typeof NAV_TABLES[number];

async function getNavCounts(): Promise<Record<NavTable, number>> {
  const supabase = await createClient();
  const results = await Promise.all(
    NAV_TABLES.map((t) => supabase.from(t).select("id", { count: "exact", head: true }))
  );
  return Object.fromEntries(NAV_TABLES.map((t, i) => [t, results[i].count ?? 0])) as Record<NavTable, number>;
}

export default async function AppShell({ children }: AppShellProps) {
  const [profile, initialCounts] = await Promise.all([getProfile(), getNavCounts()]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile} initialCounts={initialCounts} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
