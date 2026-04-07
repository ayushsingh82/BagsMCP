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
