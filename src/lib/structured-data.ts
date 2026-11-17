import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

/** schema.org Person for the site owner. Only verified profile data is used. */
export function getPersonJsonLd() {
  const sameAs = [profile.socials.linkedin, profile.socials.github].filter(
    (url): url is string => Boolean(url),
  );
  const [city, country] = profile.location.split(",").map((part) => part.trim());

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: country,
    },
    knowsAbout: profile.heroTechnologies,
    knowsLanguage: profile.languages.map((language) => language.name),
    alumniOf: profile.education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: profile.name,
    author: { "@id": `${siteUrl}/#person` },
    inLanguage: "en",
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" to prevent injection. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
