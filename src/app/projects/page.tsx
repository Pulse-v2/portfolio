import type { Metadata } from "next";
import { ProjectCollections } from "@/components/projects/ProjectCollections";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createPageMetadata } from "@/lib/metadata";
import { getVisibleProjects } from "@/lib/projects";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Personal products and professional work: web applications, business platforms, CRM systems, and interactive WebAR experiences.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading
        as="h1"
        id="projects-title"
        eyebrow="Projects"
        title="All projects"
        description="Personal products, and platforms I have worked on for clients and teams. Open a project for its case study."
      />
      <ProjectCollections projects={getVisibleProjects()} groupHeadingLevel="h2" className="mt-14" />
    </Container>
  );
}
