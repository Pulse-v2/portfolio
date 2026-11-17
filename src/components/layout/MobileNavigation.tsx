"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/profile";

interface MobileNavigationProps {
  items: NavigationItem[];
  cvHref: string | null;
  cvFileName: string;
}

/**
 * Collapsible menu for viewports below the lg breakpoint. Implemented as a
 * disclosure (button + panel) rather than a modal: content behind it stays
 * reachable, so no focus trap is needed.
 */
export function MobileNavigation({
  items,
  cvHref,
  cvFileName,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    // Close when the viewport grows into the desktop layout.
    const desktop = window.matchMedia("(min-width: 64rem)");
    function onBreakpoint(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="lg:hidden">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-b border-border bg-background shadow-lg shadow-black/10"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center text-base text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {cvHref && (
            <a
              href={cvHref}
              download={cvFileName}
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "secondary", size: "md" }),
                "mt-4 w-full sm:hidden",
              )}
            >
              <Download aria-hidden="true" />
              Download CV
            </a>
          )}
        </nav>
      </div>
    </div>
  );
}
