/**
 * Resolves the public site URL without assuming a domain exists:
 * 1. NEXT_PUBLIC_SITE_URL when configured,
 * 2. the Vercel production URL on Vercel deployments,
 * 3. localhost for local development.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl().replace(/\/+$/, "");

/**
 * Only the production deployment may be indexed. Vercel preview deployments
 * (and local builds with VERCEL_ENV=preview) are kept out of search results.
 */
export const isIndexable = process.env.VERCEL_ENV !== "preview";

export const siteLocale = "en_US";
