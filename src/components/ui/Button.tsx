import type { ComponentProps } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:bg-foreground/85",
        secondary:
          "border border-border-strong text-foreground hover:border-foreground/40 hover:bg-surface-raised",
        ghost: "text-muted hover:bg-surface-raised hover:text-foreground",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonVariantProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = Omit<ComponentProps<"a">, "href"> &
  ButtonVariantProps & {
    href: string;
    /** Opens in a new tab with safe rel attributes. */
    external?: boolean;
  };

/**
 * Link styled as a button. Internal routes use next/link; external URLs,
 * mailto links and file downloads render a plain anchor.
 */
export function ButtonLink({
  className,
  variant,
  size,
  href,
  external = false,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const isInternalRoute =
    href.startsWith("/") && !external && props.download === undefined;

  if (isInternalRoute) {
    return <Link href={href} className={classes} {...props} />;
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
