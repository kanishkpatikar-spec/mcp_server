import { z } from "zod";
export declare const GmailSendEmailSchema: z.ZodObject<{
    to: z.ZodArray<z.ZodString>;
    cc: z.ZodOptional<z.ZodArray<z.ZodString>>;
    bcc: z.ZodOptional<z.ZodArray<z.ZodString>>;
    subject: z.ZodString;
    body: z.ZodString;
    body_type: z.ZodDefault<z.ZodEnum<{
        html: "html";
        text: "text";
    }>>;
}, z.core.$strip>;
export declare const GmailCreateDraftSchema: z.ZodObject<{
    to: z.ZodArray<z.ZodString>;
    cc: z.ZodOptional<z.ZodArray<z.ZodString>>;
    bcc: z.ZodOptional<z.ZodArray<z.ZodString>>;
    subject: z.ZodString;
    body: z.ZodString;
    body_type: z.ZodDefault<z.ZodEnum<{
        html: "html";
        text: "text";
    }>>;
}, z.core.$strip>;
export declare const GdocsAppendContentSchema: z.ZodObject<{
    document_id: z.ZodString;
    content: z.ZodString;
    add_newline_before: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const schemas: {
    gmailSendEmail: import("zod-to-json-schema").JsonSchema7Type & {
        $schema?: string | undefined;
        definitions?: {
            [key: string]: import("zod-to-json-schema").JsonSchema7Type;
        } | undefined;
    };
    gmailCreateDraft: import("zod-to-json-schema").JsonSchema7Type & {
        $schema?: string | undefined;
        definitions?: {
            [key: string]: import("zod-to-json-schema").JsonSchema7Type;
        } | undefined;
    };
    gdocsAppendContent: import("zod-to-json-schema").JsonSchema7Type & {
        $schema?: string | undefined;
        definitions?: {
            [key: string]: import("zod-to-json-schema").JsonSchema7Type;
        } | undefined;
    };
};
//# sourceMappingURL=schemas.d.ts.map