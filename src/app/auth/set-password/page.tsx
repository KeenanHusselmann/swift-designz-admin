"use client";

import { useState } from "react";
import { setInvitePassword } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function SetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await setInvitePassword(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal tracking-tight">
            Swift Designz
          </h1>
          <p className="text-sm text-teal-muted mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Create Your Password
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            You have been invited to the Swift Designz Admin Portal. Set a
            secure password to activate your account.
          </p>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1.5"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-400 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="Repeat your password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal text-background font-semibold rounded-lg hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting password…
                </>
              ) : (
                "Activate Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
