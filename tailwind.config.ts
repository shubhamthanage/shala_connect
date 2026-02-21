import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "var(--font-noto-devanagari)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        /* ShalaConnect design tokens */
        saffron: "#F46A0A",
        "saffron-bright": "#FF7B1C",
        "saffron-pale": "#FFF3E8",
        gold: "#F59E0B",
        "gold-light": "#FCD34D",
        "green-school": "#15803D",
        "green-mid": "#16A34A",
        "green-bright": "#22C55E",
        "green-pale": "#F0FDF4",
        sky: "#0EA5E9",
        "cream-2": "#F8F4EE",
        navy: "#050F1E",
        "navy-2": "#091627",
        "navy-3": "#0D1F38",
        "slate-school": "#132A47",
        "slate-2": "#1A3A5C",
        cream: "#FDFAF5",
        "text-700": "#243347",
        "text-900": "#060E1C",
        "text-500": "#4A6380",
        "text-300": "#8AAABF",
        "border-school": "#E5EEF6",
        /* Shadcn/ui */
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
