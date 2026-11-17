import Link from "next/link";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Container } from "@/components/ui/Container";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navigation } from "@/data/navigation";
import { profile } from "@/data/profile";
import { getCvHref } from "@/lib/cv";

export function Header() {
  const cvHref = getCvHref();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <Container className="flex h-(--header-height) items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-sm border border-border-strong font-mono text-xs font-medium tracking-tight text-foreground transition-colors group-hover:border-accent group-hover:text-accent"
          >
            {profile.initials}
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {profile.name}
            <span className="sr-only"> (home)</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <DownloadCvButton
            href={cvHref}
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
          />
          <MobileNavigation
            items={navigation}
            cvHref={cvHref}
            cvFileName={profile.cv.fileName}
          />
        </div>
      </Container>
    </header>
  );
}
