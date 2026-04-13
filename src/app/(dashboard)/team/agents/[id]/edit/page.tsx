import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import AgentForm from "@/components/team/AgentForm";
import { updateAgentAction } from "../../actions";
import { notFound } from "next/navigation";
import type { AiAgent } from "@/types/database";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_agents")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const agent = data as AiAgent;

  async function action(formData: FormData) {
    "use server";
    return updateAgentAction(id, formData);
  }

  return (
    <>
      <PageHeader
        title={`Edit ${agent.name}`}
        description="Update AI agent details"
        backHref={`/team/agents/${id}`}
      />
      <AgentForm action={action} agent={agent} submitLabel="Update Agent" />
    </>
  );
}
