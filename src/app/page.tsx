"use client";

import React, { useEffect, useState } from "react";
import type { HistoryItem, MediaFormat, MediaMetadata, SystemStatus } from "@/types/media";
import { Header } from "@/components/Header";
import { CommandBar } from "@/components/CommandBar";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { ReadyState } from "@/components/ReadyState";
import { ErrorState } from "@/components/ErrorState";
import { HistoryModal } from "@/components/HistoryModal";

const STORAGE_KEY_HISTORY = "linkku_history_v1";
const STORAGE_KEY_THEME = "linkku_theme_v1";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"empty" | "loading" | "ready" | "error">("empty");
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Inisialisasi tema dan riwayat dari localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Abaikan jika localStorage dibatasi browser
    }

    // Ambil status kemampuan sistem
    fetch("/api/system")
      .then((res) => res.json())
      .then((data: SystemStatus) => setSystemStatus(data))
      .catch(() => {});
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem(STORAGE_KEY_THEME, "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(STORAGE_KEY_THEME, "light");
      }
      return next;
    });
  };

  const handleInspect = async (targetUrl?: string) => {
    const urlToInspect = targetUrl || url;
    if (!urlToInspect.trim()) return;

    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToInspect.trim() })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal membaca link media.");
      }

      setMetadata(json.data);
      setStatus("ready");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses URL.");
      setStatus("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInspect();
  };

  const handleDownloadStarted = (format: MediaFormat) => {
    if (!metadata) return;

    const newItem: HistoryItem = {
      id: `${metadata.id}-${Date.now()}`,
      title: metadata.title,
      platform: metadata.platform,
      thumbnailUrl: metadata.thumbnailUrl,
      sourceUrl: metadata.sourceUrl,
      downloadedAt: new Date().toISOString(),
      lastSelectedFormat: format.label
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((item) => item.sourceUrl !== metadata.sourceUrl)].slice(
        0,
        30
      );
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleReset = () => {
    setUrl("");
    setMetadata(null);
    setErrorMsg(null);
    setStatus("empty");
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setUrl(item.sourceUrl);
    handleInspect(item.sourceUrl);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      <main className="mx-auto w-full max-w-4xl min-w-0 flex-1 px-4 py-6 sm:px-6">
        <div className="space-y-6">
          {/* Main Input Control Bar */}
          <CommandBar
            url={url}
            onChangeUrl={setUrl}
            onSubmit={handleSubmit}
            isLoading={status === "loading"}
          />

          {/* Dynamic Interactive Views */}
          {status === "empty" && (
            <EmptyState
              onSelectSample={(sample) => {
                setUrl(sample);
                handleInspect(sample);
              }}
              history={history}
              onSelectHistory={handleSelectHistory}
            />
          )}

          {status === "loading" && <LoadingState />}

          {status === "ready" && metadata && (
            <ReadyState
              metadata={metadata}
              onDownloadStarted={handleDownloadStarted}
              onReset={handleReset}
            />
          )}

          {status === "error" && errorMsg && (
            <ErrorState
              error={errorMsg}
              onRetry={() => handleInspect()}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-borderline-light py-4 text-center text-xs text-content-muted-light transition-colors dark:border-borderline-dark dark:text-content-muted-dark">
        <p>Linkku: Personal Media Fetcher. Bebas iklan dan tanpa tracker pelacak.</p>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />
    </div>
  );
}
