import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

/** Redirects to "/" if the authenticated user does not have the "admin" role. */
export async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");
  return user;
}

/** Redirects to "/" for "viewer" role — allows admin and investor. */
export async function requireAdminOrInvestor() {
  const user = await requireAuth();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role === "viewer") redirect("/");
  return user;
}
