# Client Integration (HTTP/SSE)

This document explains how to connect an MCP Client to this Google Workspace MCP server. Unlike standard local MCP servers that use standard input/output (`stdio`), this server is deployed as a web service and uses HTTP Server-Sent Events (SSE).

## 1. Using the MCP TypeScript SDK

If you are building a custom client in TypeScript or JavaScript, you can use the `@modelcontextprotocol/sdk` to connect to the server.

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function run() {
  const serverUrl = "https://mcpserver-production-b397.up.railway.app";
  const apiKey = "YOUR_API_KEY_HERE"; // Optional, depending on configuration

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  // Connect to the /sse endpoint
  const sseUrl = new URL(`${serverUrl}/sse`);
  const transport = new SSEClientTransport(sseUrl, {
    requestInit: {
      headers
    }
  });

  const client = new Client(
    { name: "my-custom-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  
  // You can now list and call tools
  const tools = await client.listTools();
  console.log(tools);
}

run().catch(console.error);
```

## 2. Using the MCP Python SDK

For Python-based clients, use the `mcp` library:

```python
import asyncio
from mcp import ClientSession
from mcp.client.sse import sse_client

async def run():
    url = "https://mcpserver-production-b397.up.railway.app/sse"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY_HERE"
    }

    async with sse_client(url, headers=headers) as streams:
        async with ClientSession(streams[0], streams[1]) as session:
            await session.initialize()
            
            # List tools
            tools = await session.list_tools()
            print(tools)

if __name__ == "__main__":
    asyncio.run(run())
```

## 3. Connecting Claude Desktop

Claude Desktop natively connects to local servers via `stdio`. To connect Claude Desktop to a remote SSE server, you will need a proxy utility that bridges `stdio` to `SSE`.

One such tool is the open-source `mcp-proxy` or a similar bridge script. 

If you use a bridge script (e.g., `npx sse-to-stdio`), you would configure Claude Desktop (`claude_desktop_config.json`) like this:

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
        "AUTH_BEARER_TOKEN": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```
*(Note: Replace `sse-to-stdio` with an actual bridge utility that fits your environment, as Claude Desktop doesn't natively speak HTTP SSE for configured tools yet.)*

## 4. API Key Authentication

This server enforces basic security via an API key. 
Ensure that your `.env` or deployment environment has `MCP_API_KEY` set.
Clients must provide this key in the HTTP `Authorization` header as a Bearer token:
`Authorization: Bearer <YOUR_API_KEY>`
