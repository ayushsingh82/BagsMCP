const BAGS_API_BASE = "https://public-api-v2.bags.fm/api/v1";

export async function bagsFetch<T>(
  path: string,
  apiKey: string,
  params?: Record<string, string>
): Promise<{ success: true; response: T } | { success: false; error: string }> {
  const url = new URL(BAGS_API_BASE + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { "x-api-key": apiKey },
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data?.error ?? res.statusText };
  }
  return data;
}

export function getApiKey(): string {
  const key = process.env.BAGS_API_KEY;
  if (!key) {
    throw new Error("BAGS_API_KEY is not configured");
  }
  return key;
}
