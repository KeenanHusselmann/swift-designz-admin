"use server";

import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeInvestorOnboardingAction(formData: FormData) {
  const user = await requireAuth();

  const acceptedTerms = formData.get("accept_terms") === "on";
  const acceptedNda = formData.get("accept_nda") === "on";

  if (!acceptedTerms || !acceptedNda) {
    return { error: "You must accept both Terms and Conditions and the NDA to continue." };
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "investor") {
    return { error: "Only investor accounts can complete this onboarding." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase.auth.updateUser({
    data: {
      investor_terms_accepted_at: now,
      investor_nda_accepted_at: now,
    },
  });

  if (error) {
    return { error: "We could not save your acceptance right now. Please try again." };
  }

  revalidatePath("/");
  redirect("/");
}
