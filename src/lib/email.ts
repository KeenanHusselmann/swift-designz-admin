import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendDocumentEmailParams {
  to: string;
  clientName: string;
  subject: string;
  message: string;
  templateLabel: string;
  docUrl: string;
}

export async function sendDocumentEmail({
  to,
  clientName,
  subject,
  message,
  templateLabel,
  docUrl,
}: SendDocumentEmailParams) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;max-width:580px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0c2020,#081818);padding:28px 32px;border-bottom:1px solid #1a3030;">
              <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#30B0B0;">Swift Designz</p>
              <p style="margin:6px 0 0;font-size:11px;color:#4a8080;letter-spacing:2px;text-transform:uppercase;">swiftdesignz.co.za</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:13px;color:#70c0c0;letter-spacing:1px;text-transform:uppercase;">Document Ready</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#fff;line-height:1.3;">${templateLabel}</h1>
              <p style="margin:0 0 16px;font-size:14px;color:#aaa;line-height:1.6;">Hi ${clientName},</p>
              ${message ? `<p style="margin:0 0 24px;font-size:14px;color:#ccc;line-height:1.6;">${message.replace(/\n/g, "<br/>")}</p>` : ""}
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background:#30B0B0;border-radius:8px;">
                    <a href="${docUrl}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.5px;">View Document</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">If the button doesn't work, copy this URL into your browser:<br/><a href="${docUrl}" style="color:#30B0B0;word-break:break-all;">${docUrl}</a></p>
            </td>
          </tr>
          <!-- Footer -->
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

  return resend.emails.send({
    from: "Swift Designz <keenan@swiftdesignz.co.za>",
    to,
    subject,
    html,
  });
}
