import { ProjectCard, type ProjectCardLayout } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

/**
 * Column spans (of 12, from lg) repeat in this rhythm so neighbouring rows
 * mirror each other instead of forming a uniform grid.
 */
const RHYTHM = [7, 5, 5, 7] as const;

const spanClasses: Record<number, string> = {
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  12: "lg:col-span-12",
};

const sizesBySpan: Record<number, string> = {
  5: "(min-width: 1024px) 470px, (min-width: 768px) 50vw, 100vw",
  6: "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw",
  7: "(min-width: 1024px) 660px, (min-width: 768px) 50vw, 100vw",
  12: "(min-width: 1024px) 660px, 100vw",
};

interface GridItem {
  project: Project;
  span: number;
  layout: ProjectCardLayout;
}

function arrange(projects: Project[], variant: "even" | "rhythm"): GridItem[] {
  return projects.map((project, index) => {
    const isLastAlone =
      index === projects.length - 1 &&
      (variant === "even" ? projects.length % 2 === 1 : index % 2 === 0);

    if (isLastAlone) return { project, span: 12, layout: "wide" };
    const span = variant === "even" ? 6 : RHYTHM[index % RHYTHM.length];
    return { project, span, layout: "stacked" };
  });
}

interface ProjectGridProps {
  projects: Project[];
  /** "even" for featured pairs, "rhythm" for an alternating 7/5 layout. */
  variant?: "even" | "rhythm";
  headingLevel?: "h3" | "h4";
  prioritizeFirst?: boolean;
  className?: string;
}

export function ProjectGrid({
  projects,
  variant = "rhythm",
  headingLevel,
  prioritizeFirst = false,
  className,
}: ProjectGridProps) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6", className)}>
      {arrange(projects, variant).map(({ project, span, layout }, index) => (
        <li
          key={project.slug}
          className={cn("flex", spanClasses[span], span === 12 && "md:col-span-2")}
        >
          <ProjectCard
            project={project}
            layout={layout}
            imageSizes={sizesBySpan[span]}
            headingLevel={headingLevel}
            priority={prioritizeFirst && index === 0}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
}
