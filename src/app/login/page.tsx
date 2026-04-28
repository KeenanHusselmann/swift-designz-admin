"use client";

import { useState } from "react";
import { signIn, requestMagicLink } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (useMagicLink) {
      const result = await requestMagicLink(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Login link sent — check your email.");
      }
      setLoading(false);
    } else {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal tracking-tight">
            Swift Designz
          </h1>
          <p className="text-sm text-teal-muted mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Sign In</h2>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="keenan@swiftdesignz.co.za"
              />
            </div>

            {!useMagicLink && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-400 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            )}

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-teal bg-teal/10 border border-teal/20 rounded-lg px-4 py-2.5">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? useMagicLink ? "Sending..." : "Signing in..."
                : useMagicLink ? "Send Login Link" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => { setUseMagicLink((v) => !v); setError(null); setSuccess(null); }}
              className="text-xs text-gray-500 hover:text-teal transition-colors"
            >
              {useMagicLink ? "Sign in with password instead" : "Sign in with a magic link"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Swift Designz Admin &mdash; Authorized access only
        </p>
      </div>
    </div>
  );
}
