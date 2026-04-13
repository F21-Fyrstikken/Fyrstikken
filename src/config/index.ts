/**
 * Sanity CMS Configuration
 *
 * These values are safe to commit - they're public project identifiers.
 * Get your project details from: https://www.sanity.io/manage
 */
export const SANITY_CONFIG = {
  projectId: "531mn2v8",
  dataset: "production",
  apiVersion: "2024-01-01",
} as const;

/**
 * Site-wide Configuration
 */
export const SITE_CONFIG = {
  name: "Fyrstikken",
  description: "Award ceremony website for F21 VGS student projects",
  currentYear: new Date().getFullYear(),
  locale: "nb-NO",
  /** Fallback URL used when Astro.site is not configured */
  fallbackUrl: "https://f21-fyrstikken.github.io/Fyrstikken/",
  submissionYear: 2026,
} as const;

/**
 * Theme color palette - references CSS custom properties
 * Used for dynamic category colors
 */
export const THEME_COLORS = [
  { light: "var(--light-safir)", dark: "var(--dark-safir)" },
  { light: "var(--light-akvamarin)", dark: "var(--dark-akvamarin)" },
  { light: "var(--light-amazonitt)", dark: "var(--dark-amazonitt)" },
  { light: "var(--light-smaragd)", dark: "var(--dark-smaragd)" },
  { light: "var(--light-citrin)", dark: "var(--dark-citrin)" },
  { light: "var(--light-spessartin)", dark: "var(--dark-spessartin)" },
  { light: "var(--light-rubin)", dark: "var(--dark-rubin)" },
  { light: "var(--light-thulitt)", dark: "var(--dark-thulitt)" },
  { light: "var(--light-kunzitt)", dark: "var(--dark-kunzitt)" },
  { light: "var(--light-ametyst)", dark: "var(--dark-ametyst)" },
] as const;
