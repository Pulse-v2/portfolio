import { profile } from "@/data/profile";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = `${profile.name} — ${profile.title}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    eyebrow: profile.title,
    title: profile.name,
    description: profile.statement,
    tags: profile.heroTechnologies,
    footer: profile.location,
  });
}
