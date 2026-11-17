import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectNavigationProps {
  previous: Project | null;
  next: Project | null;
}

function NavCard({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  const Icon = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/projects/${project.slug}`}
      rel={isNext ? "next" : "prev"}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong sm:p-7",
        isNext && "sm:items-end sm:text-right",
      )}
    >
      <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
        {!isNext && <Icon aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />}
        {isNext ? "Next project" : "Previous project"}
        {isNext && <Icon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />}
      </span>
      <span className="text-lg font-semibold tracking-tight text-balance">{project.title}</span>
      <span className="text-sm text-muted">{project.projectType}</span>
    </Link>
  );
}

export function ProjectNavigation({ previous, next }: ProjectNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
      <div>{previous && <NavCard project={previous} direction="previous" />}</div>
      <div className={cn(!previous && "sm:col-start-2")}>
        {next && <NavCard project={next} direction="next" />}
      </div>
    </nav>
  );
}
