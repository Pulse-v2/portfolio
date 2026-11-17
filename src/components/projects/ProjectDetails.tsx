import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectNavigation } from "@/components/projects/ProjectNavigation";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TagList } from "@/components/ui/TagList";
import {
  getAdjacentProjects,
  getProjectCover,
  getProjectGallery,
  getProjectImageFolder,
  projectStatusLabels,
} from "@/lib/projects";
import type { Project } from "@/types/project";

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-border pt-8 pb-12 first:border-t-0 first:pt-0">
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 leading-relaxed text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-border-strong" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ExternalButtons({ project, className }: { project: Project; className?: string }) {
  if (!project.demoUrl && !project.githubUrl) return null;

  return (
    <div className={className}>
      {project.demoUrl && (
        <ButtonLink href={project.demoUrl} external className="w-full">
          Live demo
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </ButtonLink>
      )}
      {project.githubUrl && (
        <ButtonLink href={project.githubUrl} variant="secondary" external className="w-full">
          Source code
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </ButtonLink>
      )}
    </div>
  );
}

function AtAGlance({ project }: { project: Project }) {
  const facts = [
    { term: "Category", value: project.category },
    { term: "Type", value: project.projectType },
    project.status && { term: "Status", value: projectStatusLabels[project.status] },
    project.organization && { term: "Organization", value: project.organization },
    project.period && { term: "Period", value: project.period },
    { term: "Role", value: project.role },
  ].filter((fact): fact is { term: string; value: string } => Boolean(fact));

  return (
    <aside
      aria-labelledby="glance-title"
      className="rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]"
    >
      <h2 id="glance-title" className="font-mono text-xs tracking-widest text-subtle uppercase">
        At a glance
      </h2>
      <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
        {facts.map((fact) => (
          <div key={fact.term} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3">
            <dt className="text-subtle">{fact.term}</dt>
            <dd className="text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm text-subtle">Technology stack</p>
      <TagList items={project.technologies} label="Technology stack" className="mt-2.5" />
      <ExternalButtons project={project} className="mt-6 grid gap-2" />
    </aside>
  );
}

export function ProjectDetails({ project }: { project: Project }) {
  const cover = getProjectCover(project);
  const gallery = getProjectGallery(project);
  const { previous, next } = getAdjacentProjects(project.slug);
  const plannedOnly = project.features.length > 0 && project.features.every((f) => f.planned);
  const hasPlanned = project.features.some((f) => f.planned);

  return (
    <article>
      {/* Header */}
      <Container className="pt-8 pb-12 sm:pt-12 sm:pb-16">
        <ButtonLink href="/projects" variant="ghost" size="sm" className="-ml-3.5">
          <ArrowLeft aria-hidden="true" />
          All projects
        </ButtonLink>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{project.category}</Badge>
          <ProjectStatusBadge status={project.status} />
        </div>

        <h1 className="mt-6 max-w-4xl text-display font-semibold text-balance">{project.title}</h1>
        {project.subtitle && <p className="mt-3 text-xl text-muted sm:text-2xl">{project.subtitle}</p>}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted">
          {project.shortDescription}
        </p>
      </Container>

      {cover && (
        <Container>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface-raised">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              priority
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Container>
      )}

      {/* Body */}
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-14">
        <div className="lg:order-last lg:col-span-4">
          <AtAGlance project={project} />
        </div>

        <div className="max-w-2xl lg:col-span-8">
          {project.overview !== project.shortDescription && (
            <Block id="overview" title="Overview">
              <p className="text-lg leading-relaxed text-pretty">{project.overview}</p>
            </Block>
          )}

          {project.context && (
            <Block id="context" title="Context">
              <p className="leading-relaxed text-pretty text-muted">{project.context}</p>
            </Block>
          )}

          {project.responsibilities.length > 0 && (
            <Block id="contributions" title="Responsibilities & contributions">
              <BulletList items={project.responsibilities} />
            </Block>
          )}

          {project.examples && project.examples.length > 0 && (
            <Block id="products" title="Products">
              <p className="mb-5 leading-relaxed text-muted">
                Separate products; the work described is my development contribution to each.
              </p>
              <ol className="grid gap-3">
                {project.examples.map((example, index) => (
                  <li key={example.title} className="rounded-md border border-border bg-surface p-5">
                    <p className="font-mono text-[0.6875rem] tracking-widest text-subtle uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-medium tracking-tight">{example.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{example.description}</p>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {project.features.length > 0 && (
            <Block id="features" title={plannedOnly ? "Planned features" : "Key features"}>
              {hasPlanned && (
                <p className="mb-5 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
                  <span className="font-medium text-warning">In development.</span>{" "}
                  {plannedOnly
                    ? "The capabilities below are planned and not yet available."
                    : "Items marked “Planned” are not yet available."}
                </p>
              )}
              <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature.label} className="flex gap-3 leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-border-strong" />
                    <span>
                      {feature.label}
                      {feature.planned && !plannedOnly && (
                        <span className="ml-2 font-mono text-xs text-warning">Planned</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {project.architecture && project.architecture.length > 0 && (
            <Block id="architecture" title="Architecture">
              <BulletList items={project.architecture} />
            </Block>
          )}

          {project.challenges && project.challenges.length > 0 && (
            <Block id="challenges" title="Challenges & solutions">
              <div className="space-y-4">
                {project.challenges.map((item) => (
                  <div key={item.challenge} className="rounded-md border border-border bg-surface p-5">
                    <h3 className="font-medium tracking-tight">{item.challenge}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.solution}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <Block id="outcome" title="Outcome">
              <BulletList items={project.outcomes} />
            </Block>
          )}
        </div>
      </Container>

      {/* Screenshots */}
      <section aria-labelledby="screenshots-title" className="border-t border-border">
        <Container className="py-14 sm:py-20">
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 id="screenshots-title" className="text-2xl font-semibold tracking-tight">
              Screenshots
            </h2>
            {gallery.every((slot) => !slot.exists) && (
              <p className="text-sm text-muted">Screenshots will be added soon.</p>
            )}
          </div>
          <ProjectGallery slots={gallery} folder={getProjectImageFolder(project)} />
        </Container>
      </section>

      <Container className="pb-20 sm:pb-24">
        <ProjectNavigation previous={previous} next={next} />
      </Container>
    </article>
  );
}
