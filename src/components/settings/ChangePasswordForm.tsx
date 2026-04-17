"use client";

import { useActionState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface ChangePasswordFormProps {
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | undefined>;
}

export default function ChangePasswordForm({ action }: ChangePasswordFormProps) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: string } | undefined, formData: FormData) => {
      toast.loading("Updating password...");
      const result = await action(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Password updated!");
      return result;
    },
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {state.success}
        </div>
      )}

      <div>
        <label htmlFor="current_password" className="block text-xs text-gray-500 mb-1">
          Current Password <span className="text-red-400">*</span>
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          required
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-teal"
        />
      </div>

      <div>
        <label htmlFor="new_password" className="block text-xs text-gray-500 mb-1">
          New Password <span className="text-red-400">*</span>
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={10}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-teal"
        />
        <p className="text-xs text-gray-600 mt-1">Min 10 chars, 1 uppercase, 1 number</p>
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-xs text-gray-500 mb-1">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={8}
          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-teal"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-border hover:bg-dark-gray disabled:opacity-50 text-foreground text-sm font-medium rounded-lg transition-colors"
        >
          {pending ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
