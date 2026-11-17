import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { createPageMetadata } from "@/lib/metadata";
import { getProjectBySlug, getVisibleProjects } from "@/lib/projects";

/** Every public project is prerendered at build time; unknown slugs return 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return createPageMetadata({
    title: project.subtitle ? `${project.title} — ${project.subtitle}` : project.title,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetails project={project} />;
}
