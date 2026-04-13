import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ProjectForm from "@/components/projects/ProjectForm";
import { updateProjectAction } from "@/app/(dashboard)/projects/actions";
import type { Client } from "@/types/database";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: clients }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("clients").select("id, name, email, phone, company, location, notes, lead_id, created_at, updated_at").order("name"),
  ]);

  if (!project) notFound();

  async function action(formData: FormData) {
    "use server";
    return updateProjectAction(id, formData);
  }

  return (
    <>
      <PageHeader
        title="Edit Project"
        description={project.name}
      />
      <div className="max-w-2xl">
        <ProjectForm
          project={project}
          clients={(clients || []) as Client[]}
          action={action}
          submitLabel="Save Changes"
          isEdit={true}
        />
      </div>
    </>
  );
}
