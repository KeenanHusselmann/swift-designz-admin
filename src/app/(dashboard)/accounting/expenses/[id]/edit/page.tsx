import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ExpenseForm from "@/components/accounting/ExpenseForm";
import { updateExpenseAction } from "../../actions";
import type { Expense } from "@/types/database";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("expenses").select("*").eq("id", id).single();
  if (!data) notFound();

  const expense = data as Expense;

  async function action(formData: FormData) {
    "use server";
    return updateExpenseAction(id, formData);
  }

  return (
    <>
      <PageHeader title="Edit Expense" description={expense.description} backHref="/accounting/expenses" />
      <div className="max-w-2xl">
        <ExpenseForm expense={expense} action={action} submitLabel="Save Changes" />
      </div>
    </>
  );
}
