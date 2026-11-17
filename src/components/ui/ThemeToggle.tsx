"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  // The inline script in the root layout applies the theme before paint.
  // React Strict Mode resets <html> attributes on its dev remount, so the
  // stored value is re-applied here. In production this is a no-op.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = readStoredTheme() ?? DEFAULT_THEME;
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";

    // Switch instantly: without this, elements with colour transitions
    // (cards, buttons) fade through mixed colours for a moment.
    const freeze = document.createElement("style");
    freeze.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(freeze);
    document.documentElement.dataset.theme = next;
    void getComputedStyle(document.body).backgroundColor; // apply styles now
    requestAnimationFrame(() => freeze.remove());

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the theme still switches for this visit.
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Switch between dark and light theme"
      title="Switch theme"
      className={className}
    >
      {/* Both icons render; CSS shows the one for the target theme, so the
          markup is identical on server and client. */}
      <Sun aria-hidden="true" className="hidden dark:block" />
      <Moon aria-hidden="true" className="block dark:hidden" />
    </Button>
  );
}
