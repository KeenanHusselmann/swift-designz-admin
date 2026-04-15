import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function resolveAppUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.URL,
    "https://admin.swiftdesignz.co.za",
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const value = raw.trim();
    if (!value) continue;

    if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/i.test(value)) {
      continue;
    }

    return value.replace(/\/$/, "");
  }

  return "https://admin.swiftdesignz.co.za";
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const admin = createAdminClient();
  const appUrl = resolveAppUrl();

  const { data, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/investors`,
    data: { full_name: name },
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 400 });
  }

  if (data.user) {
    await admin.from("profiles").upsert({
      id: data.user.id,
      full_name: name,
      email,
      role: "investor",
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: true });
}
