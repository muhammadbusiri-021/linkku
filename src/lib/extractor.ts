import { exec } from "child_process";
import { promisify } from "util";
import type { MediaFormat, MediaMetadata, PlatformType } from "@/types/media";
import { checkSystemCapabilities } from "./system";

const execAsync = promisify(exec);

export function identifyPlatform(rawUrl: string): PlatformType {
  const urlLower = rawUrl.toLowerCase();
  if (urlLower.includes("tiktok.com")) return "tiktok";
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
  if (urlLower.includes("threads.net")) return "threads";
  if (urlLower.includes("pinterest.com") || urlLower.includes("pin.it")) return "pinterest";
  if (
    urlLower.match(/\.(mp4|webm|mov|m4v|mkv)($|\?)/i) ||
    urlLower.includes("/video/") ||
    urlLower.includes("videodownload")
  ) {
    return "direct";
  }
  return "other";
}

function formatBytes(bytes?: number): string | undefined {
  if (!bytes || isNaN(bytes)) return undefined;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatSeconds(seconds?: number): string | undefined {
  if (!seconds || isNaN(seconds)) return undefined;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Native extractor for TikTok when yt-dlp is not present
 */
async function extractTikTokNative(url: string): Promise<MediaMetadata> {
  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  if (!res.ok) {
    throw new Error(`TikWM endpoint merespon dengan status ${res.status}`);
  }

  const json = await res.json();
  if (json.code !== 0 || !json.data) {
    throw new Error(json.msg || "Gagal mengekstrak video TikTok. Pastikan akun tidak privat.");
  }

  const data = json.data;
  const formats: MediaFormat[] = [];

  // HD video without watermark
  if (data.hdplay) {
    formats.push({
      id: "video-hd-nowm",
      label: "MP4 Full HD (Tanpa Watermark)",
      type: "video",
      quality: "Full HD 1080p",
      ext: "mp4",
      fileSize: formatBytes(data.hd_size),
      downloadUrl: data.hdplay,
      isLosslessOriginal: true
    });
  }

  // Standard video without watermark
  if (data.play) {
    formats.push({
      id: "video-sd-nowm",
      label: "MP4 Kualitas Standar (Tanpa Watermark)",
      type: "video",
      quality: "Standard",
      ext: "mp4",
      fileSize: formatBytes(data.size),
      downloadUrl: data.play
    });
  }

  // Audio track
  if (data.music) {
    formats.push({
      id: "audio-original",
      label: "Audio Musik Asli (MP3/M4A)",
      type: "audio",
      quality: "Original Track",
      ext: "mp3",
      downloadUrl: data.music
    });
  }

  // Thumbnail / Cover
  if (data.cover) {
    formats.push({
      id: "image-cover",
      label: "Cover / Thumbnail HD",
      type: "image",
      quality: "Original Cover",
      ext: "jpg",
      downloadUrl: data.cover
    });
  }

  return {
    id: data.id || `tiktok-${Date.now()}`,
    sourceUrl: url,
    platform: "tiktok",
    title: data.title || "Video TikTok",
    author: {
      name: data.author?.nickname || data.author?.unique_id || "Kreator TikTok",
      username: data.author?.unique_id,
      avatarUrl: data.author?.avatar
    },
    duration: data.duration,
    durationLabel: formatSeconds(data.duration),
    thumbnailUrl: data.cover,
    previewVideoUrl: data.play || data.hdplay,
    formats,
    extractedAt: new Date().toISOString()
  };
}

/**
 * Native extractor for Twitter / X
 */
async function extractTwitterNative(url: string): Promise<MediaMetadata> {
  const match = url.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
  if (!match) {
    throw new Error("Format URL Twitter/X tidak valid. Pastikan link mengarah ke tweet/status.");
  }

  const [, username, tweetId] = match;
  const apiUrl = `https://api.vxtwitter.com/${username}/status/${tweetId}`;
  
  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; LinkkuBot/1.0)"
    }
  });

  if (!res.ok) {
    throw new Error(`Gagal membaca status Twitter/X (${res.status}).`);
  }

  const data = await res.json();
  const formats: MediaFormat[] = [];

  const mediaList: Array<{ url: string; type: string }> = data.media_extended || [];
  const videoMedia = mediaList.find((m) => m.type === "video" || m.type === "gif");

  if (videoMedia && videoMedia.url) {
    formats.push({
      id: "twitter-video-best",
      label: "MP4 Video Kualitas Terbaik",
      type: "video",
      quality: "Best Available",
      ext: "mp4",
      downloadUrl: videoMedia.url,
      isLosslessOriginal: true
    });
  } else if (mediaList.length > 0 && mediaList[0].url) {
    formats.push({
      id: "twitter-image-best",
      label: "Gambar Resolusi Penuh",
      type: "image",
      quality: "Full Resolution",
      ext: "jpg",
      downloadUrl: mediaList[0].url
    });
  } else {
    throw new Error("Tweet ini tidak memiliki media video atau foto yang bisa diunduh.");
  }

  return {
    id: `twitter-${tweetId}`,
    sourceUrl: url,
    platform: "twitter",
    title: data.text ? data.text.slice(0, 100) : "Post Twitter/X",
    author: {
      name: data.user_name || username,
      username: `@${data.user_screen_name || username}`
    },
    thumbnailUrl: mediaList[0]?.url,
    previewVideoUrl: videoMedia?.url,
    formats,
    extractedAt: new Date().toISOString()
  };
}

