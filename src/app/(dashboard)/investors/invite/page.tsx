import PageHeader from "@/components/ui/PageHeader";
import InviteInvestorForm from "@/components/investors/InviteInvestorForm";
import { inviteInvestorAction } from "./actions";

export default function InviteInvestorPage() {
  return (
    <>
      <PageHeader
        title="Invite Investor"
        description="Send an invitation email to give an investor access to their portal view"
        backHref="/investors"
      />
      <div className="max-w-md">
        <InviteInvestorForm action={inviteInvestorAction} />
      </div>
    </>
  );
}
