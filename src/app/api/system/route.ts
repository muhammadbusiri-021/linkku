import { NextResponse } from "next/server";
import { checkSystemCapabilities } from "@/lib/system";

export async function GET() {
  const status = await checkSystemCapabilities();
  return NextResponse.json(status);
}
