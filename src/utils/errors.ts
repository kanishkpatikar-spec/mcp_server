import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export function createInvalidRequestError(message: string): McpError {
  return new McpError(ErrorCode.InvalidParams, message);
}

export function createInternalError(message: string): McpError {
  return new McpError(ErrorCode.InternalError, message);
}
