"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Department, EmployeeStatus } from "@/types/database";

export async function createEmployeeAction(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const role = (formData.get("role") as string)?.trim();
  if (!role) return { error: "Role is required." };

  const department = formData.get("department") as Department;
  if (!department) return { error: "Department is required." };

  const salaryRaw = (formData.get("salary") as string)?.trim();
  if (!salaryRaw) return { error: "Salary is required." };
  const parsed = parseFloat(salaryRaw);
  if (isNaN(parsed) || parsed < 0) return { error: "Salary must be a valid number." };
  const salary = Math.round(parsed * 100);

  const start_date = formData.get("start_date") as string;
  if (!start_date) return { error: "Start date is required." };

  const email = (formData.get("email") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const end_date = (formData.get("end_date") as string) || null;
  const status = (formData.get("status") as EmployeeStatus) || "active";
  const notes = (formData.get("notes") as string)?.trim() || null;

  const { data, error } = await supabase
    .from("employees")
    .insert({ name, email, phone, role, department, salary, start_date, end_date, status, notes })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Log initial salary
  await supabase.from("salary_history").insert({
    employee_id: data.id,
    amount: salary,
    effective_date: start_date,
    notes: "Initial salary",
  });

  revalidatePath("/team/employees");
  redirect("/team/employees");
}

export async function updateEmployeeAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const role = (formData.get("role") as string)?.trim();
  if (!role) return { error: "Role is required." };

  const department = formData.get("department") as Department;
  if (!department) return { error: "Department is required." };

  const salaryRaw = (formData.get("salary") as string)?.trim();
  if (!salaryRaw) return { error: "Salary is required." };
  const parsed = parseFloat(salaryRaw);
  if (isNaN(parsed) || parsed < 0) return { error: "Salary must be a valid number." };
  const salary = Math.round(parsed * 100);

  const start_date = formData.get("start_date") as string;
  if (!start_date) return { error: "Start date is required." };

  const email = (formData.get("email") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const end_date = (formData.get("end_date") as string) || null;
  const status = (formData.get("status") as EmployeeStatus) || "active";
  const notes = (formData.get("notes") as string)?.trim() || null;

  // Check if salary changed — log to salary_history
  const { data: current } = await supabase.from("employees").select("salary").eq("id", id).single();
  if (current && current.salary !== salary) {
    await supabase.from("salary_history").insert({
      employee_id: id,
      amount: salary,
      effective_date: new Date().toISOString().split("T")[0],
      notes: `Salary updated from ${(current.salary / 100).toFixed(2)} to ${(salary / 100).toFixed(2)}`,
    });
  }

  const { error } = await supabase
    .from("employees")
    .update({ name, email, phone, role, department, salary, start_date, end_date, status, notes })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/team/employees");
  revalidatePath(`/team/employees/${id}`);
  redirect(`/team/employees/${id}`);
}

export async function deleteEmployeeAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/team/employees");
  redirect("/team/employees");
}
