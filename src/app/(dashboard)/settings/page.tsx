import PageHeader from "@/components/ui/PageHeader";
import { getProfile } from "@/app/auth/actions";

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and preferences" />

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Full Name</label>
              <p className="text-sm text-white">{profile?.full_name || "—"}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <p className="text-sm text-white">{profile?.email || "—"}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <p className="text-sm text-[#30B0B0] capitalize">{profile?.role || "—"}</p>
            </div>
          </div>
        </div>

        {/* Placeholder for future settings */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Team Management</h2>
          <p className="text-sm text-gray-500">
            Invite team members and manage access roles. Coming soon.
          </p>
        </div>
      </div>
    </>
  );
}
