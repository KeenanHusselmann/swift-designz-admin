"use client";

import { useActionState } from "react";

interface ChangePasswordFormProps {
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | undefined>;
}

export default function ChangePasswordForm({ action }: ChangePasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: string } | undefined, formData: FormData) => {
      return await action(formData);
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
        <label htmlFor="new_password" className="block text-xs text-gray-500 mb-1">
          New Password <span className="text-red-400">*</span>
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={8}
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white focus:outline-none focus:border-[#30B0B0]"
        />
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
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white focus:outline-none focus:border-[#30B0B0]"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#303030] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {pending ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
