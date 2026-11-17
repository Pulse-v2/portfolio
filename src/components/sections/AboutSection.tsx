import { GraduationCap, Languages } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

export function AboutSection() {
  const [lead, ...rest] = profile.about;

  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading id="about-title" eyebrow="04 / About" title="About" />
          <div className="mt-8 max-w-2xl space-y-5 leading-relaxed text-pretty">
            <p className="text-xl leading-normal text-foreground sm:text-2xl sm:leading-normal">
              {lead}
            </p>
            {rest.map((paragraph) => (
              <p key={paragraph} className="text-base text-muted sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-10 lg:col-span-5 lg:pt-24">
          <div>
            <h3 className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-subtle uppercase">
              <GraduationCap aria-hidden="true" className="size-4 text-accent" />
              Education
            </h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {profile.education.map((item) => (
                <li key={item.title} className="py-4">
                  <p className="font-medium tracking-tight">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{item.institution}</p>
                  <p className="mt-1.5 font-mono text-xs text-subtle">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-subtle uppercase">
              <Languages aria-hidden="true" className="size-4 text-accent" />
              Languages
            </h3>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {profile.languages.map((language) => (
                <div key={language.name} className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="font-medium tracking-tight">{language.name}</dt>
                  <dd className="text-sm text-muted">{language.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
