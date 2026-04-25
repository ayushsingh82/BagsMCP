# BagsMCP

BagsMCP is a TypeScript MCP server that exposes Bags APIs as model-callable tools.  
It is designed for AI-native workflows in Cursor, Claude, and other MCP-compatible clients.

With BagsMCP, teams can query launches, creators, fees, claim stats, pools, partner analytics, and transaction builders from natural language prompts without writing custom backend integrations.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [MCP Client Setup](#mcp-client-setup)
  - [Cursor](#cursor)
  - [Claude Desktop](#claude-desktop)
- [Tools](#tools)
- [Example Prompts](#example-prompts)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

- **Protocol:** [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **Transport:** STDIO (via `run-mcp.sh` / Node runtime)
- **API source:** `https://public-api-v2.bags.fm/api/v1`
- **Auth:** `BAGS_API_KEY` environment variable

This repository includes:
- A marketing/documentation UI (`Next.js` app)
- An MCP server implementation in `mcp-server/`

## Key Features

- 22 Bags tools exposed through MCP
- Read + action workflows (analytics, config tx builders, swap tx builders, submit signed tx)
- Token launch and creator intelligence
- Fee-share and claimer analytics
- Pool, partner, and Dexscreener availability checks
- Works with Cursor and Claude via JSON MCP config

## Prerequisites

- Node.js `>=18`
- npm
- A valid Bags API key (`BAGS_API_KEY`)

## Quickstart

```bash
git clone <your-repo-url>
cd BagsMCP/mcp-server
npm install
npm run build
```

Set API key:

```bash
export BAGS_API_KEY="YOUR_BAGS_API_KEY"
```

Run MCP server locally:

```bash
npm run dev
```

Or production build:

```bash
npm run start
```

## MCP Client Setup

### Cursor

Add to project `.cursor/mcp.json` (or global `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "bash",
      "args": ["${workspaceFolder}/mcp-server/run-mcp.sh"]
    }
  }
}
```

If workspace root is parent directory, use:

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "bash",
      "args": ["${workspaceFolder}/BagsMCP/mcp-server/run-mcp.sh"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bagsmcp": {
      "command": "bash",
      "args": ["/absolute/path/to/BagsMCP/mcp-server/run-mcp.sh"]
    }
  }
}
```

Replace `/absolute/path/to/BagsMCP` with your local path.

## Tools

BagsMCP currently exposes **22 tools**:

1. `bags_get_current_user_info`
2. `bags_get_token_launch_feed`
3. `bags_create_token_info`
4. `bags_get_token_launch_creators`
5. `bags_get_fee_share_wallet_v2`
6. `bags_get_fee_share_wallet_v2_bulk`
7. `bags_get_token_lifetime_fees`
8. `bags_create_fee_share_config`
9. `bags_get_token_claim_stats`
10. `bags_get_fee_share_admin_list`
11. `bags_create_fee_share_admin_transfer_tx`
12. `bags_create_fee_share_admin_update_config`
13. `bags_list_pools`
14. `bags_get_trade_quote`
15. `bags_create_swap_transaction`
16. `bags_get_partner_stats`
17. `bags_create_partner_claim_transactions`
18. `bags_list_incorporation_projects`
19. `bags_get_incorporation_project_details`
20. `bags_send_solana_transaction`
21. `bags_check_dexscreener_order_availability`
22. `bags_get_claimable_positions`

## Example Prompts

- "Call `bags_get_token_lifetime_fees` for tokenMint `ABadLP3asy88raGZciQf61Lb4ZWhVbdpptjnZ4JuBAGS`."
- "Run `bags_get_token_launch_creators` and `bags_get_token_claim_stats` for this mint and compare creator vs top claimer."
- "Find claimable balances for wallet `8Avuf3LN4Wxz6Pf3j24PnKPNMh1j2stzSGLJcmri5cxY`."
- "Get `bags_list_pools` and return `dbcConfigKey`, `dbcPoolKey`, and `dammV2PoolKey` for a token."

## Development

Server package location: `mcp-server/`

Useful scripts:

```bash
# inside mcp-server/
npm run dev     # tsx src/index.ts
npm run build   # tsc
npm run start   # node dist/index.js
```

Main entrypoint:

- `mcp-server/src/index.ts`

## Troubleshooting

- **Missing API key**
  - Error: `BAGS_API_KEY is required`
  - Fix: export `BAGS_API_KEY` in your shell or `.env` loaded by `run-mcp.sh`
- **Tools not visible in client**
  - Confirm MCP config path and restart the MCP client
  - Verify `run-mcp.sh` is executable and points to valid server build/runtime
- **Path issues in Cursor**
  - Use `${workspaceFolder}/BagsMCP/mcp-server/run-mcp.sh` when your workspace root is parent folder

## License

Private and proprietary.

---

**BagsMCP** - Bags API via MCP for AI-native workflows.
