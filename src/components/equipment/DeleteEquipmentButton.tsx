"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface DeleteEquipmentButtonProps {
  name: string;
  action: () => Promise<void>;
}

export default function DeleteEquipmentButton({ name, action }: DeleteEquipmentButtonProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    toast.loading("Deleting equipment...");
    await action();
    toast.success("Equipment deleted.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        Delete Equipment
      </button>
    </form>
  );
}
