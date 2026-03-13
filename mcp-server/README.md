# BagsMCP Server

MCP server that exposes Bags API data as **tools** so you can query tokens, lifetime fees, and claim stats from AI assistants (Cursor, Claude), spreadsheets, or any MCP client—no code required.

## Prerequisites

- **Node.js 18+**
- **Bags API key** from [dev.bags.fm](https://dev.bags.fm/)

## Install

```bash
cd mcp-server
npm install
```

## Configure

Copy the example env file and set your Bags API key:

```bash
cp .env.example .env
# Edit .env and set BAGS_API_KEY=your_key
```

Or export in the shell:

```bash
export BAGS_API_KEY=your_bags_api_key
```

## Run

**Development (tsx, no build):**

```bash
npm run dev
```

**Production (build then run):**

```bash
npm run build
npm start
```

The server uses **stdio** transport. It will wait for JSON-RPC messages on stdin and write responses to stdout. Use it by configuring your MCP client (e.g. Cursor) to run this command.

## Connect from Cursor

1. Open Cursor Settings → MCP (or `~/.cursor/mcp.json`).
2. Add a server entry for BagsMCP, for example:

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "node",
      "args": ["/absolute/path/to/KalshiBags/mcp-server/dist/index.js"],
      "env": {
        "BAGS_API_KEY": "your_bags_api_key"
      }
    }
  }
}
```

Or use `npx` from the repo root:

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "node",
      "args": ["/path/to/KalshiBags/mcp-server/dist/index.js"],
      "env": {
        "BAGS_API_KEY": "<your key>"
      }
    }
  }
}
```

Restart Cursor (or reload MCP) and you can ask the AI to use Bags data via the tools below.

## Tools

| Tool | Description |
|------|-------------|
| `bags_get_token_lifetime_fees` | Get total lifetime fees (lamports) for a token mint. |
| `bags_get_token_claim_stats` | Get claim stats for all fee claimers: wallet, total claimed, royalty bps, is creator. |
| `bags_list_pools` | List Bags pools (tokens). Returns whatever the Bags API provides for listing. |

All tools require a valid `BAGS_API_KEY` in the environment.

## API reference

- Base URL: `https://public-api-v2.bags.fm/api/v1`
- Auth: `x-api-key` header
- Docs: [docs.bags.fm](https://docs.bags.fm/)

## License

ISC
