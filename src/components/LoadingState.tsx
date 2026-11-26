"use client";

import React from "react";

export function LoadingState() {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="rounded-lg border border-borderline-light bg-surface-light p-6 transition-colors dark:border-borderline-dark dark:bg-surface-dark"
    >
      <div className="flex items-center gap-3">
        <svg
          className="h-5 w-5 animate-spin text-accent"
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
        <div>
          <h3 className="text-sm font-semibold text-content-primary-light dark:text-content-primary-dark">
            Mengambil Data Media...
          </h3>
          <p className="text-xs text-content-muted-light dark:text-content-muted-dark">
            Menghubungkan ke server sumber untuk mengekstrak stream video kualitas asli tanpa watermark.
          </p>
        </div>
      </div>

      {/* Reserved Skeleton Shape to prevent layout shift */}
      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <div className="h-64 rounded-md bg-surface-light-subtle dark:bg-surface-dark-subtle md:col-span-5" />
        <div className="space-y-4 md:col-span-7">
          <div className="h-5 w-3/4 rounded bg-surface-light-subtle dark:bg-surface-dark-subtle" />
          <div className="h-4 w-1/3 rounded bg-surface-light-subtle dark:bg-surface-dark-subtle" />
          <div className="space-y-2 pt-2">
            <div className="h-12 w-full rounded bg-surface-light-subtle dark:bg-surface-dark-subtle" />
            <div className="h-12 w-full rounded bg-surface-light-subtle dark:bg-surface-dark-subtle" />
            <div className="h-12 w-full rounded bg-surface-light-subtle dark:bg-surface-dark-subtle" />
          </div>
        </div>
      </div>
    </div>
  );
}
