import { NextRequest, NextResponse } from "next/server";
import { bagsFetch, getApiKey } from "@/lib/bags-api";

export async function GET(req: NextRequest) {
  try {
    const tokenMint = req.nextUrl.searchParams.get("tokenMint");
    if (!tokenMint) {
      return NextResponse.json(
        { success: false, error: "tokenMint query param is required" },
        { status: 400 }
      );
    }
    const result = await bagsFetch<string>(
      "/token-launch/lifetime-fees",
      getApiKey(),
      { tokenMint }
    );
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
