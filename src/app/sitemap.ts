import type { MetadataRoute } from "next";
import { getVisibleProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const projects: MetadataRoute.Sitemap = getVisibleProjects().map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: project.featured ? 0.7 : 0.6,
  }));

  return [...pages, ...projects];
}
