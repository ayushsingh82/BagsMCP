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
  getCurrentUserInfo,
  createTokenInfo,
  getFeeShareWalletV2,
  getFeeShareWalletV2Bulk,
  createFeeShareConfig,
  getFeeShareAdminList,
  createFeeShareAdminTransferTx,
  createFeeShareAdminUpdateConfig,
  getTradeQuote,
  createSwapTransaction,
  getPartnerStats,
  createPartnerClaimTransactions,
  listIncorporationProjects,
  getIncorporationProjectDetails,
  sendSolanaTransaction,
  checkDexscreenerOrderAvailability,
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
  "bags_get_current_user_info",
  {
    description: "Get authenticated Bags user info for the configured API key.",
    inputSchema: {},
  },
  async () => {
    const apiKey = requireApiKey();
    const result = await getCurrentUserInfo(apiKey);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching user info: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

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
  "bags_create_token_info",
  {
    description:
      "Create token metadata and mint setup for launch. Uses imageUrl/metadataUrl flow.",
    inputSchema: {
      name: z.string().max(32).describe("Token name, max 32 chars."),
      symbol: z.string().max(10).describe("Token symbol, max 10 chars."),
      description: z.string().max(1000).describe("Token description, max 1000 chars."),
      imageUrl: z.string().url().optional().describe("Public token image URL."),
      metadataUrl: z.string().url().optional().describe("Optional metadata JSON URL."),
      telegram: z.string().optional().describe("Optional Telegram URL."),
      twitter: z.string().optional().describe("Optional Twitter URL."),
      website: z.string().optional().describe("Optional website URL."),
    },
  },
  async (args) => {
    const apiKey = requireApiKey();
    if (!args.imageUrl) {
      return {
        content: [{ type: "text", text: "imageUrl is required in this MCP tool version (file upload not supported)." }],
        isError: true,
      };
    }
    const result = await createTokenInfo(apiKey, args);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error creating token info: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
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
  "bags_get_fee_share_wallet_v2",
  {
    description: "Get fee share wallet by provider and username.",
    inputSchema: {
      provider: z
        .enum(["apple", "google", "email", "solana", "twitter", "tiktok", "kick", "instagram", "onlyfans", "github", "moltbook"])
        .describe("Social provider."),
      username: z.string().min(1).max(100).describe("Provider username/handle."),
    },
  },
  async ({ provider, username }) => {
    const apiKey = requireApiKey();
    const result = await getFeeShareWalletV2(apiKey, provider, username);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching fee share wallet: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_get_fee_share_wallet_v2_bulk",
  {
    description: "Bulk lookup fee share wallets by provider and username.",
    inputSchema: {
      items: z
        .array(
          z.object({
            provider: z.enum(["apple", "google", "email", "solana", "twitter", "tiktok", "kick", "instagram", "onlyfans", "github", "moltbook"]),
            username: z.string().min(1).max(100),
          })
        )
        .min(1)
        .max(100)
        .describe("1-100 provider/username lookup items."),
    },
  },
  async ({ items }) => {
    const apiKey = requireApiKey();
    const result = await getFeeShareWalletV2Bulk(apiKey, items);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error bulk fetching fee share wallets: ${result.error}` }],
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
  "bags_create_fee_share_config",
  {
    description: "Create fee share config creation transaction payload.",
    inputSchema: {
      payer: z.string().describe("Payer wallet public key."),
      baseMint: z.string().describe("Token mint public key."),
      claimersArray: z.array(z.string()).min(1).max(100),
      basisPointsArray: z.array(z.number()).min(1).max(100),
      partner: z.string().optional(),
      partnerConfig: z.string().optional(),
      additionalLookupTables: z.array(z.string()).optional(),
      bagsConfigType: z
        .enum([
          "fa29606e-5e48-4c37-827f-4b03d58ee23d",
          "d16d3585-6488-4a6c-9a6f-e6c39ca0fda3",
          "a7c8e1f2-3d4b-5a6c-9e0f-1b2c3d4e5f6a",
          "48e26d2f-0a9d-4625-a3cc-c3987d874b9e",
        ])
        .optional(),
      tipWallet: z.string().optional(),
      tipLamports: z.number().optional(),
    },
  },
  async (args) => {
    const apiKey = requireApiKey();
    const result = await createFeeShareConfig(apiKey, args);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error creating fee share config: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
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
  "bags_get_fee_share_admin_list",
  {
    description: "Get token mints where wallet is fee share admin.",
    inputSchema: {
      wallet: z.string().describe("Wallet public key."),
    },
  },
  async ({ wallet }) => {
    const apiKey = requireApiKey();
    const result = await getFeeShareAdminList(apiKey, wallet);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching fee share admin list: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_create_fee_share_admin_transfer_tx",
  {
    description: "Create fee share admin transfer transaction.",
    inputSchema: {
      baseMint: z.string(),
      currentAdmin: z.string(),
      newAdmin: z.string(),
      payer: z.string(),
    },
  },
  async (args) => {
    const apiKey = requireApiKey();
    const result = await createFeeShareAdminTransferTx(apiKey, args);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error creating admin transfer tx: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_create_fee_share_admin_update_config",
  {
    description: "Create transactions to update fee share admin config.",
    inputSchema: {
      baseMint: z.string(),
      basisPointsArray: z.array(z.number().min(0).max(10000)).min(1).max(100),
      claimersArray: z.array(z.string()).min(1).max(100),
      payer: z.string(),
      additionalLookupTables: z.array(z.string()).optional(),
    },
  },
  async (args) => {
    const apiKey = requireApiKey();
    const result = await createFeeShareAdminUpdateConfig(apiKey, args);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error updating fee share admin config: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
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
  "bags_get_trade_quote",
  {
    description: "Get swap quote with route plan and slippage info.",
    inputSchema: {
      inputMint: z.string(),
      outputMint: z.string(),
      amount: z.number(),
      slippageMode: z.enum(["auto", "manual"]).optional(),
      slippageBps: z.number().min(0).max(10000).optional(),
    },
  },
  async ({ inputMint, outputMint, amount, slippageMode, slippageBps }) => {
    const apiKey = requireApiKey();
    if (slippageMode === "manual" && typeof slippageBps !== "number") {
      return {
        content: [{ type: "text", text: "slippageBps is required when slippageMode='manual'." }],
        isError: true,
      };
    }
    const result = await getTradeQuote(apiKey, {
      inputMint,
      outputMint,
      amount,
      slippageMode,
      slippageBps,
    });
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error getting trade quote: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_create_swap_transaction",
  {
    description: "Create a swap transaction from a quote response.",
    inputSchema: {
      quoteResponse: z.record(z.string(), z.unknown()),
      userPublicKey: z.string(),
    },
  },
  async ({ quoteResponse, userPublicKey }) => {
    const apiKey = requireApiKey();
    const result = await createSwapTransaction(apiKey, { quoteResponse, userPublicKey });
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error creating swap transaction: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_get_partner_stats",
  {
    description: "Get partner fee stats (claimed and unclaimed).",
    inputSchema: {
      partner: z.string().describe("Partner wallet public key."),
    },
  },
  async ({ partner }) => {
    const apiKey = requireApiKey();
    const result = await getPartnerStats(apiKey, partner);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching partner stats: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_create_partner_claim_transactions",
  {
    description: "Create partner fee claim transactions.",
    inputSchema: {
      partnerWallet: z.string().describe("Partner wallet public key."),
    },
  },
  async ({ partnerWallet }) => {
    const apiKey = requireApiKey();
    const result = await createPartnerClaimTransactions(apiKey, partnerWallet);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error creating partner claim transactions: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_list_incorporation_projects",
  {
    description: "List all incorporation projects for the authenticated API key.",
    inputSchema: {},
  },
  async () => {
    const apiKey = requireApiKey();
    const result = await listIncorporationProjects(apiKey);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error listing incorporation projects: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_get_incorporation_project_details",
  {
    description: "Get details for one incorporation project by token address.",
    inputSchema: {
      tokenAddress: z.string().describe("Token mint address."),
    },
  },
  async ({ tokenAddress }) => {
    const apiKey = requireApiKey();
    const result = await getIncorporationProjectDetails(apiKey, tokenAddress);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error fetching incorporation details: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
    };
  }
);

server.registerTool(
  "bags_send_solana_transaction",
  {
    description: "Submit a signed serialized Solana transaction to network.",
    inputSchema: {
      transaction: z.string().describe("Base58 encoded serialized transaction."),
    },
  },
  async ({ transaction }) => {
    const apiKey = requireApiKey();
    const result = await sendSolanaTransaction(apiKey, transaction);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error sending transaction: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: `Transaction signature: ${result.response}` }],
    };
  }
);

server.registerTool(
  "bags_check_dexscreener_order_availability",
  {
    description: "Check Dexscreener token info order availability for a token.",
    inputSchema: {
      tokenAddress: z.string().describe("Solana token public key."),
    },
  },
  async ({ tokenAddress }) => {
    const apiKey = requireApiKey();
    const result = await checkDexscreenerOrderAvailability(apiKey, tokenAddress);
    if (!result.success) {
      return {
        content: [{ type: "text", text: `Error checking Dexscreener availability: ${result.error}` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result.response, null, 2) }],
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
