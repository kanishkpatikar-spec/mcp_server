"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.GdocsAppendContentSchema = exports.GmailCreateDraftSchema = exports.GmailSendEmailSchema = void 0;
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
exports.GmailSendEmailSchema = zod_1.z.object({
    to: zod_1.z.array(zod_1.z.string().email()).min(1, "At least one recipient is required"),
    cc: zod_1.z.array(zod_1.z.string().email()).optional(),
    bcc: zod_1.z.array(zod_1.z.string().email()).optional(),
    subject: zod_1.z.string().min(1, "Subject is required"),
    body: zod_1.z.string().min(1, "Body is required"),
    body_type: zod_1.z.enum(["text", "html"]).default("text"),
});
exports.GmailCreateDraftSchema = exports.GmailSendEmailSchema;
exports.GdocsAppendContentSchema = zod_1.z.object({
    document_id: zod_1.z.string().min(1, "Document ID is required"),
    content: zod_1.z.string().min(1, "Content to append is required"),
    add_newline_before: zod_1.z.boolean().default(true),
});
// JSON Schema representations for list_tools
exports.schemas = {
    gmailSendEmail: (0, zod_to_json_schema_1.zodToJsonSchema)(exports.GmailSendEmailSchema),
    gmailCreateDraft: (0, zod_to_json_schema_1.zodToJsonSchema)(exports.GmailCreateDraftSchema),
    gdocsAppendContent: (0, zod_to_json_schema_1.zodToJsonSchema)(exports.GdocsAppendContentSchema),
};
//# sourceMappingURL=schemas.js.map