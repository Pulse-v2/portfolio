import {
  Box,
  Code2,
  Database,
  Layers,
  Palette,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillCategories } from "@/data/skills";
import type { SkillCategoryIcon } from "@/types/skill";

const categoryIcons: Record<SkillCategoryIcon, LucideIcon> = {
  frontend: Code2,
  ui: Palette,
  state: Layers,
  backend: Database,
  graphics: Box,
  tools: Wrench,
};

export function SkillsSection() {
  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeading
        id="skills-title"
        eyebrow="02 / Skills"
        title="Skills & technologies"
        description="Technologies I have used in commercial and personal projects, grouped by area. Listed, not ranked."
      />

      <ul className="mt-14 border-t border-border">
        {skillCategories.map((category) => {
          const Icon = categoryIcons[category.icon];
          return (
            <li
              key={category.id}
              className="grid gap-4 border-b border-border py-6 md:grid-cols-12 md:gap-8 md:py-7"
            >
              <h3 className="flex items-start gap-3 md:col-span-5 lg:col-span-4">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-accent"
                >
                  <Icon className="size-4" />
                </span>
                <span className="pt-1 text-base font-medium tracking-tight">
                  {category.title}
                </span>
              </h3>
              <ul
                aria-label={category.title}
                className="flex flex-wrap content-start gap-2 md:col-span-7 lg:col-span-8 md:pt-0.5"
              >
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <Badge size="md" className="text-[0.8125rem] text-foreground">
                      {skill}
                    </Badge>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
