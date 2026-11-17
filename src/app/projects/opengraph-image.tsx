import { profile } from "@/data/profile";
import { getVisibleProjects } from "@/lib/projects";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = `Projects by ${profile.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  const projects = getVisibleProjects();
  const technologies = [...new Set(projects.flatMap((project) => project.technologies))];

  return renderOgCard({
    eyebrow: "Projects",
    title: `Projects by ${profile.name}`,
    description:
      "Personal products and professional work: web applications, business platforms, CRM systems, and interactive WebAR experiences.",
    tags: technologies,
    footer: profile.title,
  });
}
