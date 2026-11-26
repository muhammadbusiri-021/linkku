"use client";

import React, { useState } from "react";
import type { MediaFormat, MediaMetadata } from "@/types/media";

interface ReadyStateProps {
  metadata: MediaMetadata;
  onDownloadStarted: (format: MediaFormat) => void;
  onReset: () => void;
}

export function ReadyState({ metadata, onDownloadStarted, onReset }: ReadyStateProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownload = (format: MediaFormat) => {
    setDownloadingId(format.id);
    onDownloadStarted(format);

    // Buat nama file yang rapi
    const cleanTitle = metadata.title
      .slice(0, 40)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const filename = `${cleanTitle || "media"}_${format.id}.${format.ext}`;

    // Arahkan ke endpoint proxy download
    const downloadEndpoint = `/api/download?url=${encodeURIComponent(
      format.downloadUrl
    )}&filename=${encodeURIComponent(filename)}`;

    // Trigger unduhan langsung
    const a = document.createElement("a");
    a.href = downloadEndpoint;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadingId(null);
    }, 2000);
  };

  const handleCopyLink = async (format: MediaFormat) => {
    try {
      await navigator.clipboard.writeText(format.downloadUrl);
      setCopiedId(format.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Abaikan jika akses clipboard ditolak
    }
  };

  return (
    <article
      aria-label="Hasil Pemeriksaan Media"
      className="overflow-hidden rounded-lg border border-borderline-light bg-surface-light p-4 transition-colors dark:border-borderline-dark dark:bg-surface-dark sm:p-6"
    >
      <div className="flex items-center justify-between border-b border-borderline-light-subtle pb-4 dark:border-borderline-dark-subtle">
        <div className="flex items-center gap-2">
          <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent dark:bg-accent/20">
            {metadata.platform}
          </span>
          {metadata.durationLabel && (
            <span className="tabular-data text-xs text-content-muted-light dark:text-content-muted-dark">
              Durasi: {metadata.durationLabel}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex min-h-[36px] items-center gap-1 text-xs text-content-muted-light hover:text-content-primary-light dark:text-content-muted-dark dark:hover:text-content-primary-dark"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Ganti Link</span>
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-12">
        {/* Kolom Kiri: Player / Preview Langsung */}
        <div className="space-y-3 md:col-span-5">
          <div className="relative aspect-[9/16] max-h-[460px] w-full overflow-hidden rounded-md bg-black">
            {metadata.previewVideoUrl ? (
              <video
                src={metadata.previewVideoUrl}
                controls
                playsInline
                preload="metadata"
                poster={metadata.thumbnailUrl}
                className="h-full w-full object-contain"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            ) : metadata.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={metadata.thumbnailUrl}
                alt={metadata.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                Pratinjau tidak tersedia
              </div>
            )}
          </div>

          <div>
            <h3 className="line-clamp-2 text-sm font-semibold text-content-primary-light dark:text-content-primary-dark">
              {metadata.title}
            </h3>
            <p className="mt-1 text-xs text-content-muted-light dark:text-content-muted-dark">
              Oleh:{" "}
              <span className="font-medium text-content-primary-light dark:text-content-primary-dark">
                {metadata.author.name}
              </span>
              {metadata.author.username && (
                <span className="ml-1 text-[11px] text-content-muted-light/70 dark:text-content-muted-dark/70">
                  ({metadata.author.username})
                </span>
              )}
            </p>
            <a
              href={metadata.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-accent hover:underline"
            >
              <span>Buka sumber asli</span>
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Format & Download */}
        <div className="space-y-4 md:col-span-7">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted-light dark:text-content-muted-dark">
              Pilihan Format Siap Unduh
            </h4>
            <p className="text-xs text-content-muted-light dark:text-content-muted-dark">
              Pilih kualitas yang diinginkan. File diunduh langsung tanpa watermark dan tanpa iklan.
            </p>
          </div>

          <div className="space-y-2.5">
            {metadata.formats.map((fmt) => (
              <div
                key={fmt.id}
                className="flex flex-col justify-between gap-3 rounded-md border border-borderline-light bg-surface-light p-3.5 transition-colors dark:border-borderline-dark dark:bg-surface-dark-subtle sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-content-primary-light dark:text-content-primary-dark">
                      {fmt.label}
                    </span>
                    {fmt.isLosslessOriginal && (
                      <span className="rounded bg-status-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-status-success">
                        Lossless
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-content-muted-light dark:text-content-muted-dark">
                    <span className="uppercase">{fmt.ext}</span>
                    {fmt.quality && <span>{fmt.quality}</span>}
                    {fmt.fileSize && (
                      <span className="tabular-data font-medium text-content-primary-light dark:text-content-primary-dark">
                        {fmt.fileSize}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(fmt)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-borderline-light p-2 text-content-muted-light hover:bg-surface-light-subtle hover:text-content-primary-light dark:border-borderline-dark dark:text-content-muted-dark dark:hover:bg-surface-dark dark:hover:text-content-primary-dark"
                    title="Salin link download"
                    aria-label="Salin link download"
                  >
                    {copiedId === fmt.id ? (
                      <svg
                        className="h-4 w-4 text-status-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(fmt)}
                    disabled={downloadingId === fmt.id}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50 sm:flex-initial"
                  >
                    {downloadingId === fmt.id ? (
                      <>
                        <svg
                          className="h-3.5 w-3.5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Mengunduh...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span>Unduh Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
