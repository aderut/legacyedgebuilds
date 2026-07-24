/**
 * Sends email via Resend (https://resend.com). Requires RESEND_API_KEY and
 * RESEND_FROM_EMAIL in the environment. See README for setup — in short:
 * sign up at resend.com, verify a sending domain (or use their test domain
 * for development), and create an API key.
 */
export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[]; // content = base64
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Missing RESEND_API_KEY or RESEND_FROM_EMAIL. Add both to .env.local — see README for how to get them from resend.com."
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      attachments,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }

  return res.json();
}
