import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import process from "process";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { schemas } from "./tools/schemas.js";
import { handleGmailSendEmail, handleGmailCreateDraft } from "./tools/gmailTools.js";
import { handleGdocsAppendContent, handleGdocsClearContent } from "./tools/docsTools.js";
import { logInfo, logError } from "./utils/logger.js";
import { withTimeout } from "./utils/timeout.js";

class GoogleWorkspaceMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "google-workspace-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => logError("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "gmail_send_email",
          description: "Send an email using Gmail",
          inputSchema: schemas.gmailSendEmail,
        },
        {
          name: "gmail_create_draft",
          description: "Create an email draft using Gmail",
          inputSchema: schemas.gmailCreateDraft,
        },
        {
          name: "gdocs_append_content",
          description: "Append content to a Google Document",
          inputSchema: schemas.gdocsAppendContent,
        },
        {
          name: "gdocs_clear_content",
          description: "Clear all content from a Google Document",
          inputSchema: schemas.gdocsClearContent,
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const toolName = request.params.name;
      logInfo(`Executing tool: ${toolName}`);
      
      try {
        const result = await withTimeout(
          this.executeTool(toolName, request.params.arguments),
          30000, // 30 second timeout for all API calls
          toolName
        );
        logInfo(`Successfully executed tool: ${toolName}`);
        return result;
      } catch (error: any) {
        logError(`Failed to execute tool: ${toolName}`, error);
        
        if (error.code) {
           throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message || "Unknown error"}`
        );
      }
    });
  }

  private async executeTool(name: string, args: unknown) {
    switch (name) {
      case "gmail_send_email":
        return await handleGmailSendEmail(args);
      case "gmail_create_draft":
        return await handleGmailCreateDraft(args);
      case "gdocs_append_content":
        return await handleGdocsAppendContent(args);
      case "gdocs_clear_content":
        return await handleGdocsClearContent(args);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  }

  async run() {
    const app = express();
    const port = process.env.PORT || 3000;
    
    // API Key authentication middleware
    app.use((req, res, next) => {
      const apiKey = process.env.MCP_API_KEY;
      if (apiKey && req.path !== "/health") {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
          res.status(401).send("Unauthorized");
          return;
        }
      }
      next();
    });

    app.get("/health", (req, res) => {
      res.status(200).send("OK");
    });

    const transports = new Map<string, SSEServerTransport>();

    app.get("/sse", async (req, res) => {
      const transport = new SSEServerTransport("/messages", res);
      await this.server.connect(transport);
      
      const sessionId = transport.sessionId;
      transports.set(sessionId, transport);
      
      res.on("close", () => {
        transports.delete(sessionId);
        logInfo(`SSE connection closed for session: ${sessionId}`);
      });
    });

    app.post("/messages", async (req, res) => {
      const sessionId = req.query.sessionId as string;
      const transport = transports.get(sessionId);
      
      if (!transport) {
        res.status(404).send("Session not found");
        return;
      }
      
      await transport.handlePostMessage(req, res);
    });

    app.listen(port, () => {
      logInfo(`Google Workspace MCP server running on HTTP port ${port} (SSE Transport)`);
    });
  }
}

const server = new GoogleWorkspaceMcpServer();
server.run().catch((err) => logError("Fatal error during startup", err));
