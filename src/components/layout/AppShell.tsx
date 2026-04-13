import { getProfile } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

async function getNavCounts() {
  const supabase = await createClient();
  const tables = ["leads", "clients", "projects", "invoices", "documents", "investors", "employees", "ai_agents"] as const;
  const results = await Promise.all(
    tables.map((t) => supabase.from(t).select("id", { count: "exact", head: true }))
  );
  return Object.fromEntries(
    tables.map((t, i) => [t, results[i].count ?? 0])
  ) as Record<string, number>;
}

export default async function AppShell({ children }: AppShellProps) {
  const [profile, counts] = await Promise.all([getProfile(), getNavCounts()]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile} counts={counts} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
