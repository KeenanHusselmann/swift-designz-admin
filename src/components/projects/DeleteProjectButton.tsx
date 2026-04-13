"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/app/(dashboard)/projects/actions";

export default function DeleteProjectButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProjectAction(id);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-400">{error}</span>}
        <span className="text-xs text-gray-400">Delete this project?</span>
        <button onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white border border-[#2a2a2a] rounded-lg transition-colors">
          Cancel
        </button>
        <button onClick={handleDelete} disabled={loading}
          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors">
          {loading ? "Deleting..." : "Confirm Delete"}
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 rounded-lg transition-colors">
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
