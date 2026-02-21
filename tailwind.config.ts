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
      screens: {
        xs: "375px",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        sora: ["var(--font-sans)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        r4: "var(--r4)",
        r8: "var(--r8)",
        r12: "var(--r12)",
        r16: "var(--r16)",
        r20: "var(--r20)",
        r24: "var(--r24)",
        r32: "var(--r32)",
        pill: "var(--rpill)",
      },
      boxShadow: {
        xs: "var(--sh-xs)",
        "sh-sm": "var(--sh-sm)",
        "sh-md": "var(--sh-md)",
        "sh-lg": "var(--sh-lg)",
        "sh-xl": "var(--sh-xl)",
        "saffron-glow": "0 4px 16px var(--saffron-glow)",
        "saffron-hover": "0 8px 28px rgba(244, 106, 10, 0.45)",
        "focus-ring": "0 0 0 3px rgba(244, 106, 10, 0.25)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "count-up": "count-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
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
        "border-2": "#D0E2F0",
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
