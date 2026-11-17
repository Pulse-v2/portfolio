import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { TagList } from "@/components/ui/TagList";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

export type ProjectCardLayout = "stacked" | "wide";

interface ProjectCardProps {
  project: Project;
  /** "wide" places the image beside the text on large screens. */
  layout?: ProjectCardLayout;
  /** next/image sizes hint matching the card's grid span. */
  imageSizes: string;
  headingLevel?: "h3" | "h4";
  priority?: boolean;
  className?: string;
}

/**
 * The whole card is clickable through the title link's ::after overlay, so
 * there is a single, well-named link per card for keyboard and screen readers.
 */
export function ProjectCard({
  project,
  layout = "stacked",
  imageSizes,
  headingLevel: Heading = "h3",
  priority,
  className,
}: ProjectCardProps) {
  const isWide = layout === "wide";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-200 hover:border-border-strong",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent",
        isWide && "lg:grid lg:grid-cols-12",
        className,
      )}
    >
      <ProjectCover
        project={project}
        sizes={imageSizes}
        priority={priority}
        className={cn(
          "border-b border-border",
          isWide && "lg:col-span-7 lg:aspect-auto lg:min-h-96 lg:border-r lg:border-b-0",
        )}
      />

      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", isWide && "lg:col-span-5 lg:p-9")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-xs tracking-wide text-subtle uppercase">
            {project.projectType}
          </p>
          <ProjectStatusBadge status={project.status} />
        </div>

        <Heading className="mt-4 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
          <Link
            href={`/projects/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </Heading>
        {project.subtitle && (
          <p className="mt-1 text-base text-muted">{project.subtitle}</p>
        )}

        <p className="mt-4 leading-relaxed text-pretty text-muted">
          {project.shortDescription}
        </p>

        <TagList
          items={project.technologies}
          label={`${project.title} technologies`}
          limit={isWide ? 8 : 5}
          className="mt-6"
        />

        <p
          aria-hidden="true"
          className="mt-auto flex items-center gap-1.5 pt-7 text-sm font-medium text-foreground"
        >
          View case study
          <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>
    </article>
  );
}
