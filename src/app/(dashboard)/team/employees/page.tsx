import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function EmployeesPage() {
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .order("name");

  return (
    <>
      <PageHeader
        title="Employees"
        description="Staff directory and salary management"
        backHref="/team"
        actions={
          <Link
            href="/team/employees/new"
            className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Employee
          </Link>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(!employees || employees.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                    No employees added yet.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-card transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/team/employees/${emp.id}`} className="text-sm font-medium text-foreground hover:text-teal">
                        {emp.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{emp.role}</td>
                    <td className="px-5 py-3 text-sm text-gray-400 capitalize">{emp.department}</td>
                    <td className="px-5 py-3 text-sm text-foreground font-medium">{formatCurrency(emp.salary)}/mo</td>
                    <td className="px-5 py-3"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
