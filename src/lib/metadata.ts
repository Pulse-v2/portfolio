import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { siteLocale } from "@/lib/site";

export const siteName = `${profile.name} — ${profile.title}`;

interface PageMetadataInput {
  /** Page title; the root layout template appends the site owner's name. */
  title?: string;
  description: string;
  /** Path of the page, e.g. "/projects/pulseboard". Used for the canonical URL. */
  path: string;
  type?: "website" | "article" | "profile";
}

/**
 * Consistent metadata for a page: canonical URL, Open Graph and Twitter card.
 * Relative URLs resolve against metadataBase (the configured site URL).
 * Social images come from the nearest opengraph-image file.
 */
export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataInput): Metadata {
  const socialTitle = title ? `${title} — ${profile.name}` : siteName;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName,
      locale: siteLocale,
      title: socialTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
