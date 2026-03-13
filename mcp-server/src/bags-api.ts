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
  const url = new URL(path, BAGS_API_BASE);
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

/** GET /token-launch/lifetime-fees?tokenMint=... */
export async function getTokenLifetimeFees(
  tokenMint: string,
  apiKey: string
): Promise<BagsApiResponse<string>> {
  return bagsFetch<string>("/token-launch/lifetime-fees", apiKey, { tokenMint });
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

/** GET /state/bags-pools - list Bags pools (tokens). Path may vary. */
export async function getBagsPools(
  apiKey: string
): Promise<BagsApiResponse<Array<{ tokenMint?: string; baseMint?: string; [key: string]: unknown }>>> {
  const result = await bagsFetch<unknown>("/state/bags-pools", apiKey);
  if (!result.success) {
    return { success: true, response: [] };
  }
  const arr = Array.isArray(result.response) ? result.response : [];
  return { success: true, response: arr as Array<{ tokenMint?: string; baseMint?: string; [key: string]: unknown }> };
}
