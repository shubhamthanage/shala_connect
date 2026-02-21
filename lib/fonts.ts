/**
 * ShalaConnect font configurations
 * Fonts loaded via @import in app/globals.css
 */

export const fontFamilies = {
  notoDevanagari: "var(--font-noto-devanagari)",
  plusJakarta: "var(--font-plus-jakarta)",
} as const

/** Default font stack (matches design.html) */
export const fontStack = [
  "var(--font-plus-jakarta)",
  "var(--font-noto-devanagari)",
  "sans-serif",
] as const
