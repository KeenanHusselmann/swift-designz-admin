"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, verifyOtp, requestMagicLink } from "@/app/auth/actions";
import { Loader2, Eye, EyeOff, Zap } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    } else {
      setSigningIn(true);
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

      {/* Sign-in loading overlay */}
      {signingIn && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-teal/20 animate-ping absolute" />
              <div className="h-12 w-12 rounded-full border-2 border-teal/40 animate-ping absolute" style={{ animationDelay: "150ms" }} />
              <div className="h-8 w-8 rounded-full bg-teal/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-teal animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-foreground tracking-tight">
                Signing you into the
              </p>
              <p className="text-2xl font-bold text-teal">
                Swift Designz Portal
              </p>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[0,1,2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-teal animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-10 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                    placeholder="Enter your password" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
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

