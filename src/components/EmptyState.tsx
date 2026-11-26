"use client";

import React from "react";
import type { HistoryItem } from "@/types/media";

interface EmptyStateProps {
  onSelectSample: (sampleUrl: string) => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

export function EmptyState({ onSelectSample, history, onSelectHistory }: EmptyStateProps) {
  return (
    <div className="space-y-8 py-4">
      {/* Intro Box */}
      <div className="rounded-lg border border-borderline-light bg-surface-light p-6 transition-colors dark:border-borderline-dark dark:bg-surface-dark">
        <h2 className="text-base font-semibold text-content-primary-light dark:text-content-primary-dark">
          Pengunduh Media Bersih untuk Desainer
        </h2>
        <p className="mt-1 text-sm text-content-muted-light dark:text-content-muted-dark">
          Tempel tautan video dari TikTok, Instagram, Twitter/X, atau link video langsung. Sistem
          akan mengambil stream resolusi asli tanpa iklan perantara dan tanpa verifikasi berulang.
        </p>

        {/* Supported Platforms Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded border border-borderline-light-subtle bg-surface-light-subtle p-3 dark:border-borderline-dark-subtle dark:bg-surface-dark-subtle">
            <span className="block text-xs font-semibold text-content-primary-light dark:text-content-primary-dark">
              TikTok
            </span>
            <span className="mt-0.5 block text-xs text-content-muted-light dark:text-content-muted-dark">
              MP4 HD No-Watermark & Audio MP3
            </span>
          </div>

          <div className="rounded border border-borderline-light-subtle bg-surface-light-subtle p-3 dark:border-borderline-dark-subtle dark:bg-surface-dark-subtle">
            <span className="block text-xs font-semibold text-content-primary-light dark:text-content-primary-dark">
              Instagram
            </span>
            <span className="mt-0.5 block text-xs text-content-muted-light dark:text-content-muted-dark">
              Reels & Video Post Asli
            </span>
          </div>

          <div className="rounded border border-borderline-light-subtle bg-surface-light-subtle p-3 dark:border-borderline-dark-subtle dark:bg-surface-dark-subtle">
            <span className="block text-xs font-semibold text-content-primary-light dark:text-content-primary-dark">
              Twitter / X
            </span>
            <span className="mt-0.5 block text-xs text-content-muted-light dark:text-content-muted-dark">
              Bitrate Tertinggi & Foto Resolusi Penuh
            </span>
          </div>

          <div className="rounded border border-borderline-light-subtle bg-surface-light-subtle p-3 dark:border-borderline-dark-subtle dark:bg-surface-dark-subtle">
            <span className="block text-xs font-semibold text-content-primary-light dark:text-content-primary-dark">
              Direct Video
            </span>
            <span className="mt-0.5 block text-xs text-content-muted-light dark:text-content-muted-dark">
              File MP4, WebM, MOV langsung
            </span>
          </div>
        </div>
      </div>

      {/* Recent History Preview (jika sudah pernah unduh) */}
      {history.length > 0 && (
        <section aria-labelledby="recent-downloads-title" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              id="recent-downloads-title"
              className="text-xs font-semibold uppercase tracking-wider text-content-muted-light dark:text-content-muted-dark"
            >
              Unduhan Terakhir
            </h3>
            <span className="text-xs text-content-muted-light dark:text-content-muted-dark">
              Tersimpan lokal di browsermu
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {history.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectHistory(item)}
                className="flex items-center gap-3 rounded-md border border-borderline-light bg-surface-light p-3 text-left transition-colors hover:border-accent hover:bg-surface-light-subtle dark:border-borderline-dark dark:bg-surface-dark dark:hover:border-accent dark:hover:bg-surface-dark-subtle"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-surface-light-subtle text-xs font-bold uppercase text-accent dark:bg-surface-dark-subtle">
                  {item.platform.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-content-primary-light dark:text-content-primary-dark">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-content-muted-light dark:text-content-muted-dark">
                    {item.sourceUrl}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
