import { NextRequest, NextResponse } from "next/server";
import { bagsFetch, getApiKey } from "@/lib/bags-api";

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get("wallet") ?? undefined;
    const result = await bagsFetch<unknown[]>(
      "/token-launch/claimable-positions",
      getApiKey(),
      wallet ? { wallet } : undefined
    );
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
