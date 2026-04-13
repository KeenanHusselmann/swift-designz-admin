import PageHeader from "@/components/ui/PageHeader";
import EmployeeForm from "@/components/team/EmployeeForm";
import { createEmployeeAction } from "../actions";

export default function NewEmployeePage() {
  return (
    <>
      <PageHeader title="Add Employee" description="Register a new team member" backHref="/team/employees" />
      <EmployeeForm action={createEmployeeAction} submitLabel="Create Employee" />
    </>
  );
}
