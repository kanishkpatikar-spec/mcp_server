# Google Workspace MCP Server

A standalone, client-agnostic Model Context Protocol (MCP) server that exposes tools to interact with Google Workspace (Gmail and Google Docs). It runs as an Express web service and supports the HTTP/SSE transport layer for robust and scalable client connections.

## 🚀 Setup Guide

### 1. Create a Google OAuth App
To use this server, you need to create a Google Cloud Project and obtain OAuth credentials.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "MCP Workspace Setup").
3. Navigate to **APIs & Services > Library** and enable the **Gmail API** and **Google Docs API**.
4. Navigate to **APIs & Services > OAuth consent screen** and configure it (External or Internal).
5. Navigate to **APIs & Services > Credentials**.
6. Click **Create Credentials > OAuth client ID**. Choose **Desktop App** or **Web application**.
7. Download the credentials JSON file and save it as `credentials.json` in the root of this project.

### 2. Required Scopes
Ensure your OAuth app requests the following scopes:
- `https://www.googleapis.com/auth/gmail.send` (for sending emails and drafts)
- `https://www.googleapis.com/auth/documents` (for appending to Google Docs)

### 3. Environment Variable Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill out the variables in your `.env` file:
```env
# Optional: Bearer token to secure your MCP server endpoints
MCP_API_KEY=your_secure_api_key

# The port the server runs on
PORT=3000
```
*(Note: Google OAuth tokens will be automatically saved to `tokens.json` after running the initial auth script `npm run auth`)*.

---

## 🛠️ Usage Examples

This server uses the **SSE Transport** instead of `stdio`. 
If you are using a generic MCP Client SDK, refer to [CLIENT_INTEGRATION.md](./CLIENT_INTEGRATION.md) for detailed code snippets.

### Sample MCP Client Configuration (Claude Desktop)

To connect Claude Desktop (which natively uses `stdio`) to this remote SSE server, you can use a bridge utility like `mcp-proxy` or `sse-to-stdio`. 
In your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "npx",
      "args": [
        "sse-to-stdio",
        "https://mcpserver-production-b397.up.railway.app/sse"
      ],
      "env": {
        "AUTH_BEARER_TOKEN": "your_secure_api_key"
      }
    }
  }
}
```

### Sample Tool Requests

#### 1. `gmail_create_draft`
**Description**: Creates an email draft in the authenticated user's Gmail.
**Payload**:
```json
{
  "to": ["example@example.com"],
  "subject": "Hello from MCP",
  "body": "This is a test draft."
}
```

#### 2. `gmail_send_email`
**Description**: Sends an email immediately.
**Payload**:
```json
{
  "to": ["manager@company.com"],
  "cc": ["team@company.com"],
  "subject": "Weekly Update",
  "body": "<h1>Progress</h1><p>We hit all milestones this week!</p>",
  "body_type": "html"
}
```

#### 3. `gdocs_append_content`
**Description**: Appends text to the end of a Google Doc.
**Payload**:
```json
{
  "document_id": "1A2B3C4D5E6F7G8H9I",
  "content": "Meeting Notes: Discussed phase 8 implementation.",
  "add_newline_before": true
}
```

---

## 🚧 Limitations & Future Enhancements

### v1 Constraints
- **Authentication**: Currently supports a single Google Workspace account (the one authenticated via `tokens.json`).
- **SSE Only**: Runs exclusively via HTTP/SSE. If strict `stdio` is required, an external proxy/bridge is necessary.
- **Stateless execution**: Does not poll for incoming emails or listen to Google Drive webhooks.

### Future Enhancements
- **Attachments**: Add support for attaching files to Gmail tools (e.g., uploading local files or generating PDFs).
- **Richer Docs Formatting**: Allow appending headers, bold text, lists, or tables instead of just plain text.
- **Multi-Account Support**: Implement service accounts or dynamic token passing to support acting on behalf of multiple users simultaneously.
- **Read Capabilities**: Add tools to read recent emails or read document content to give the agent more context.