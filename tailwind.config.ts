import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: "#0C0F14",
          light: "#F7F8FA"
        },
        surface: {
          dark: "#131820",
          "dark-subtle": "#181F2A",
          light: "#FFFFFF",
          "light-subtle": "#F1F3F6"
        },
        borderline: {
          dark: "#252C37",
          "dark-subtle": "#1B222C",
          light: "#D8DEE4",
          "light-subtle": "#E5E9EE"
        },
        content: {
          primary: {
            dark: "#E7ECF2",
            light: "#181D24"
          },
          muted: {
            dark: "#94A0B0",
            light: "#556070"
          }
        },
        accent: {
          DEFAULT: "#1D5BD6",
          hover: "#2566E8",
          subtle: "#6EA1FF",
          light: "#1750C2"
        },
        status: {
          success: "#2EA043",
          error: "#F85149"
        }
      },
      fontFamily: {
        sans: ["var(--font-mona-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
