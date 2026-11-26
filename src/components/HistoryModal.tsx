"use client";

import React, { useEffect } from "react";
import type { HistoryItem } from "@/types/media";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear
}: HistoryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        className="relative w-full max-w-lg rounded-lg border border-borderline-light bg-surface-light p-6 shadow-2xl transition-colors dark:border-borderline-dark dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-borderline-light-subtle pb-3 dark:border-borderline-dark-subtle">
          <div>
            <h3
              id="history-dialog-title"
              className="text-sm font-semibold text-content-primary-light dark:text-content-primary-dark"
            >
              Riwayat Unduhan
            </h3>
            <p className="text-xs text-content-muted-light dark:text-content-muted-dark">
              Tersimpan di browser lokal perangkat ini.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded p-1 text-content-muted-light hover:text-content-primary-light dark:text-content-muted-dark dark:hover:text-content-primary-dark"
            aria-label="Tutup riwayat"
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
        </div>

        <div className="mt-4 max-h-80 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <p className="py-8 text-center text-xs text-content-muted-light dark:text-content-muted-dark">
              Belum ada riwayat unduhan di perangkat ini.
            </p>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-md border border-borderline-light bg-surface-light p-3 text-left transition-colors hover:border-accent hover:bg-surface-light-subtle dark:border-borderline-dark dark:bg-surface-dark-subtle dark:hover:border-accent dark:hover:bg-surface-dark"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-accent/10 text-xs font-bold uppercase text-accent dark:bg-accent/20">
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
                <span className="shrink-0 text-[11px] text-content-muted-light/70 dark:text-content-muted-dark/70">
                  Periksa
                </span>
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-4 flex justify-end border-t border-borderline-light-subtle pt-3 dark:border-borderline-dark-subtle">
            <button
              type="button"
              onClick={onClear}
              className="flex min-h-[44px] items-center justify-center rounded px-3 py-1.5 text-xs text-status-error hover:bg-status-error/10"
            >
              Hapus Semua Riwayat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
