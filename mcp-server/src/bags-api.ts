/**
 * Bags API client - read-only calls for MCP tools.
 * Base URL: https://public-api-v2.bags.fm/api/v1
 * Auth: x-api-key header
 */

const BAGS_API_BASE = "https://public-api-v2.bags.fm/api/v1";

export type BagsApiResponse<T> =
  | { success: true; response: T }
  | { success: false; error: string };

async function bagsFetch<T>(
  path: string,
  apiKey: string,
  params?: Record<string, string>
): Promise<BagsApiResponse<T>> {
  const url = new URL(BAGS_API_BASE + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { "x-api-key": apiKey },
  });
  const data = (await res.json()) as BagsApiResponse<T>;
  if (!res.ok) {
    return { success: false, error: (data as { error?: string }).error ?? res.statusText };
  }
  return data;
}

async function bagsPostJson<T>(
  path: string,
  apiKey: string,
  body: unknown
): Promise<BagsApiResponse<T>> {
  const res = await fetch(BAGS_API_BASE + path, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as BagsApiResponse<T>;
  if (!res.ok) {
    return {
      success: false,
      error: (data as { error?: string; response?: string }).error ?? (data as { response?: string }).response ?? res.statusText,
    };
  }
  return data;
}

async function bagsPostFormData<T>(
  path: string,
  apiKey: string,
  form: FormData
): Promise<BagsApiResponse<T>> {
  const res = await fetch(BAGS_API_BASE + path, {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
  });
  const data = (await res.json()) as BagsApiResponse<T>;
  if (!res.ok) {
    return {
      success: false,
      error: (data as { error?: string; response?: string }).error ?? (data as { response?: string }).response ?? res.statusText,
    };
  }
  return data;
}

type FeedItem = {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
  tokenMint?: string;
  status?: string;
  twitter?: string;
  website?: string;
  launchSignature?: string;
  uri?: string;
  dbcPoolKey?: string;
  dbcConfigKey?: string;
};

type CreatorItem = {
  username?: string;
  pfp?: string;
  royaltyBps?: number;
  isCreator?: boolean;
  wallet?: string;
  provider?: string;
  providerUsername?: string;
  twitterUsername?: string;
  bagsUsername?: string;
  isAdmin?: boolean;
};

/** GET /token-launch/lifetime-fees?tokenMint=... */
export async function getTokenLifetimeFees(
  tokenMint: string,
  apiKey: string
): Promise<BagsApiResponse<string>> {
  return bagsFetch<string>("/token-launch/lifetime-fees", apiKey, { tokenMint });
}

/** GET /token-launch/feed */
export async function getTokenLaunchFeed(
  apiKey: string
): Promise<BagsApiResponse<FeedItem[]>> {
  return bagsFetch<FeedItem[]>("/token-launch/feed", apiKey);
}

/** GET /token-launch/creator/v3?tokenMint=... (tokenMint optional in case API allows defaults) */
export async function getTokenLaunchCreators(
  apiKey: string,
  tokenMint?: string
): Promise<BagsApiResponse<CreatorItem[]>> {
  return bagsFetch<CreatorItem[]>(
    "/token-launch/creator/v3",
    apiKey,
    tokenMint ? { tokenMint } : undefined
  );
}

/** GET /token-launch/claim-stats?tokenMint=... - top claimers and stats */
export async function getTokenClaimStats(
  tokenMint: string,
  apiKey: string
): Promise<
  BagsApiResponse<
    Array<{
      username: string;
      wallet: string;
      totalClaimed: string;
      royaltyBps: number;
      isCreator: boolean;
      provider?: string;
      providerUsername?: string;
    }>
  >
> {
  return bagsFetch("/token-launch/claim-stats", apiKey, { tokenMint });
}

/** GET /solana/bags/pools - list Bags pools (token + pool keys). */
export async function getBagsPools(
  apiKey: string
): Promise<BagsApiResponse<Array<{ tokenMint?: string; baseMint?: string; [key: string]: unknown }>>> {
  const result = await bagsFetch<unknown>("/solana/bags/pools", apiKey);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  const arr = Array.isArray(result.response) ? result.response : [];
  return { success: true, response: arr as Array<{ tokenMint?: string; baseMint?: string; [key: string]: unknown }> };
}

/** GET /token-launch/claimable-positions?wallet=... */
export async function getClaimablePositions(
  apiKey: string,
  wallet?: string
): Promise<BagsApiResponse<Array<Record<string, unknown>>>> {
  return bagsFetch<Array<Record<string, unknown>>>(
    "/token-launch/claimable-positions",
    apiKey,
    wallet ? { wallet } : undefined
  );
}

/** GET /auth/me */
export async function getCurrentUserInfo(
  apiKey: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsFetch<Record<string, unknown>>("/auth/me", apiKey);
}

/** POST /token-launch/create-token-info */
export async function createTokenInfo(
  apiKey: string,
  input: {
    name: string;
    symbol: string;
    description: string;
    imageUrl?: string;
    metadataUrl?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
  }
): Promise<BagsApiResponse<Record<string, unknown>>> {
  const form = new FormData();
  form.append("name", input.name);
  form.append("symbol", input.symbol);
  form.append("description", input.description);
  if (input.imageUrl) form.append("imageUrl", input.imageUrl);
  if (input.metadataUrl) form.append("metadataUrl", input.metadataUrl);
  if (input.telegram) form.append("telegram", input.telegram);
  if (input.twitter) form.append("twitter", input.twitter);
  if (input.website) form.append("website", input.website);
  return bagsPostFormData<Record<string, unknown>>("/token-launch/create-token-info", apiKey, form);
}

/** GET /token-launch/fee-share/wallet/v2 */
export async function getFeeShareWalletV2(
  apiKey: string,
  provider: string,
  username: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsFetch<Record<string, unknown>>("/token-launch/fee-share/wallet/v2", apiKey, {
    provider,
    username,
  });
}

/** POST /token-launch/fee-share/wallet/v2/bulk */
export async function getFeeShareWalletV2Bulk(
  apiKey: string,
  items: Array<{ provider: string; username: string }>
): Promise<BagsApiResponse<Array<Record<string, unknown>>>> {
  return bagsPostJson<Array<Record<string, unknown>>>("/token-launch/fee-share/wallet/v2/bulk", apiKey, {
    items,
  });
}

/** POST /fee-share/config */
export async function createFeeShareConfig(
  apiKey: string,
  body: Record<string, unknown>
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsPostJson<Record<string, unknown>>("/fee-share/config", apiKey, body);
}

/** GET /fee-share/admin/list */
export async function getFeeShareAdminList(
  apiKey: string,
  wallet: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsFetch<Record<string, unknown>>("/fee-share/admin/list", apiKey, { wallet });
}

/** POST /fee-share/admin/transfer-tx */
export async function createFeeShareAdminTransferTx(
  apiKey: string,
  body: {
    baseMint: string;
    currentAdmin: string;
    newAdmin: string;
    payer: string;
  }
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsPostJson<Record<string, unknown>>("/fee-share/admin/transfer-tx", apiKey, body);
}

/** POST /fee-share/admin/update-config */
export async function createFeeShareAdminUpdateConfig(
  apiKey: string,
  body: Record<string, unknown>
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsPostJson<Record<string, unknown>>("/fee-share/admin/update-config", apiKey, body);
}

/** GET /trade/quote */
export async function getTradeQuote(
  apiKey: string,
  params: {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageMode?: "auto" | "manual";
    slippageBps?: number;
  }
): Promise<BagsApiResponse<Record<string, unknown>>> {
  const query: Record<string, string> = {
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: String(params.amount),
    slippageMode: params.slippageMode ?? "auto",
  };
  if (params.slippageMode === "manual" && typeof params.slippageBps === "number") {
    query.slippageBps = String(params.slippageBps);
  }
  return bagsFetch<Record<string, unknown>>("/trade/quote", apiKey, query);
}

/** POST /trade/swap */
export async function createSwapTransaction(
  apiKey: string,
  body: {
    quoteResponse: Record<string, unknown>;
    userPublicKey: string;
  }
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsPostJson<Record<string, unknown>>("/trade/swap", apiKey, body);
}

/** GET /fee-share/partner-config/stats */
export async function getPartnerStats(
  apiKey: string,
  partner: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsFetch<Record<string, unknown>>("/fee-share/partner-config/stats", apiKey, { partner });
}

/** POST /fee-share/partner-config/claim-tx */
export async function createPartnerClaimTransactions(
  apiKey: string,
  partnerWallet: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsPostJson<Record<string, unknown>>("/fee-share/partner-config/claim-tx", apiKey, { partnerWallet });
}

/** GET /incorporate/list */
export async function listIncorporationProjects(
  apiKey: string
): Promise<BagsApiResponse<Array<Record<string, unknown>>>> {
  return bagsFetch<Array<Record<string, unknown>>>("/incorporate/list", apiKey);
}

/** GET /incorporate/details/{tokenAddress} */
export async function getIncorporationProjectDetails(
  apiKey: string,
  tokenAddress: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsFetch<Record<string, unknown>>(`/incorporate/details/${encodeURIComponent(tokenAddress)}`, apiKey);
}

/** POST /solana/send-transaction */
export async function sendSolanaTransaction(
  apiKey: string,
  transaction: string
): Promise<BagsApiResponse<string>> {
  return bagsPostJson<string>("/solana/send-transaction", apiKey, { transaction });
}

/** GET /solana/dexscreener/order-availability */
export async function checkDexscreenerOrderAvailability(
  apiKey: string,
  tokenAddress: string
): Promise<BagsApiResponse<Record<string, unknown>>> {
  return bagsFetch<Record<string, unknown>>("/solana/dexscreener/order-availability", apiKey, {
    tokenAddress,
  });
}
