import { NextResponse } from "next/server";
import { inspectMediaUrl } from "@/lib/extractor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL media wajib disertakan." },
        { status: 400 }
      );
    }

    const metadata = await inspectMediaUrl(url);
    return NextResponse.json({ success: true, data: metadata });
  } catch (error: any) {
    console.error("Error inspecting media:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memproses link media ini. Pastikan link dapat diakses publik."
      },
      { status: 422 }
    );
  }
}
