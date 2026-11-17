import { ArrowDown, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";
import { TagList } from "@/components/ui/TagList";
import { profile } from "@/data/profile";

interface HeroSectionProps {
  cvHref: string | null;
}

export function HeroSection({ cvHref }: HeroSectionProps) {
  const facts = [
    { term: "Experience", value: profile.experienceLabel },
    {
      term: "Languages",
      value: profile.languages.map((l) => `${l.name} (${l.level})`).join(", "),
    },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Faint engineering grid, faded out toward the edges. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-40 mask-[radial-gradient(ellipse_70%_60%_at_30%_40%,black,transparent)]"
      />

      <Container className="relative grid gap-14 py-16 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-10 lg:py-32">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">
              {profile.title}
            </p>
            {profile.availability.visible && (
              <Badge variant="success" dot>
                {profile.availability.label}
              </Badge>
            )}
          </div>

          <h1 id="hero-title" className="mt-6 text-display font-semibold">
            {profile.name}
          </h1>

          <p className="mt-7 max-w-2xl text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl">
            {profile.statement}
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {profile.supporting}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/#projects" size="lg">
              View Projects
              <ArrowDown aria-hidden="true" />
            </ButtonLink>
            <DownloadCvButton href={cvHref} variant="secondary" size="lg" />
            <ButtonLink href="/#contact" variant="secondary" size="lg">
              Contact Me
            </ButtonLink>
          </div>
        </div>

        <aside
          aria-label="Profile summary"
          className="rounded-lg border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-7 lg:col-span-5 lg:max-w-md lg:justify-self-end"
        >
          <p className="flex items-center gap-2 text-sm text-muted">
            <MapPin aria-hidden="true" className="size-4 text-accent" />
            {profile.location}
          </p>

          <dl className="mt-6 divide-y divide-border border-y border-border">
            {facts.map((fact) => (
              <div key={fact.term} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-sm">
                <dt className="font-mono text-xs leading-5 tracking-wide text-subtle uppercase">
                  {fact.term}
                </dt>
                <dd className="text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 font-mono text-xs tracking-wide text-subtle uppercase">
            Selected stack
          </p>
          <TagList
            items={profile.heroTechnologies}
            label="Selected technologies"
            size="md"
            className="mt-3"
          />
        </aside>
      </Container>
    </section>
  );
}
