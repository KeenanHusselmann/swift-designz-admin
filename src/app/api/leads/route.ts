import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Public API endpoint for the main Swift Designz website to submit leads.
 * Accepts POST with JSON body matching the quote/contact form data.
 * Uses the service role key to bypass RLS (the main site calls this with its own server-side fetch).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = body as Record<string, unknown>;

    const str = (v: unknown, max: number): string =>
      typeof v === "string" ? v.slice(0, max) : "";

    const name = str(raw.name, 100);
    const email = str(raw.email, 254);

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        source: str(raw.source, 20) as "quote_form" | "contact_form" | "manual" || "manual",
        name,
        email,
        phone: str(raw.phone, 30) || null,
        company: str(raw.company, 100) || null,
        location: str(raw.location, 100) || null,
        service: str(raw.service, 50) || null,
        package: str(raw.package, 50) || null,
        scope: str(raw.scope, 5000) || null,
        timeline: str(raw.timeline, 100) || null,
        budget: str(raw.budget, 50) || null,
        message: str(raw.message, 5000) || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert lead:", error);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}
