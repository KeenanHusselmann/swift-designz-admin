import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) return "/";
  if (!nextParam.startsWith("/") || nextParam.startsWith("//")) return "/";
  return nextParam;
}

/** Auth callback handler for Supabase email confirmation */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const redirectTarget = `${origin}${nextPath}`;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(redirectTarget);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(redirectTarget);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
