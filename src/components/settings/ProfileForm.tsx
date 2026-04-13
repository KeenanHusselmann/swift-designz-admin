"use client";

import { useActionState } from "react";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
}

export default function ProfileForm({ profile, action }: ProfileFormProps) {
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

      <div>
        <label htmlFor="full_name" className="block text-xs text-gray-500 mb-1">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name}
          required
          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white focus:outline-none focus:border-[#30B0B0]"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Email</label>
        <p className="px-3 py-2 text-sm text-gray-400">{profile.email}</p>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Role</label>
        <p className="px-3 py-2 text-sm text-[#30B0B0] capitalize">{profile.role}</p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-[#30B0B0] hover:bg-[#2a9a9a] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {pending ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}
