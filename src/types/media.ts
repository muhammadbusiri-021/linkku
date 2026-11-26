export type PlatformType =
  | "tiktok"
  | "instagram"
  | "twitter"
  | "threads"
  | "pinterest"
  | "direct"
  | "other";

export interface MediaFormat {
  id: string;
  label: string;
  type: "video" | "audio" | "image";
  quality: string;
  resolution?: string;
  ext: string;
  fileSize?: string;
  downloadUrl: string;
  isLosslessOriginal?: boolean;
}

export interface MediaMetadata {
  id: string;
  sourceUrl: string;
  platform: PlatformType;
  title: string;
  author: {
    name: string;
    username?: string;
    avatarUrl?: string;
  };
  duration?: number;
  durationLabel?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  formats: MediaFormat[];
  extractedAt: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  platform: PlatformType;
  thumbnailUrl?: string;
  sourceUrl: string;
  downloadedAt: string;
  lastSelectedFormat?: string;
}

export interface SystemStatus {
  hasYtDlp: boolean;
  hasFfmpeg: boolean;
  environment: "local" | "container" | "serverless";
  uptime: number;
}
