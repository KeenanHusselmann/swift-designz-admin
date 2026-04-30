import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInviteEmail } from "@/lib/email";
import type { UserRole } from "@/types/database";

const ALLOWED_ROLES: UserRole[] = ["admin", "viewer", "investor", "intern_admin"];

export async function POST(request: Request) {
  // Auth check — must be an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse + validate body
  let body: { email?: string; fullName?: string; role?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const fullName = body.fullName?.trim() || "";
  const role = body.role as UserRole;
  const message = body.message?.trim() || "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Find or create auth user
  const { data: listData } = await admin.auth.admin.listUsers();
  const existingAuthUser = listData?.users?.find((u) => u.email === email);

  let userId: string;
  if (existingAuthUser) {
    userId = existingAuthUser.id;
  } else {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });
    if (createError) {
      return NextResponse.json({ error: "Failed to create user account." }, { status: 500 });
    }
    userId = created.user.id;
  }

  // Upsert profile with the assigned role
  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    full_name: fullName || email,
    email,
    role,
    updated_at: new Date().toISOString(),
  });
  if (profileError) {
    return NextResponse.json({ error: "Failed to save user profile." }, { status: 500 });
  }

  // Generate magic link to get the OTP code
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://admin.swiftdesignz.co.za/auth/magic" },
  });
  if (linkError || !linkData?.properties?.email_otp) {
    return NextResponse.json({ error: "Failed to generate invite code." }, { status: 500 });
  }

  // Send branded invite email via Resend
  try {
    await sendInviteEmail({
      to: email,
      otp: linkData.properties.email_otp,
      fullName: fullName || email,
      role,
      message: message || undefined,
      isInvite: true,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send invite email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
