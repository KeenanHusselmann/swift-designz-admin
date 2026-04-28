"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Handles magic link hash-fragment auth.
 * Supabase server-generated magic links redirect here with
 * #access_token=...&refresh_token=... in the URL hash.
 * We manually parse and call setSession because @supabase/ssr
 * browser client does not auto-process hash fragments.
 */
export default function MagicPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function handleMagicLink() {
      // Parse hash fragment manually
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (!error) {
          // Clear the hash from the URL then redirect
          window.history.replaceState(null, "", window.location.pathname);
          router.replace("/");
          return;
        }
        setError("Session could not be established. Please request a new link.");
        return;
      }

      // No hash tokens — maybe already signed in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/");
        return;
      }

      setError("Invalid or expired link. Please request a new one.");
    }

    handleMagicLink();
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#101010",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "16px",
    }}>
      {error ? (
        <>
          <p style={{ color: "#ff6b6b", fontSize: "14px", margin: 0, textAlign: "center", maxWidth: "320px" }}>
            {error}
          </p>
          <a href="/login" style={{ color: "#30B0B0", fontSize: "13px" }}>Back to login</a>
        </>
      ) : (
        <>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #1a3030",
            borderTop: "3px solid #30B0B0",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#30B0B0", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
            Signing you in...
          </p>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
