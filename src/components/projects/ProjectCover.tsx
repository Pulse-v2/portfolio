import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { getProjectCover, getProjectImageFolder } from "@/lib/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCoverProps {
  project: Project;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * 16:10 cover slot. Shows public/images/projects/<folder>/cover.* when it
 * exists, otherwise a clearly labelled placeholder of the same size.
 */
export function ProjectCover({ project, sizes, priority = false, className }: ProjectCoverProps) {
  const cover = getProjectCover(project);

  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-surface-raised", className)}>
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015]"
        />
      ) : (
        <ImagePlaceholder
          label={`${project.title} — preview coming soon`}
          expectedPath={`public${getProjectImageFolder(project)}/cover.webp`}
          className="h-full rounded-none border-0"
        />
      )}
    </div>
  );
}
