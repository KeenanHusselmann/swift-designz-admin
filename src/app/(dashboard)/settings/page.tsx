import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ProfileForm from "@/components/settings/ProfileForm";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import BusinessSettingsForm from "@/components/settings/BusinessSettingsForm";
import { updateProfileAction, changePasswordAction, updateBusinessSettingsAction } from "./actions";
import type { Profile, BusinessSettings } from "@/types/database";
import { User, Lock, Building2 } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileRes, settingsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.from("business_settings").select("*").limit(1).single(),
  ]);

  const profile = profileRes.data as Profile;
  const settings = settingsRes.data as BusinessSettings;

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and business configuration" />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#30B0B0]/10">
              <User className="h-4 w-4 text-[#30B0B0]" />
            </div>
            <h2 className="text-sm font-semibold text-white">Profile</h2>
          </div>
          <ProfileForm profile={profile} action={updateProfileAction} />
        </div>

        {/* Change Password */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-[#30B0B0]/10">
              <Lock className="h-4 w-4 text-[#30B0B0]" />
            </div>
            <h2 className="text-sm font-semibold text-white">Change Password</h2>
          </div>
          <ChangePasswordForm action={changePasswordAction} />
        </div>

        {/* Business Settings */}
        {settings && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#30B0B0]/10">
                <Building2 className="h-4 w-4 text-[#30B0B0]" />
              </div>
              <h2 className="text-sm font-semibold text-white">Business Settings</h2>
            </div>
            <BusinessSettingsForm settings={settings} action={updateBusinessSettingsAction} />
          </div>
        )}
      </div>
    </>
  );
}
