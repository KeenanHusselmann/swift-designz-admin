"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInviteEmail } from "@/lib/email";
import { redirect } from "next/navigation";
import { cache } from "react";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function setInvitePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Failed to set password. Please try again." };
  }

  redirect("/");
}

export async function verifyOtp(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const token = (formData.get("otp") as string)?.trim();

  if (!email || !token) return { error: "Email and OTP code are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });

  if (error) {
    return { error: "Invalid or expired OTP. Request a new invite from Keenan." };
  }

  redirect("/auth/set-password");
}

export async function requestMagicLink(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const supabase = await createClient();

  // Only allow existing users — check profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (!profile) {
    return { error: "No account found for this email. Contact Keenan to get an invite." };
  }

  // Generate OTP via admin client and send our own branded email
  const admin = createAdminClient();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://admin.swiftdesignz.co.za/auth/magic" },
  });

  if (linkError || !linkData?.properties?.email_otp) {
    return { error: "Could not generate a login code. Try again." };
  }

  try {
    await sendInviteEmail({
      to: email,
      otp: linkData.properties.email_otp,
      isInvite: false,
    });
  } catch {
    return { error: "Could not send the login code. Try again." };
  }

  return { success: true };
}

export const getSession = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async () => {
  const user = await getSession();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
});
