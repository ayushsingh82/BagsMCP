#!/usr/bin/env node
/**
 * BagsMCP - MCP server exposing Bags API (tokens, lifetime fees, claim stats) for non-devs.
 * Run: npm run dev  or  node dist/index.js
 * Requires: BAGS_API_KEY in env (get from https://dev.bags.fm/)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getTokenLaunchFeed,
  getTokenLaunchCreators,
  getTokenLifetimeFees,
  getTokenClaimStats,
  getBagsPools,
  getClaimablePositions,
} from "./bags-api.js";
import { z } from "zod";

const BAGS_API_KEY = process.env.BAGS_API_KEY ?? "";

function requireApiKey(): string {
  if (!BAGS_API_KEY) {
    throw new Error(
      "BAGS_API_KEY is required. Get one at https://dev.bags.fm/ and set it in your environment."
    );
  }
  return BAGS_API_KEY;
}

const server = new McpServer({
  name: "bagsmcp",
  version: "1.0.0",
});

server.registerTool(
  "bags_get_token_launch_feed",
  {
    description:
      "Retrieve recent and active token launches from Bags feed.",
    inputSchema: {},
  },
  async () => {
    const apiKey = requireApiKey();
    const result = await getTokenLaunchFeed(apiKey);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching launch feed: ${result.error}` }],
        isError: true,
      };
    }
    const preview = result.response.slice(0, 25);
    return {
      content: [
        {
          type: "text",
          text: `Launch feed count: ${result.response.length}\nShowing first ${preview.length} items:\n${JSON.stringify(preview, null, 2)}`,
        },
      ],
    };
  }
);

server.registerTool(
  "bags_get_token_launch_creators",
  {
    description:
      "Retrieve creators/deployers of token launches (v3). Pass tokenMint for a specific token.",
    inputSchema: {
      tokenMint: z
        .string()
        .optional()
        .describe("Optional Solana token mint (Base58)."),
    },
  },
  async ({ tokenMint }) => {
    const apiKey = requireApiKey();
    const result = await getTokenLaunchCreators(apiKey, tokenMint);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching token creators: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_get_token_lifetime_fees",
  {
    description:
      "Get total lifetime fees collected for a Bags token (in lamports). Use this to see how much a token has earned in fees.",
    inputSchema: {
      tokenMint: z.string().describe("Solana token mint address (Base58)"),
    },
  },
  async ({ tokenMint }) => {
    const apiKey = requireApiKey();
    const result = await getTokenLifetimeFees(tokenMint, apiKey);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `Lifetime fees (lamports): ${result.response}\nToken mint: ${tokenMint}`,
        },
      ],
    };
  }
);

server.registerTool(
  "bags_get_token_claim_stats",
  {
    description:
      "Get claim statistics for all fee claimers of a Bags token: wallet, total claimed, royalty bps, and whether they are the creator. Use for top claimers and fee distribution.",
    inputSchema: {
      tokenMint: z.string().describe("Solana token mint address (Base58)"),
    },
  },
  async ({ tokenMint }) => {
    const apiKey = requireApiKey();
    const result = await getTokenClaimStats(tokenMint, apiKey);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error: ${result.error}` }],
        isError: true,
      };
    }
    const text =
      result.response.length === 0
        ? `No claim stats found for token ${tokenMint}.`
        : JSON.stringify(result.response, null, 2);
    return {
      content: [{ type: "text", text }],
    };
  }
);

server.registerTool(
  "bags_list_pools",
  {
    description:
      "List Bags pools (tokens). Returns token mints and pool info when the API supports it. Use for discovery.",
    inputSchema: {},
  },
  async () => {
    const apiKey = requireApiKey();
    const result = await getBagsPools(apiKey);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error: ${result.error}` }],
        isError: true,
      };
    }
    const text =
      result.response.length === 0
        ? "No pools returned."
        : JSON.stringify(result.response, null, 2);
    return {
      content: [{ type: "text", text }],
    };
  }
);

server.registerTool(
  "bags_get_claimable_positions",
  {
    description:
      "Retrieve claimable fee positions. Pass a wallet address to filter positions.",
    inputSchema: {
      wallet: z
        .string()
        .optional()
        .describe("Solana wallet address (Base58)."),
    },
  },
  async ({ wallet }) => {
    const apiKey = requireApiKey();
    const result = await getClaimablePositions(apiKey, wallet);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching claimable positions: ${result.error}` }],
        isError: true,
      };
    }
    const preview = result.response.slice(0, 50);
    return {
      content: [
        {
          type: "text",
          text: `Claimable positions count: ${result.response.length}\nShowing first ${preview.length} items:\n${JSON.stringify(preview, null, 2)}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("BagsMCP server running on stdio.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
