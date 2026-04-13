import PageHeader from "@/components/ui/PageHeader";
import InvestorForm from "@/components/investors/InvestorForm";
import { createInvestorAction } from "../actions";

export default function NewInvestorPage() {
  return (
    <>
      <PageHeader title="Add Investor" description="Register a new investor" backHref="/investors" />
      <InvestorForm action={createInvestorAction} submitLabel="Create Investor" />
    </>
  );
}
