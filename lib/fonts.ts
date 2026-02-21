/**
 * ShalaConnect font configurations
 * Baloo 2 = Headings, Hero, Titles
 * Noto Sans Devanagari = Body, Labels, Forms, Tables
 */

export const fontFamilies = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
  notoDevanagari: "var(--font-noto-devanagari)",
} as const

/** Use font-heading for headings/hero/titles, font-body for body/labels/forms/tables */
export const fontStack = ["var(--font-body)", "sans-serif"] as const
