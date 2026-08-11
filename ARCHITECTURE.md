# Architecture Diagram / Module Map

The MCP server separates concerns across different layers:

- **Transport Layer**: Connects stdio streams to the MCP server.
- **MCP Server Layer**: Manages server initialization, tool registration, and request dispatching.
- **Validation Layer**: Uses Zod or JSON Schema to validate tool arguments.
- **Service Layer**: Contains business logic to interact with Google APIs.
  - **Auth Manager**: Handles OAuth2 flow and credential refreshing.
  - **Gmail Service**: Interacts with Gmail API to send emails and create drafts.
  - **Docs Service**: Interacts with Google Docs API to append text.
- **Configuration Layer**: Loads environment variables and manages secrets.

## Module Map

```
src/
├── index.ts               # Server entrypoint (Transport & Initialization)
├── config/
│   └── env.ts             # Configuration and environment variables
├── google/
│   ├── auth.ts            # Google OAuth2 client manager
│   ├── gmail.ts           # Gmail API wrapper
│   └── docs.ts            # Google Docs API wrapper
├── tools/
│   ├── schemas.ts         # JSON schemas / Zod schemas for tool validation
│   ├── gmailTools.ts      # Tool handlers for Gmail actions
│   └── docsTools.ts       # Tool handlers for Google Docs actions
└── utils/
    └── errors.ts          # Structured error formatting
```
