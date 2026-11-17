import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  /** Id of the heading that names this section. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

/** Top-level homepage section: anchor target, landmark and vertical rhythm. */
export function Section({ id, labelledBy, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("border-t border-border", className)}
    >
      <Container className="py-20 sm:py-24 lg:py-28">{children}</Container>
    </section>
  );
}
