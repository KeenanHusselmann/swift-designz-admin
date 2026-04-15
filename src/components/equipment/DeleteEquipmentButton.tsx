"use client";

interface DeleteEquipmentButtonProps {
  name: string;
  action: () => Promise<void>;
}

export default function DeleteEquipmentButton({ name, action }: DeleteEquipmentButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
      >
        Delete Equipment
      </button>
    </form>
  );
}
