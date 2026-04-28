"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Handles magic link hash-fragment auth.
 * Supabase server-generated magic links redirect here with
 * #access_token=...&refresh_token=... in the URL hash.
 * The browser client reads the hash automatically via getSession().
 */
export default function MagicPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/");
      } else {
        // Hash might not be processed yet — listen for the auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session) {
              subscription.unsubscribe();
              router.replace("/");
            }
          }
        );
        // Clean up if nothing fires within 5 seconds
        setTimeout(() => {
          subscription.unsubscribe();
          router.replace("/login");
        }, 5000);
      }
    });
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
