import { getProfile } from "@/app/auth/actions";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default async function AppShell({ children }: AppShellProps) {
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
