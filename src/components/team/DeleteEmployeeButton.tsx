"use client";

import { Trash2 } from "lucide-react";
import { deleteEmployeeAction } from "@/app/(dashboard)/team/employees/actions";

export default function DeleteEmployeeButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Delete this employee? This cannot be undone.")) return;
        await deleteEmployeeAction(id);
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 border border-red-500/30 hover:border-red-500 rounded-lg transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
