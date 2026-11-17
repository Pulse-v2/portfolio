import { profile } from "@/data/profile";
import { getProjectBySlug, getVisibleProjects, projectStatusLabels } from "@/lib/projects";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Project card with the project title, category, and technologies";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getVisibleProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return renderOgCard({
      eyebrow: "Projects",
      title: profile.name,
      description: profile.statement,
      tags: [],
      footer: profile.title,
    });
  }

  return renderOgCard({
    eyebrow: project.category,
    status: project.status ? projectStatusLabels[project.status] : undefined,
    title: project.title,
    description: project.subtitle ?? project.shortDescription,
    tags: project.technologies,
    footer: profile.name,
  });
}
