import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linkku: Personal Media Fetcher",
  description: "Web pengunduh media pribadi tanpa iklan, tanpa verifikasi berbelit, menjaga kualitas asli video dan audio.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231D5BD6'><path d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/></svg>"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C0F14"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-canvas-light text-content-primary-light antialiased transition-colors duration-150 dark:bg-canvas-dark dark:text-content-primary-dark">
        {children}
      </body>
    </html>
  );
}
