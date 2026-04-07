import { NextRequest, NextResponse } from "next/server";
import { bagsFetch, getApiKey } from "@/lib/bags-api";

export async function GET(req: NextRequest) {
  try {
    const tokenMint = req.nextUrl.searchParams.get("tokenMint") ?? undefined;
    const result = await bagsFetch<unknown[]>(
      "/token-launch/creator/v3",
      getApiKey(),
      tokenMint ? { tokenMint } : undefined
    );
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
