"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, verifyOtp, requestMagicLink } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useOtp, setUseOtp] = useState(() => searchParams.get("otp") === "1");
  // If email is in the URL (invite link), skip straight to the code-entry step
  const [otpStep, setOtpStep] = useState<"email" | "code">(() =>
    searchParams.get("otp") === "1" && emailParam ? "code" : "email"
  );
  const [otpEmail, setOtpEmail] = useState(() => emailParam);

  async function handlePasswordSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleSendOtp(formData: FormData) {
    setLoading(true);
    setError(null);
    const email = formData.get("email") as string;
    const result = await requestMagicLink(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOtpEmail(email);
      setOtpStep("code");
      setLoading(false);
    }
  }

  async function handleVerifyOtp(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("email", otpEmail);
    const result = await verifyOtp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  function switchMode(otp: boolean) {
    setUseOtp(otp);
    setOtpStep("email");
    setOtpEmail("");
    setError(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal tracking-tight">Swift Designz</h1>
          <p className="text-sm text-teal-muted mt-1">Admin Portal</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {useOtp ? (otpStep === "email" ? "Sign In with OTP" : "Enter Your Code") : "Sign In"}
          </h2>

          {/* Password login */}
          {!useOtp && (
            <form action={handlePasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email"
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                  placeholder="keenan@swiftdesignz.co.za" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <input id="password" name="password" type="password" required autoComplete="current-password"
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                  placeholder="Enter your password" />
              </div>
              {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 px-4 bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* OTP step 1: send code */}
          {useOtp && otpStep === "email" && (
            <form action={handleSendOtp} className="space-y-5">
              <div>
                <label htmlFor="otp-email" className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input id="otp-email" name="email" type="email" required autoComplete="email"
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                  placeholder="your@email.com" />
                <p className="text-xs text-gray-500 mt-1.5">A 6-digit code will be sent to your inbox.</p>
              </div>
              {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 px-4 bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending..." : "Send OTP Code"}
              </button>
            </form>
          )}

          {/* OTP step 2: verify code */}
          {useOtp && otpStep === "code" && (
            <form action={handleVerifyOtp} className="space-y-5">
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  Code sent to <span className="text-teal font-medium">{otpEmail}</span>.
                  Check your inbox.
                </p>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-400 mb-1.5">OTP Code</label>
                <input id="otp" name="otp" type="text" required inputMode="numeric" maxLength={6} autoComplete="one-time-code"
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors tracking-widest text-center text-lg font-mono"
                  placeholder="000000" autoFocus />
              </div>
              {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 px-4 bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
              <button type="button" onClick={() => { setOtpStep("email"); setError(null); }}
                className="w-full text-xs text-gray-500 hover:text-teal transition-colors">
                Use a different email
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <button type="button" onClick={() => switchMode(!useOtp)}
              className="text-xs text-gray-500 hover:text-teal transition-colors">
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

