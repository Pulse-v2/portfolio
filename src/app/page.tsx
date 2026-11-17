import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import { getCvHref } from "@/lib/cv";
import { createPageMetadata } from "@/lib/metadata";
import { getPersonJsonLd, getWebSiteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  description: profile.summary,
  path: "/",
  type: "profile",
});

export default function HomePage() {
  const cvHref = getCvHref();

  return (
    <>
      <JsonLd data={[getPersonJsonLd(), getWebSiteJsonLd()]} />
      <HeroSection cvHref={cvHref} />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection cvHref={cvHref} />
      <AboutSection />
      <ContactSection cvHref={cvHref} />
    </>
  );
}
