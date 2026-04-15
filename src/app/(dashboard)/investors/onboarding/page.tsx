import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import InvestorOnboardingForm from "@/components/investors/InvestorOnboardingForm";
import { completeInvestorOnboardingAction } from "./actions";

export default async function InvestorOnboardingPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "investor") {
    redirect("/");
  }

  const metadata = user.user_metadata ?? {};
  const completed = Boolean(metadata.investor_terms_accepted_at) && Boolean(metadata.investor_nda_accepted_at);

  if (completed) {
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <InvestorOnboardingForm action={completeInvestorOnboardingAction} />
    </div>
  );
}
