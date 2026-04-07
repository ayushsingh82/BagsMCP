# BagsMCP Server

MCP server that exposes Bags API data as **tools** so you can query launch feed, pools, creators, claimable positions, lifetime fees, and claim stats from AI assistants (Cursor, Claude), spreadsheets, or any MCP client—no code required.

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
2. Add this config:

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "npx",
      "args": ["-y", "tsx", "${workspaceFolder}/mcp-server/src/index.ts"],
      "env": {
        "BAGS_API_KEY": "your_bags_api_key"
      }
    }
  }
}
```

## Connect from Claude Desktop

Add this to your Claude Desktop config (`~/.config/claude-desktop/config.json` on Linux, `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/BagsMCP/mcp-server/src/index.ts"],
      "env": {
        "BAGS_API_KEY": "your_bags_api_key"
      }
    }
  }
}
```

Replace `/path/to/BagsMCP` with the actual path where you cloned the repo.

Restart Cursor (or reload MCP) and you can ask the AI to use Bags data via the tools below.

## Tools

| Tool | Description |
|------|-------------|
| `bags_get_token_launch_feed` | Get recent/active token launch feed from Bags. |
| `bags_get_token_launch_creators` | Get token creators/deployers (v3). Optional `tokenMint` filter. |
| `bags_get_token_lifetime_fees` | Get total lifetime fees (lamports) for a token mint. |
| `bags_get_token_claim_stats` | Get claim stats for all fee claimers: wallet, total claimed, royalty bps, is creator. |
| `bags_list_pools` | List all Bags pools with token mint + DBC/DAMM pool keys. |
| `bags_get_claimable_positions` | Get claimable fee positions for a `wallet` address. |

All tools require a valid `BAGS_API_KEY` in the environment.

## Testing

### Quick test (all tools)

Make sure you have a `.env` file in the project root with your API key:

```bash
echo "BAGS_API_KEY=your_key_here" > .env
```

Then run individual tool tests via stdin JSON-RPC:

```bash
# 1. Test server starts
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
  | bash mcp-server/run-mcp.sh 2>/dev/null

# 2. List all registered tools
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null
```

### Test each tool

Replace `MINT` and `WALLET` with real values. A known test mint: `fCr6CkpRDnpuwxqWmfTjQpu4XrsbRFm4fLWU9PtBAGS`

```bash
MINT="fCr6CkpRDnpuwxqWmfTjQpu4XrsbRFm4fLWU9PtBAGS"
WALLET="8pkdpxzAxqNKdt1wot9bxRwXa4VHGjXKwjvKGqKd7C9J"
INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n'

# bags_list_pools (no args)
printf "${INIT}"'{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"bags_list_pools","arguments":{}}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null

# bags_get_token_launch_feed (no args)
printf "${INIT}"'{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"bags_get_token_launch_feed","arguments":{}}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null

# bags_get_token_launch_creators (needs tokenMint)
printf "${INIT}"'{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"bags_get_token_launch_creators","arguments":{"tokenMint":"'$MINT'"}}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null

# bags_get_token_lifetime_fees (needs tokenMint)
printf "${INIT}"'{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"bags_get_token_lifetime_fees","arguments":{"tokenMint":"'$MINT'"}}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null

# bags_get_token_claim_stats (needs tokenMint)
printf "${INIT}"'{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"bags_get_token_claim_stats","arguments":{"tokenMint":"'$MINT'"}}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null

# bags_get_claimable_positions (needs wallet)
printf "${INIT}"'{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"bags_get_claimable_positions","arguments":{"wallet":"'$WALLET'"}}}\n' \
  | bash mcp-server/run-mcp.sh 2>/dev/null
```

### Expected results

| Tool | Expected |
|------|----------|
| `bags_list_pools` | JSON array of pools with `tokenMint`, `dbcPoolKey` fields |
| `bags_get_token_launch_feed` | `Launch feed count: N` + JSON array of launches |
| `bags_get_token_launch_creators` | JSON array with `username`, `wallet`, `royaltyBps` |
| `bags_get_token_lifetime_fees` | `Lifetime fees (lamports): N` |
| `bags_get_token_claim_stats` | JSON array with `wallet`, `totalClaimed`, `isCreator` |
| `bags_get_claimable_positions` | `Claimable positions count: N` + JSON array |

If any tool returns `isError: true`, check:
1. `.env` file exists with a valid `BAGS_API_KEY`
2. `npm install` was run in `mcp-server/`
3. The Bags API is reachable (`curl https://public-api-v2.bags.fm/api/v1/token-launch/feed -H "x-api-key: YOUR_KEY"`)

## API reference

- Base URL: `https://public-api-v2.bags.fm/api/v1`
- Auth: `x-api-key` header
- Docs: [docs.bags.fm](https://docs.bags.fm/)

## License

ISC
