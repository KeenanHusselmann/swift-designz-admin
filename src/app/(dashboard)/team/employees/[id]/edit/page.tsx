import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import EmployeeForm from "@/components/team/EmployeeForm";
import { updateEmployeeAction } from "../../actions";
import type { Employee } from "@/types/database";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("employees").select("*").eq("id", id).single();
  const employee = data as Employee | null;
  if (!employee) notFound();

  async function action(formData: FormData) {
    "use server";
    return updateEmployeeAction(id, formData);
  }

  return (
    <>
      <PageHeader title="Edit Employee" description={employee.name} />
      <EmployeeForm employee={employee} action={action} submitLabel="Update Employee" />
    </>
  );
}
