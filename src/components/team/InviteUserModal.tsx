"use client";

import { useState } from "react";
import { UserPlus, X, Loader2, CheckCircle } from "lucide-react";

type Role = "admin" | "viewer" | "investor";

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "viewer", label: "Viewer", description: "Read-only access to all modules" },
  { value: "admin", label: "Admin", description: "Full CRUD access across the portal" },
  { value: "investor", label: "Investor", description: "Restricted portal — projects, documents & reports only" },
];

export default function InviteUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [message, setMessage] = useState("");

  function reset() {
    setEmail("");
    setFullName("");
    setRole("viewer");
    setMessage("");
    setError(null);
    setSuccess(false);
  }

  function close() {
    setOpen(false);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, role, message }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <UserPlus className="h-4 w-4" />
        Invite User
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-6 relative" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Invite User</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  They&rsquo;ll receive an email with a one-time code and instructions.
                </p>
              </div>
              <button onClick={close} className="text-gray-500 hover:text-foreground transition-colors ml-4 mt-0.5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success state */}
            {success ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-teal mx-auto mb-3" />
                <p className="text-foreground font-semibold mb-1">Invite sent!</p>
                <p className="text-sm text-gray-500 mb-6">
                  An email with the sign-in code and instructions has been sent to{" "}
                  <span className="text-teal">{email}</span>.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={reset}
                    className="px-4 py-2 border border-border rounded-lg text-sm text-gray-400 hover:text-foreground transition-colors"
                  >
                    Invite another
                  </button>
                  <button
                    onClick={close}
                    className="px-4 py-2 bg-teal hover:bg-teal-hover text-white text-sm rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors text-sm"
                  />
                </div>

                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Full name <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors text-sm"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Role &amp; Access <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {ROLES.map((r) => (
                      <label
                        key={r.value}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          role === r.value
                            ? "border-teal bg-teal/5"
                            : "border-border hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={role === r.value}
                          onChange={() => setRole(r.value)}
                          className="mt-0.5 accent-teal"
                        />
                        <div>
                          <span className="text-sm font-medium text-foreground">{r.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Optional message */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Personal message <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Welcome to the team — reach out if you need anything."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors text-sm resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 py-2.5 px-4 border border-border rounded-lg text-sm text-gray-400 hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Sending..." : "Send Invite"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
