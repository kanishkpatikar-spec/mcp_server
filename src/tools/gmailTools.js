"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGmailSendEmail = handleGmailSendEmail;
exports.handleGmailCreateDraft = handleGmailCreateDraft;
const zod_1 = require("zod");
const schemas_js_1 = require("./schemas.js");
const errors_js_1 = require("../utils/errors.js");
async function handleGmailSendEmail(args) {
    try {
        const parsedArgs = schemas_js_1.GmailSendEmailSchema.parse(args);
        // In Phase 4, we will implement actual Gmail logic.
        return {
            content: [
                {
                    type: "text",
                    text: `Success! Email would be sent to: ${parsedArgs.to.join(", ")}\nSubject: ${parsedArgs.subject}`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw (0, errors_js_1.createInvalidRequestError)(`Validation failed: ${error.message}`);
        }
        throw (0, errors_js_1.createInternalError)("Internal server error during gmail_send_email");
    }
}
async function handleGmailCreateDraft(args) {
    try {
        const parsedArgs = schemas_js_1.GmailCreateDraftSchema.parse(args);
        // In Phase 4, we will implement actual Gmail logic.
        return {
            content: [
                {
                    type: "text",
                    text: `Success! Draft would be created for: ${parsedArgs.to.join(", ")}\nSubject: ${parsedArgs.subject}`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw (0, errors_js_1.createInvalidRequestError)(`Validation failed: ${error.message}`);
        }
        throw (0, errors_js_1.createInternalError)("Internal server error during gmail_create_draft");
    }
}
//# sourceMappingURL=gmailTools.js.map