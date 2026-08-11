import { google } from "googleapis";
import { getAuthClient } from "./auth.js";
import { createInternalError } from "../utils/errors.js";

// Helper to construct a base64url encoded RFC 2822 message
function createRawEmail(params: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyType: "text" | "html";
}): string {
  const headers = [
    `To: ${params.to.join(", ")}`,
    ...(params.cc && params.cc.length ? [`Cc: ${params.cc.join(", ")}`] : []),
    ...(params.bcc && params.bcc.length ? [`Bcc: ${params.bcc.join(", ")}`] : []),
    `Subject: =?utf-8?B?${Buffer.from(params.subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    `Content-Type: ${params.bodyType === "html" ? "text/html" : "text/plain"}; charset="UTF-8"`,
  ];

  const emailContent = `${headers.join("\r\n")}\r\n\r\n${params.body}`;
  return Buffer.from(emailContent)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      const status = error?.response?.status || error?.code;
      // Retry on 429 Too Many Requests and 5xx Server Errors
      if (status === 429 || (status >= 500 && status < 600)) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        // Exponential backoff with jitter
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Unreachable retry loop");
}

function handleGmailError(err: any) {
  const message = err?.response?.data?.error?.message || err.message || "Unknown Gmail error";
  return createInternalError(`Gmail API Error: ${message}`);
}

export type GmailEmailParams = {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  body_type: "text" | "html";
};

export async function sendEmail(params: GmailEmailParams) {
  const auth = getAuthClient();
  const gmail = google.gmail({ version: "v1", auth });
  
  const raw = createRawEmail({
    to: params.to,
    cc: params.cc,
    bcc: params.bcc,
    subject: params.subject,
    body: params.body,
    bodyType: params.body_type,
  });

  try {
    const response = await withRetry(() => 
      gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
      })
    );
    return response.data;
  } catch (err: any) {
    throw handleGmailError(err);
  }
}

export async function createDraft(params: GmailEmailParams) {
  const auth = getAuthClient();
  const gmail = google.gmail({ version: "v1", auth });

  const raw = createRawEmail({
    to: params.to,
    cc: params.cc,
    bcc: params.bcc,
    subject: params.subject,
    body: params.body,
    bodyType: params.body_type,
  });

  try {
    const response = await withRetry(() => 
      gmail.users.drafts.create({
        userId: "me",
        requestBody: {
          message: { raw },
        },
      })
    );
    return response.data;
  } catch (err: any) {
    throw handleGmailError(err);
  }
}
