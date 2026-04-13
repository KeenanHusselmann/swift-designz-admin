import PageHeader from "@/components/ui/PageHeader";
import LeadForm from "@/components/leads/LeadForm";
import { createLead } from "@/app/(dashboard)/leads/actions";

export default function NewLeadPage() {
  return (
    <>
      <PageHeader title="New Lead" description="Add a lead manually" backHref="/leads" />
      <LeadForm action={createLead} submitLabel="Create Lead" />
    </>
  );
}
