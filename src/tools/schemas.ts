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

export const GdocsClearContentSchema = z.object({
  document_id: z.string().min(1, "Document ID is required"),
});

// JSON Schema representations for list_tools
export const schemas = {
  gmailSendEmail: {
    type: "object",
    properties: (zodToJsonSchema(GmailSendEmailSchema as any) as any).properties,
    required: (zodToJsonSchema(GmailSendEmailSchema as any) as any).required,
  },
  gmailCreateDraft: {
    type: "object",
    properties: (zodToJsonSchema(GmailCreateDraftSchema as any) as any).properties,
    required: (zodToJsonSchema(GmailCreateDraftSchema as any) as any).required,
  },
  gdocsAppendContent: {
    type: "object",
    properties: (zodToJsonSchema(GdocsAppendContentSchema as any) as any).properties,
    required: (zodToJsonSchema(GdocsAppendContentSchema as any) as any).required,
  },
  gdocsClearContent: {
    type: "object",
    properties: (zodToJsonSchema(GdocsClearContentSchema as any) as any).properties,
    required: (zodToJsonSchema(GdocsClearContentSchema as any) as any).required,
  },
};
