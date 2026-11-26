import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "media_linkku.mp4";

  if (!targetUrl) {
    return NextResponse.json({ error: "Parameter url wajib diisi." }, { status: 400 });
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return NextResponse.json(
        { error: `Gagal mengunduh dari sumber (${upstreamRes.status}).` },
        { status: upstreamRes.status }
      );
    }

    const contentType = upstreamRes.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstreamRes.headers.get("content-length");

    // Clean safe filename
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`
    );

    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    return new Response(upstreamRes.body as any, {
      status: 200,
      headers: responseHeaders
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat mengalirkan file unduhan." },
      { status: 500 }
    );
  }
}
