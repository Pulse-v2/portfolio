import { ArrowUpRight, ChevronDown, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TagList } from "@/components/ui/TagList";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { findOverlaps, formatDuration, formatYearMonth, formatYearMonthShort } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/types/experience";

function hasDetails(entry: ExperienceEntry): boolean {
  return Boolean(entry.contributions?.length || entry.projects?.length);
}

function EntryDates({ entry }: { entry: ExperienceEntry }) {
  return (
    <p className="font-mono text-xs leading-5 text-muted">
      <time dateTime={entry.start} title={formatYearMonth(entry.start)}>
        {formatYearMonthShort(entry.start)}
      </time>
      <span aria-hidden="true"> — </span>
      <span className="sr-only"> to </span>
      <time dateTime={entry.end} title={formatYearMonth(entry.end)}>
        {formatYearMonthShort(entry.end)}
      </time>
      <span className="text-subtle max-md:before:content-['_·_'] md:block">
        {formatDuration(entry.start, entry.end)}
      </span>
    </p>
  );
}

function EntryDetails({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="space-y-7 pt-5">
      {entry.projects && entry.projects.length > 0 && (
        <div className="grid gap-3">
          {entry.projects.map((project, index) => (
            <div key={project.title} className="rounded-md border border-border bg-surface p-5">
              <p className="font-mono text-[0.6875rem] tracking-widest text-subtle uppercase">
                Project {String(index + 1).padStart(2, "0")}
              </p>
              <h4 className="mt-2 font-medium tracking-tight">{project.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.description}</p>
              {project.highlights && (
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {project.technologies && (
                <TagList
                  items={project.technologies}
                  label={`${project.title} technologies`}
                  className="mt-4"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {entry.contributions && entry.contributions.length > 0 && (
        <div>
          <h4 className="font-mono text-xs tracking-widest text-subtle uppercase">
            Contributions
          </h4>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {entry.contributions.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-border-strong" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TimelineEntry({ entry, isLast }: { entry: ExperienceEntry; isLast: boolean }) {
  const overlaps = findOverlaps(entry, experience);
  const showDetails = hasDetails(entry);

  return (
    <li className="relative grid gap-2 pb-12 pl-8 last:pb-0 md:grid-cols-12 md:gap-8 md:pl-0">
      {/* Timeline rail and node */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-2 bottom-0 left-[5px] w-px bg-border md:left-[calc(25%+0.5rem)]",
          isLast && "hidden",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 left-0 size-[11px] rounded-full border-2 bg-background md:left-[calc(25%+0.5rem-5px)]",
          entry.compact ? "border-border-strong" : "border-accent",
        )}
      />

      <div className="md:col-span-3 md:pr-6 md:text-right">
        <EntryDates entry={entry} />
      </div>

      <div className="md:col-span-9 md:pl-8">
        <h3 className="text-lg leading-snug font-semibold tracking-tight">
          {entry.role}
          <span className="font-normal text-muted"> · {entry.company}</span>
        </h3>

        {(entry.engagement || entry.arrangement || overlaps.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.engagement && <Badge variant="accent">{entry.engagement}</Badge>}
            {entry.arrangement && <Badge>{entry.arrangement}</Badge>}
            {overlaps.map((other) => (
              <Badge key={other.id} className="border-dashed">
                In parallel with {other.company}
              </Badge>
            ))}
          </div>
        )}

        {entry.client && (
          <p className="mt-4 text-sm text-muted">
            <span className="text-subtle">Client:</span> {entry.client}
          </p>
        )}
        {entry.summary && (
          <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-muted">{entry.summary}</p>
        )}

        {entry.technologies && (
          <TagList
            items={entry.technologies}
            label={`Technologies at ${entry.company}`}
            className="mt-5"
          />
        )}

        {showDetails && (
          <details className="group/details mt-5 max-w-3xl">
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 rounded-md text-sm font-medium text-foreground transition-colors select-none hover:text-accent [&::-webkit-details-marker]:hidden">
              <span className="group-open/details:hidden">Show details</span>
              <span className="hidden group-open/details:inline">Hide details</span>
              <span className="sr-only"> for {entry.company}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 transition-transform group-open/details:rotate-180"
              />
            </summary>
            <EntryDetails entry={entry} />
          </details>
        )}
      </div>
    </li>
  );
}

interface ExperienceSectionProps {
  cvHref: string | null;
}

export function ExperienceSection({ cvHref }: ExperienceSectionProps) {
  const { linkedin } = profile.socials;

  return (
    <Section id="experience" labelledBy="experience-title">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="experience-title"
          eyebrow="03 / Experience"
          title="Professional experience"
          description="Employment, contract and freelance work, newest first. Engagements that ran in parallel are marked."
        />
        {cvHref ? (
          <a
            href={cvHref}
            download={profile.cv.fileName}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-medium text-foreground hover:text-accent"
          >
            <Download aria-hidden="true" className="size-4" />
            Full CV (PDF)
          </a>
        ) : (
          linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
            >
              Full history on LinkedIn
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        )}
      </div>

      <ol className="mt-14">
        {experience.map((entry, index) => (
          <TimelineEntry key={entry.id} entry={entry} isLast={index === experience.length - 1} />
        ))}
      </ol>
    </Section>
  );
}
