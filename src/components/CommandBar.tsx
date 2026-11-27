"use client";

import React, { useRef } from "react";

interface CommandBarProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function CommandBar({
  url,
  onChangeUrl,
  onSubmit,
  isLoading,
}: CommandBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeUrl(text.trim());
        inputRef.current?.focus();
      }
    } catch {
      // Jika browser memblokir clipboard API, fokuskan saja input
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    onChangeUrl("");
    inputRef.current?.focus();
  };

  return (
    <section aria-label="Input Link Media" className="w-full">
      <form onSubmit={onSubmit} className="relative w-full">
        <label htmlFor="media-url" className="sr-only">
          URL video TikTok, Instagram, Twitter/X, atau link video langsung
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="media-url"
              type="url"
              required
              value={url}
              onChange={(e) => onChangeUrl(e.target.value)}
              placeholder="Tempel link: TikTok, Instagram, Twitter/X, atau video langsung.."
              disabled={isLoading}
              className="w-full rounded-md border border-borderline-light bg-surface-light px-4 py-3 pr-20 text-sm text-content-primary-light placeholder:text-content-muted-light/70 focus:border-accent focus:outline-none dark:border-borderline-dark dark:bg-surface-dark dark:text-content-primary-dark dark:placeholder:text-content-muted-dark/70 sm:py-2.5"
            />

            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {url.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded p-1 text-content-muted-light hover:text-content-primary-light dark:text-content-muted-dark dark:hover:text-content-primary-dark"
                  aria-label="Hapus teks link"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={isLoading}
                  className="flex min-h-[36px] items-center gap-1 rounded bg-surface-light-subtle px-2 py-1 text-xs text-content-muted-light hover:text-content-primary-light dark:bg-surface-dark-subtle dark:text-content-muted-dark dark:hover:text-content-primary-dark"
                  aria-label="Tempel link dari clipboard"
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>Tempel</span>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
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
                <span>Memeriksa...</span>
              </>
            ) : (
              <>
                <span>Periksa Link</span>
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
