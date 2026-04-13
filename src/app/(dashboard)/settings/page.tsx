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

  if (!user) {
    return <p className="text-gray-400">Not authenticated.</p>;
  }

  const [profileRes, settingsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("business_settings").select("*").limit(1).single(),
  ]);

  const profile = profileRes.data as Profile | null;
  const settings = settingsRes.data as BusinessSettings | null;

  // If profile doesn't exist, create it from the auth user
  if (!profile && user) {
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.email ?? "Admin",
      email: user.email ?? "",
      role: "admin" as const,
    });
    // Re-fetch after upsert
    const { data: freshProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (freshProfile) {
      return renderPage(freshProfile as Profile, settings, updateProfileAction, changePasswordAction, updateBusinessSettingsAction);
    }
  }

  return renderPage(profile, settings, updateProfileAction, changePasswordAction, updateBusinessSettingsAction);
}

function renderPage(
  profile: Profile | null,
  settings: BusinessSettings | null,
  updateProfileAction: (formData: FormData) => Promise<{ error: string } | undefined>,
  changePasswordAction: (formData: FormData) => Promise<{ error?: string; success?: string } | undefined>,
  updateBusinessSettingsAction: (formData: FormData) => Promise<{ error: string } | undefined>,
) {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and business configuration" />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        {profile ? (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-teal/10">
              <User className="h-4 w-4 text-teal" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Profile</h2>
          </div>
          <ProfileForm profile={profile} action={updateProfileAction} />
        </div>
        ) : (
          <div className="glass-card p-6">
            <p className="text-sm text-gray-400">Unable to load profile. Please try refreshing.</p>
          </div>
        )}

        {/* Change Password */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-teal/10">
              <Lock className="h-4 w-4 text-teal" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
          </div>
          <ChangePasswordForm action={changePasswordAction} />
        </div>

        {/* Business Settings */}
        {settings && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-teal/10">
                <Building2 className="h-4 w-4 text-teal" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Business Settings</h2>
            </div>
            <BusinessSettingsForm settings={settings} action={updateBusinessSettingsAction} />
          </div>
        )}
      </div>
    </>
  );
}
