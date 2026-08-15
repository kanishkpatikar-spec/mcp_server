import { google } from "googleapis";
import { getAuthClient } from "./auth.js";
import { createInternalError } from "../utils/errors.js";

async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      const status = error?.response?.status || error?.code;
      if (status === 429 || (status >= 500 && status < 600)) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Unreachable retry loop");
}

function handleDocsError(err: any) {
  const status = err?.response?.status;
  const message = err?.response?.data?.error?.message || err.message || "Unknown Docs API error";
  
  if (status === 404) {
    return createInternalError(`Google Docs Error: Document not found or not accessible. (404)`);
  }
  if (status === 403) {
    return createInternalError(`Google Docs Error: Permission denied to access document. (403)`);
  }
  
  return createInternalError(`Google Docs API Error: ${message}`);
}

export type GDocsAppendParams = {
  document_id: string;
  content: string;
  add_newline_before?: boolean;
};

export async function appendContent(params: GDocsAppendParams) {
  const auth = getAuthClient();
  const docs = google.docs({ version: "v1", auth });

  try {
    // 1. Get the document to determine the current end index
    const doc = await withRetry(() => 
      docs.documents.get({ documentId: params.document_id })
    );

    const bodyContent = doc.data.body?.content;
    if (!bodyContent || bodyContent.length === 0) {
      throw new Error("Document body is empty or invalid structure.");
    }

    // The last element in the body defines the end of the document.
    // We insert at (endIndex - 1) because the document must end with a newline.
    const lastElement = bodyContent[bodyContent.length - 1];
    const insertionIndex = (lastElement.endIndex || 2) - 1;

    // 2. Prepare the text to insert
    const textToInsert = params.add_newline_before !== false
      ? `\n${params.content}`
      : params.content;

    // 3. Perform the batch update to insert text
    const updateResponse = await withRetry(() =>
      docs.documents.batchUpdate({
        documentId: params.document_id,
        requestBody: {
          requests: [
            {
              insertText: {
                location: { index: insertionIndex },
                text: textToInsert,
              },
            },
          ],
        },
      })
    );

    return {
      documentId: updateResponse.data.documentId,
      status: "Success",
    };
  } catch (err: any) {
    throw handleDocsError(err);
  }
}

export type GDocsClearParams = {
  document_id: string;
};

export async function clearContent(params: GDocsClearParams) {
  const auth = getAuthClient();
  const docs = google.docs({ version: "v1", auth });

  try {
    const doc = await withRetry(() => 
      docs.documents.get({ documentId: params.document_id })
    );

    const bodyContent = doc.data.body?.content;
    if (!bodyContent || bodyContent.length === 0) {
      throw new Error("Document body is empty or invalid structure.");
    }

    const lastElement = bodyContent[bodyContent.length - 1];
    const endIndex = (lastElement.endIndex || 2) - 1;

    if (endIndex <= 1) {
      return {
        documentId: params.document_id,
        status: "Success (already empty)",
      };
    }

    const updateResponse = await withRetry(() =>
      docs.documents.batchUpdate({
        documentId: params.document_id,
        requestBody: {
          requests: [
            {
              deleteContentRange: {
                range: {
                  startIndex: 1,
                  endIndex: endIndex,
                },
              },
            },
          ],
        },
      })
    );

    return {
      documentId: updateResponse.data?.documentId || params.document_id,
      status: "Success",
    };
  } catch (err: any) {
    throw handleDocsError(err);
  }
}