/**
 * Direct video file extraction
 */
async function extractDirectVideo(url: string): Promise<MediaMetadata> {
  let fileSize: string | undefined;
  try {
    const head = await fetch(url, { method: "HEAD" });
    const cl = head.headers.get("content-length");
    if (cl) {
      fileSize = formatBytes(parseInt(cl, 10));
    }
  } catch {
    // Abaikan jika server tujuan menolak HEAD
  }

  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filename = pathname.split("/").pop() || "video.mp4";
  const ext = filename.split(".").pop()?.toLowerCase() || "mp4";

  const formats: MediaFormat[] = [
    {
      id: "direct-stream",
      label: `File ${ext.toUpperCase()} Langsung`,
      type: "video",
      quality: "Original Stream",
      ext,
      fileSize,
      downloadUrl: url,
      isLosslessOriginal: true
    }
  ];

  return {
    id: `direct-${Date.now()}`,
    sourceUrl: url,
    platform: "direct",
    title: filename,
    author: {
      name: urlObj.hostname
    },
    previewVideoUrl: url,
    formats,
    extractedAt: new Date().toISOString()
  };
}

/**
 * Generic extraction using yt-dlp
 */
async function extractWithYtDlp(url: string, platform: PlatformType): Promise<MediaMetadata> {
  const cmd = `yt-dlp --dump-single-json --no-warnings --no-playlist "${url}"`;
  const { stdout } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 });
  const data = JSON.parse(stdout);

  const formats: MediaFormat[] = [];

  // Filter formats for video and audio
  if (Array.isArray(data.formats)) {
    // Prioritaskan video gabungan dengan format ext mp4
    const videos = data.formats
      .filter((f: any) => f.vcodec && f.vcodec !== "none")
      .sort((a: any, b: any) => (b.height || 0) - (a.height || 0));

    // Kualitas terbaik
    if (videos.length > 0) {
      const best = videos[0];
      formats.push({
        id: `ytdlp-${best.format_id || "best"}`,
        label: `MP4 ${best.height ? best.height + "p" : "Resolusi Terbaik"}`,
        type: "video",
        quality: best.format_note || `${best.height}p`,
        resolution: best.resolution || `${best.width}x${best.height}`,
        ext: best.ext || "mp4",
        fileSize: formatBytes(best.filesize || best.filesize_approx),
        downloadUrl: best.url,
        isLosslessOriginal: true
      });
    }

    // Audio terbaik
    const audios = data.formats
      .filter((f: any) => f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none"))
      .sort((a: any, b: any) => (b.abr || 0) - (a.abr || 0));

    if (audios.length > 0) {
      const bestAudio = audios[0];
      formats.push({
        id: `ytdlp-audio-${bestAudio.format_id || "best"}`,
        label: `Audio Asli (${bestAudio.ext || "mp3"})`,
        type: "audio",
        quality: bestAudio.abr ? `${Math.round(bestAudio.abr)} kbps` : "High Quality",
        ext: bestAudio.ext || "mp3",
        fileSize: formatBytes(bestAudio.filesize || bestAudio.filesize_approx),
        downloadUrl: bestAudio.url
      });
    }
  }

  // Fallback jika formats kosong tapi direct url tersedia
  if (formats.length === 0 && data.url) {
    formats.push({
      id: "ytdlp-direct",
      label: "MP4 Kualitas Asli",
      type: "video",
      quality: "Default Source",
      ext: data.ext || "mp4",
      downloadUrl: data.url,
      isLosslessOriginal: true
    });
  }

  return {
    id: data.id || `media-${Date.now()}`,
    sourceUrl: url,
    platform,
    title: data.title || "Media",
    author: {
      name: data.uploader || data.channel || platform,
      username: data.uploader_id ? `@${data.uploader_id}` : undefined
    },
    duration: data.duration,
    durationLabel: formatSeconds(data.duration),
    thumbnailUrl: data.thumbnail,
    previewVideoUrl: formats.find((f) => f.type === "video")?.downloadUrl,
    formats,
    extractedAt: new Date().toISOString()
  };
}

/**
 * Main inspect function: cascades from yt-dlp to specialized native fallback
 */
export async function inspectMediaUrl(rawUrl: string): Promise<MediaMetadata> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error("URL tidak boleh kosong.");
  }

  // Validasi format URL dasar
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Format URL tidak valid. Pastikan diawali dengan https:// atau http://");
  }

  const platform = identifyPlatform(trimmed);
  const sys = await checkSystemCapabilities();

  // Jika yt-dlp tersedia di sistem, gunakan yt-dlp karena paling komprehensif
  if (sys.hasYtDlp) {
    try {
      return await extractWithYtDlp(trimmed, platform);
    } catch (err: any) {
      console.warn("yt-dlp gagal, beralih ke fallback native:", err.message);
    }
  }

  // Fallback native per platform
  if (platform === "tiktok") {
    return await extractTikTokNative(trimmed);
  }

  if (platform === "twitter") {
    return await extractTwitterNative(trimmed);
  }

  if (platform === "direct") {
    return await extractDirectVideo(trimmed);
  }

  // Jika platform lain dan yt-dlp tidak terpasang
  throw new Error(
    `Platform ${platform} membutuhkan mesin yt-dlp di server atau link belum didukung secara langsung.`
  );
}
