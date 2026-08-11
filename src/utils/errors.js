"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvalidRequestError = createInvalidRequestError;
exports.createInternalError = createInternalError;
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
function createInvalidRequestError(message) {
    return new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, message);
}
function createInternalError(message) {
    return new types_js_1.McpError(types_js_1.ErrorCode.InternalError, message);
}
//# sourceMappingURL=errors.js.map