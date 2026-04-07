import { NextResponse } from "next/server";
import { bagsFetch, getApiKey } from "@/lib/bags-api";

export async function GET() {
  try {
    const result = await bagsFetch<unknown>("/solana/bags/pools", getApiKey());
    if (!result.success) return NextResponse.json(result);
    const arr = Array.isArray(result.response) ? result.response : [];
    return NextResponse.json({ success: true, response: arr });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
