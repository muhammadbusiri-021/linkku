# Linkku — Design Direction

## Product Identity
- **Name:** Linkku
- **Sub-label:** Personal Media Fetcher
- **Audience:** Designer and student needing ad-free, zero-redirect, high-fidelity media downloads (TikTok, Instagram, Twitter/X, and direct video links).
- **Style:** Calm Utility Workbench inspired by GitHub's restrained engineering aesthetics. No gradients without purpose, no decorative glassmorphism, no fake status badges or floating cards.

## Antislop Dials
- **ENERGY:** 1 (Calm, tool-first, quiet confidence)
- **RHYTHM:** 2 (Structured command center, balanced between input bar, preview card, and history)
- **MOTION:** 1 (Functional hover and focus states only; no looping animations or floating elements; respects prefers-reduced-motion)

## Typography
- **Headings & UI:** Mona Sans (Open-source modern grotesque sans by GitHub)
- **Data & Metrics:** IBM Plex Mono (for tabular file sizes, durations, bitrates, resolutions, and timestamps)

## Palette (WCAG AA Certified)
- **Dark Mode (Default):**
  - Background Canvas: `#0C0F14` (contrast against primary text: 16.16:1)
  - Surface Panel: `#131820` (border: `1px solid #252C37`)
  - Primary Text: `#E7ECF2`
  - Muted Text: `#94A0B0` (contrast against canvas: 7.23:1)
  - Primary Action Accent: `#1D5BD6` (active / hover: `#2566E8`)
  - Accent Text / Link: `#6EA1FF`
  - Success State: `#2EA043`
  - Error State: `#F85149`
- **Light Mode (Functional Toggle):**
  - Background Canvas: `#F7F8FA`
  - Surface Panel: `#FFFFFF` (border: `1px solid #D8DEE4`)
  - Primary Text: `#181D24`
  - Muted Text: `#556070`
  - Primary Action Accent: `#1750C2`

## Craftsmanship Standard
- **No Em Dashes:** Punctuate with commas, colons, or parentheses.
- **Resilience:** All interactive states must be tested (empty, loading, ready, error, dark, light).
- **Accessible Affordances:** Minimum tap target 44px on mobile, visible focus rings, native `<button>` and `<input>`.
