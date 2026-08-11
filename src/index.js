"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const schemas_js_1 = require("./tools/schemas.js");
const gmailTools_js_1 = require("./tools/gmailTools.js");
const docsTools_js_1 = require("./tools/docsTools.js");
class GoogleWorkspaceMcpServer {
    server;
    constructor() {
        this.server = new index_js_1.Server({
            name: "google-workspace-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = (error) => console.error("[MCP Error]", error);
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "gmail_send_email",
                    description: "Send an email using Gmail",
                    inputSchema: schemas_js_1.schemas.gmailSendEmail,
                },
                {
                    name: "gmail_create_draft",
                    description: "Create an email draft using Gmail",
                    inputSchema: schemas_js_1.schemas.gmailCreateDraft,
                },
                {
                    name: "gdocs_append_content",
                    description: "Append content to a Google Document",
                    inputSchema: schemas_js_1.schemas.gdocsAppendContent,
                },
            ],
        }));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case "gmail_send_email":
                    return await (0, gmailTools_js_1.handleGmailSendEmail)(request.params.arguments);
                case "gmail_create_draft":
                    return await (0, gmailTools_js_1.handleGmailCreateDraft)(request.params.arguments);
                case "gdocs_append_content":
                    return await (0, docsTools_js_1.handleGdocsAppendContent)(request.params.arguments);
                default:
                    throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error("Google Workspace MCP server running on stdio");
    }
}
const server = new GoogleWorkspaceMcpServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map