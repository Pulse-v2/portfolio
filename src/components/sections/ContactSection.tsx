import { ArrowUpRight, Mail, MapPin, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";
import { profile } from "@/data/profile";

interface ContactRow {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  icon?: LucideIcon;
}

/** Shows "linkedin.com/in/name" instead of the full https URL. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

interface ContactSectionProps {
  cvHref: string | null;
}

export function ContactSection({ cvHref }: ContactSectionProps) {
  const { linkedin, github } = profile.socials;

  const rows: ContactRow[] = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    ...(linkedin
      ? [{ label: "LinkedIn", value: displayUrl(linkedin), href: linkedin, external: true }]
      : []),
    ...(github
      ? [{ label: "GitHub", value: displayUrl(github), href: github, external: true }]
      : []),
    { label: "Location", value: profile.location, icon: MapPin },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-border bg-surface">
      <Container className="grid gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10 lg:py-32">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">05 / Contact</p>
          <h2 id="contact-title" className="sr-only">
            Contact
          </h2>
          <p className="mt-5 max-w-xl font-serif text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.05] tracking-tight text-balance italic">
            {profile.contactMessage}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${profile.email}`} size="lg">
              <Mail aria-hidden="true" />
              Send an email
            </ButtonLink>
            <DownloadCvButton href={cvHref} variant="secondary" size="lg" />
          </div>
        </div>

        <dl className="self-end divide-y divide-border border-y border-border lg:col-span-5">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[6rem_1fr] items-baseline gap-4 py-4">
              <dt className="font-mono text-xs tracking-wide text-subtle uppercase">{row.label}</dt>
              <dd className="min-w-0">
                {row.href ? (
                  <a
                    href={row.href}
                    {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex min-h-6 max-w-full items-center gap-1.5 wrap-anywhere text-foreground transition-colors hover:text-accent"
                  >
                    {row.value}
                    {row.external && (
                      <>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 shrink-0 text-subtle transition-colors group-hover:text-accent"
                        />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </>
                    )}
                  </a>
                ) : (
                  <span className="text-foreground">{row.value}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
