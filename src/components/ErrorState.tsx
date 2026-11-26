"use client";

import React from "react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ErrorState({ error, onRetry, onReset }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-status-error/30 bg-status-error/5 p-6 transition-colors dark:border-status-error/40 dark:bg-status-error/10"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-error text-white">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-content-primary-light dark:text-content-primary-dark">
            Tidak Dapat Mengambil Media
          </h3>
          <p className="mt-1 text-xs text-content-muted-light dark:text-content-muted-dark">
            {error}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="flex min-h-[44px] items-center justify-center rounded bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-hover"
            >
              Coba Lagi
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex min-h-[44px] items-center justify-center rounded border border-borderline-light bg-surface-light px-4 py-2 text-xs font-medium text-content-primary-light hover:bg-surface-light-subtle dark:border-borderline-dark dark:bg-surface-dark dark:text-content-primary-dark dark:hover:bg-surface-dark-subtle"
            >
              Ganti Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
