import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCollectionsProps {
  projects: Project[];
  /** Heading level of the group titles; cards use the next level down. */
  groupHeadingLevel?: "h2" | "h3";
  className?: string;
}

/** Personal projects first, then professional work, each in its own grid. */
export function ProjectCollections({
  projects,
  groupHeadingLevel = "h3",
  className,
}: ProjectCollectionsProps) {
  const GroupHeading = groupHeadingLevel;
  const cardHeading = groupHeadingLevel === "h2" ? "h3" : "h4";

  const groups = [
    {
      id: "projects-personal",
      title: "Personal projects",
      note: "Status shown on each project",
      items: projects.filter((project) => project.featured),
      variant: "even" as const,
    },
    {
      id: "projects-professional",
      title: "Professional work",
      note: "Client details kept confidential",
      items: projects.filter((project) => !project.featured),
      variant: "rhythm" as const,
    },
  ].filter((group) => group.items.length > 0);

  return (
    <div className={cn("space-y-16", className)}>
      {groups.map((group) => (
        <div key={group.id} role="group" aria-labelledby={group.id}>
          <div className="mb-6 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <GroupHeading id={group.id} className="text-lg font-semibold tracking-tight">
              {group.title}
            </GroupHeading>
            <p className="text-sm text-muted">{group.note}</p>
          </div>
          <ProjectGrid projects={group.items} variant={group.variant} headingLevel={cardHeading} />
        </div>
      ))}
    </div>
  );
}
