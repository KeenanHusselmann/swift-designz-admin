"use client";

import { useState } from "react";
import { signIn, verifyOtp } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useOtp, setUseOtp] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = useOtp ? await verifyOtp(formData) : await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
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
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {useOtp ? "Sign In with Invite Code" : "Sign In"}
          </h2>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
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

            {useOtp ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-400 mb-1.5">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors tracking-widest text-center text-lg font-mono"
                  placeholder="000000"
                />
                <p className="text-xs text-gray-500 mt-1.5">Enter the 6-digit code from your invite email.</p>
              </div>
            ) : (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : useOtp ? "Verify & Sign In" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => { setUseOtp((v) => !v); setError(null); }}
              className="text-xs text-gray-500 hover:text-teal transition-colors"
            >
              {useOtp ? "Sign in with password instead" : "First time? Sign in with invite OTP"}
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

