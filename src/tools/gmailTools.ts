import { z } from "zod";
import { GmailSendEmailSchema, GmailCreateDraftSchema } from "./schemas.js";
import { createInvalidRequestError, createInternalError } from "../utils/errors.js";
import { sendEmail, createDraft } from "../google/gmail.js";

export async function handleGmailSendEmail(args: unknown) {
  try {
    const parsedArgs = GmailSendEmailSchema.parse(args);
    const result = await sendEmail(parsedArgs);
    
    return {
      content: [
        {
          type: "text",
          text: `Successfully sent email!\nMessage ID: ${result.id}\nThread ID: ${result.threadId}`,
        },
      ],
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createInvalidRequestError(`Validation failed: ${error.message}`);
    }
    // If it's already an McpError (from handleGmailError), rethrow it
    if (error.code) throw error;
    throw createInternalError("Internal server error during gmail_send_email: " + error.message);
  }
}

export async function handleGmailCreateDraft(args: unknown) {
  try {
    const parsedArgs = GmailCreateDraftSchema.parse(args);
    const result = await createDraft(parsedArgs);
    
    return {
      content: [
        {
          type: "text",
          text: `Successfully created draft!\nDraft ID: ${result.id}\nMessage ID: ${result.message?.id}`,
        },
      ],
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createInvalidRequestError(`Validation failed: ${error.message}`);
    }
    if (error.code) throw error;
    throw createInternalError("Internal server error during gmail_create_draft: " + error.message);
  }
}
