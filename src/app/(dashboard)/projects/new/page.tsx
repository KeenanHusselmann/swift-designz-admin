import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ProjectForm from "@/components/projects/ProjectForm";
import { createProjectAction } from "@/app/(dashboard)/projects/actions";
import type { Client } from "@/types/database";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>;
}) {
  const { client_id } = await searchParams;
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, email, phone, company, location, notes, lead_id, created_at, updated_at")
    .order("name");

  return (
    <>
      <PageHeader title="New Project" description="Create a project and assign it to a client" />
      <div className="max-w-3xl">
        <ProjectForm
          clients={(clients || []) as Client[]}
          preselectedClientId={client_id}
          action={createProjectAction}
          submitLabel="Create Project"
        />
      </div>
    </>
  );
}
