import { exec } from "child_process";
import { promisify } from "util";
import type { SystemStatus } from "@/types/media";

const execAsync = promisify(exec);

let cachedStatus: SystemStatus | null = null;
let lastCheckTime = 0;
const CACHE_TTL_MS = 60000;

export async function checkSystemCapabilities(): Promise<SystemStatus> {
  const now = Date.now();
  if (cachedStatus && now - lastCheckTime < CACHE_TTL_MS) {
    return cachedStatus;
  }

  let hasYtDlp = false;
  let hasFfmpeg = false;

  try {
    const { stdout } = await execAsync("yt-dlp --version");
    if (stdout.trim().length > 0) {
      hasYtDlp = true;
    }
  } catch {
    hasYtDlp = false;
  }

  try {
    const { stdout } = await execAsync("ffmpeg -version");
    if (stdout.includes("ffmpeg version")) {
      hasFfmpeg = true;
    }
  } catch {
    hasFfmpeg = false;
  }

  const isDocker = Boolean(process.env.RENDER || process.env.IS_DOCKER || process.env.CONTAINER);
  const isVercel = Boolean(process.env.VERCEL);

  const environment: SystemStatus["environment"] = isDocker
    ? "container"
    : isVercel
    ? "serverless"
    : "local";

  cachedStatus = {
    hasYtDlp,
    hasFfmpeg,
    environment,
    uptime: process.uptime()
  };
  lastCheckTime = now;

  return cachedStatus;
}
