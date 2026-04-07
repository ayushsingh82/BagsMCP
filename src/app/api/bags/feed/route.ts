import { NextResponse } from "next/server";
import { bagsFetch, getApiKey } from "@/lib/bags-api";

export async function GET() {
  try {
    const result = await bagsFetch<unknown[]>("/token-launch/feed", getApiKey());
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
