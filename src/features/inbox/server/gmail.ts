import { google } from "googleapis";
import { env } from "~/env";
import type { Brief } from "@/lib/profile";

export async function sendSummaryToGmail({
  recipientEmail,
  brief,
}: {
  recipientEmail: string;
  brief: Brief;
}) {
  const senderEmail = env.GMAIL_SENDER_EMAIL ?? recipientEmail;
  const oauthClient = createOAuthClient();
  oauthClient.setCredentials({
    refresh_token: env.GMAIL_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: "v1", auth: oauthClient });
  const raw = createRawMessage({
    recipientEmail,
    senderEmail,
    brief,
  });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}

export function hasGmailConfiguration() {
  return Boolean(
    env.GMAIL_CLIENT_ID &&
      env.GMAIL_CLIENT_SECRET &&
      env.GMAIL_REFRESH_TOKEN,
  );
}

function createOAuthClient() {
  if (!hasGmailConfiguration()) {
    throw new Error("Gmail API credentials are not configured.");
  }

  return new google.auth.OAuth2(env.GMAIL_CLIENT_ID, env.GMAIL_CLIENT_SECRET);
}

function createRawMessage({
  recipientEmail,
  senderEmail,
  brief,
}: {
  recipientEmail: string;
  senderEmail: string;
  brief: Brief;
}) {
  const subject = `Inbox Summary: ${brief.headline}`;
  const textBody = toTextBody(brief);
  const htmlBody = toHtmlBody(brief);
  const message = [
    `To: ${recipientEmail}`,
    `From: ${senderEmail}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="summary_boundary"',
    "",
    "--summary_boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    textBody,
    "",
    "--summary_boundary",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    htmlBody,
    "",
    "--summary_boundary--",
  ].join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function toTextBody(brief: Brief) {
  return [
    brief.headline,
    brief.subline,
    "",
    ...brief.items.map(
      (item, index) =>
        `${index + 1}. [${item.priority.toUpperCase()}] ${item.title}\n   ${item.reason}`,
    ),
  ].join("\n");
}

function toHtmlBody(brief: Brief) {
  const items = brief.items
    .map(
      (item) =>
        `<li><strong>[${escapeHtml(item.priority.toUpperCase())}] ${escapeHtml(item.title)}</strong><br/>${escapeHtml(item.reason)}</li>`,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2 style="margin: 0 0 8px;">${escapeHtml(brief.headline)}</h2>
      <p style="margin: 0 0 16px;">${escapeHtml(brief.subline)}</p>
      <ol style="padding-left: 20px; margin: 0;">${items}</ol>
    </div>
  `.trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
