import { ProjectCollections } from "@/components/projects/ProjectCollections";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getVisibleProjects } from "@/lib/projects";

export function ProjectsSection() {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        id="projects-title"
        eyebrow="01 / Projects"
        title="Selected projects"
        description="Personal products, and platforms I have worked on for clients and teams."
      />
      <ProjectCollections projects={getVisibleProjects()} className="mt-14" />
    </Section>
  );
}
