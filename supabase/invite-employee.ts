/**
 * Invite an employee/staff member to the admin portal using a magic link.
 * Magic links are passwordless — the user clicks the link and is immediately
 * signed in. No password creation required.
 *
 * Usage:
 *   npx tsx supabase/invite-employee.ts
 *
 * For investor invites, use supabase/invite-user.ts instead.
 */
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const resend = new Resend(RESEND_API_KEY);

// ── Edit these before running ────────────────────────────────────────────────
const EMAIL = "anteswift12@gmail.com";
const FULL_NAME = "Admin Intern";
const ROLE: "admin" | "viewer" = "viewer"; // "admin" | "viewer"
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Generating magic link for ${EMAIL} (role="${ROLE}")...`);

  // 1. Upsert profile first so the role is set before first login
  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const authUser = existingUser?.users?.find((u) => u.email === EMAIL);

  let userId: string;

  if (authUser) {
    userId = authUser.id;
    console.log("Existing auth user found:", userId);
  } else {
    // Create the auth user without sending an invite email
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: EMAIL,
      email_confirm: true,
      user_metadata: { full_name: FULL_NAME, role: ROLE },
    });
    if (createError) {
      console.error("Failed to create user:", createError.message);
      process.exit(1);
    }
    userId = created.user.id;
    console.log("Created auth user:", userId);
  }

  // 2. Upsert profile with correct role
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: FULL_NAME,
    email: EMAIL,
    role: ROLE,
    updated_at: new Date().toISOString(),
  });
  if (profileError) {
    console.error("Profile upsert failed:", profileError.message);
    process.exit(1);
  }
  console.log("Profile upserted with role:", ROLE);

  // 3. Generate a magic link
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: EMAIL,
    options: {
      redirectTo: "https://admin.swiftdesignz.co.za/auth/callback?next=/",
    },
  });
  if (linkError || !linkData?.properties?.action_link) {
    console.error("Failed to generate magic link:", linkError?.message);
    process.exit(1);
  }

  const magicLink = linkData.properties.action_link;
  console.log("Magic link generated.");

  // 4. Send branded invite email via Resend
  const { error: emailError } = await resend.emails.send({
    from: "Swift Designz <keenan@swiftdesignz.co.za>",
    to: EMAIL,
    subject: "You're invited to the Swift Designz Admin Portal",
    html: buildInviteEmail(FULL_NAME, magicLink),
  });

  if (emailError) {
    console.error("Email send failed:", emailError.message);
    console.log("Magic link (send manually):", magicLink);
    process.exit(1);
  }

  console.log(`Done. Invite email sent to ${EMAIL}.`);
  console.log("The link is valid for 1 hour. Run this script again to generate a new one.");
}

function buildInviteEmail(name: string, link: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;max-width:580px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#0c2020,#081818);padding:28px 32px;border-bottom:1px solid #1a3030;">
              <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#30B0B0;">Swift Designz</p>
              <p style="margin:6px 0 0;font-size:11px;color:#4a8080;letter-spacing:2px;text-transform:uppercase;">Admin Portal</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:13px;color:#70c0c0;letter-spacing:1px;text-transform:uppercase;">You're Invited</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#fff;line-height:1.3;">Access the Admin Portal</h1>
              <p style="margin:0 0 16px;font-size:14px;color:#aaa;line-height:1.6;">Hi ${name},</p>
              <p style="margin:0 0 24px;font-size:14px;color:#ccc;line-height:1.6;">
                You have been invited by Keenan to access the <strong style="color:#fff;">Swift Designz Admin Portal</strong>
                at <strong style="color:#30B0B0;">admin.swiftdesignz.co.za</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#ccc;line-height:1.6;">
                Click the button below to sign in instantly — no password required.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background:#30B0B0;border-radius:8px;">
                    <a href="${link}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.5px;">Sign In to Admin Portal</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:12px;color:#555;line-height:1.6;">This link expires in 1 hour and can only be used once.</p>
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">If you did not expect this invitation, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">Swift Designz · admin.swiftdesignz.co.za · keenan@swiftdesignz.co.za</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

main();
