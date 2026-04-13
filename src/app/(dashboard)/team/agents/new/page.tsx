import PageHeader from "@/components/ui/PageHeader";
import AgentForm from "@/components/team/AgentForm";
import { createAgentAction } from "../actions";

export default function NewAgentPage() {
  return (
    <>
      <PageHeader
        title="Add AI Agent"
        description="Register a new AI agent"
      />
      <AgentForm action={createAgentAction} submitLabel="Create Agent" />
    </>
  );
}
