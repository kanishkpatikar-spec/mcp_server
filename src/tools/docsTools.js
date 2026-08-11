"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGdocsAppendContent = handleGdocsAppendContent;
const zod_1 = require("zod");
const schemas_js_1 = require("./schemas.js");
const errors_js_1 = require("../utils/errors.js");
async function handleGdocsAppendContent(args) {
    try {
        const parsedArgs = schemas_js_1.GdocsAppendContentSchema.parse(args);
        // In Phase 5, we will implement actual Docs logic.
        return {
            content: [
                {
                    type: "text",
                    text: `Success! Appended content to document: ${parsedArgs.document_id}`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw (0, errors_js_1.createInvalidRequestError)(`Validation failed: ${error.message}`);
        }
        throw (0, errors_js_1.createInternalError)("Internal server error during gdocs_append_content");
    }
}
//# sourceMappingURL=docsTools.js.map