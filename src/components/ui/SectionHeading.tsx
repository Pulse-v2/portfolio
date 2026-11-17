import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Id placed on the heading so the section can use aria-labelledby. */
  id: string;
  /** Short mono label above the title, e.g. "02 / Projects". */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <Heading id={id} className="text-headline font-semibold text-balance">
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
