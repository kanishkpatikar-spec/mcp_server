import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const GmailSendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1, "At least one recipient is required"),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  body_type: z.enum(["text", "html"]).default("text"),
});

export const GmailCreateDraftSchema = GmailSendEmailSchema;

export const GdocsAppendContentSchema = z.object({
  document_id: z.string().min(1, "Document ID is required"),
  content: z.string().min(1, "Content to append is required"),
  add_newline_before: z.boolean().default(true),
});

// JSON Schema representations for list_tools
export const schemas = {
  gmailSendEmail: zodToJsonSchema(GmailSendEmailSchema as any),
  gmailCreateDraft: zodToJsonSchema(GmailCreateDraftSchema as any),
  gdocsAppendContent: zodToJsonSchema(GdocsAppendContentSchema as any),
};
