import PageHeader from "@/components/ui/PageHeader";
import ExpenseForm from "@/components/accounting/ExpenseForm";
import { createExpenseAction } from "../actions";

export default function NewExpensePage() {
  return (
    <>
      <PageHeader title="Add Expense" description="Record a new business expense" />
      <div className="max-w-2xl">
        <ExpenseForm action={createExpenseAction} submitLabel="Add Expense" />
      </div>
    </>
  );
}
