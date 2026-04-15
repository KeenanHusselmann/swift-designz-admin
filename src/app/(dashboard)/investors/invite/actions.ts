"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function inviteInvestorAction(formData: FormData) {
  await requireAuth();

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://admin.swiftdesignz.co.za"
  ).replace(/\/$/, "");

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const admin = createAdminClient();

  // Invite the user via Supabase Auth (sends invite email automatically)
  // Note: we do NOT pass role in metadata to avoid trigger cast issues —
  // role is set explicitly via the upsert below.
  const { data, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/investors`,
    data: { full_name: name },
  });

  if (inviteError) return { error: inviteError.message };

  // Upsert profile to guarantee role = investor (in case trigger used a different default)
  if (data.user) {
    await admin.from("profiles").upsert({
      id: data.user.id,
      full_name: name,
      email,
      role: "investor",
      updated_at: new Date().toISOString(),
    });
  }

  revalidatePath("/investors");
  redirect("/investors");
}
