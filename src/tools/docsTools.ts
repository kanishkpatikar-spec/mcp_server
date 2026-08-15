import { z } from "zod";
import { GdocsAppendContentSchema, GdocsClearContentSchema } from "./schemas.js";
import { createInvalidRequestError, createInternalError } from "../utils/errors.js";
import { appendContent, clearContent } from "../google/docs.js";

export async function handleGdocsAppendContent(args: unknown) {
  try {
    const parsedArgs = GdocsAppendContentSchema.parse(args);
    const result = await appendContent(parsedArgs);
    
    return {
      content: [
        {
          type: "text",
          text: `Successfully appended content to document!\nDocument ID: ${result.documentId}\nStatus: ${result.status}`,
        },
      ],
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createInvalidRequestError(`Validation failed: ${error.message}`);
    }
    if (error.code) throw error;
    throw createInternalError("Internal server error during gdocs_append_content: " + error.message);
  }
}

export async function handleGdocsClearContent(args: unknown) {
  try {
    const parsedArgs = GdocsClearContentSchema.parse(args);
    const result = await clearContent(parsedArgs);
    
    return {
      content: [
        {
          type: "text",
          text: `Successfully cleared content from document!\nDocument ID: ${result.documentId}\nStatus: ${result.status}`,
        },
      ],
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createInvalidRequestError(`Validation failed: ${error.message}`);
    }
    if (error.code) throw error;
    throw createInternalError("Internal server error during gdocs_clear_content: " + error.message);
  }
}
