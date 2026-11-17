import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border font-mono text-xs leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        /** Technology tags and neutral labels. */
        neutral: "border-border bg-surface text-muted",
        /** Categories and highlighted labels. */
        accent: "border-transparent bg-accent-soft text-accent",
        /** Finished / verified state. */
        success: "border-border bg-surface text-success",
        /** In-development state. */
        warning: "border-border bg-surface text-warning",
      },
      size: {
        sm: "px-2 py-1",
        md: "px-2.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  },
);

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Shows a small status dot before the label. */
    dot?: boolean;
  };

export function Badge({
  className,
  variant,
  size,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
