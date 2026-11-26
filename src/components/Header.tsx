"use client";

import React from "react";
import type { SystemStatus } from "@/types/media";

interface HeaderProps {
  systemStatus: SystemStatus | null;
  historyCount: number;
  onOpenHistory: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({
  systemStatus,
  historyCount,
  onOpenHistory,
  isDark,
  onToggleTheme
}: HeaderProps) {
  return (
    <header className="border-b border-borderline-light bg-surface-light px-4 py-3 transition-colors dark:border-borderline-dark dark:bg-surface-dark sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Brand Wordmark (Opsi B: Tipografi Bersih) */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-content-primary-light dark:text-content-primary-dark">
            Linkku
          </span>
          <span className="hidden text-xs text-content-muted-light dark:text-content-muted-dark sm:inline">
            Personal Media Fetcher
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Engine Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-md border border-borderline-light-subtle bg-surface-light-subtle px-2.5 py-1 text-xs text-content-muted-light dark:border-borderline-dark-subtle dark:bg-surface-dark-subtle dark:text-content-muted-dark"
            title={
              systemStatus?.hasYtDlp
                ? "Mesin yt-dlp aktif di server"
                : "Mesin native fetcher aktif"
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                systemStatus?.hasYtDlp ? "bg-status-success" : "bg-accent"
              }`}
              aria-hidden="true"
            />
            <span className="tabular-data">
              {systemStatus?.hasYtDlp ? "Engine: yt-dlp" : "Engine: Native"}
            </span>
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-md border border-borderline-light px-3 py-1.5 text-xs font-medium text-content-primary-light hover:bg-surface-light-subtle dark:border-borderline-dark dark:text-content-primary-dark dark:hover:bg-surface-dark-subtle"
            aria-label={`Riwayat unduhan, ${historyCount} item tersimpan`}
          >
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="tabular-data rounded bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-borderline-light p-2 text-content-primary-light hover:bg-surface-light-subtle dark:border-borderline-dark dark:text-content-primary-dark dark:hover:bg-surface-dark-subtle"
            aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
          >
            {isDark ? (
              // Sun icon
              <svg
                className="h-4 w-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon
              <svg
                className="h-4 w-4 text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
