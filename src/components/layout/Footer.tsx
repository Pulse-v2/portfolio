import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";

const linkClass =
  "inline-flex min-h-6 items-center gap-1.5 text-muted transition-colors hover:text-foreground";

export function Footer() {
  const { linkedin, github } = profile.socials;

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-muted">
            {profile.title} · {profile.location}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${profile.email}`} className={linkClass}>
              Email
            </a>
          </li>
          {linkedin && (
            <li>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          )}
          {github && (
            <li>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          )}
          <li>
            <Link href="#top" className={linkClass}>
              <ArrowUp aria-hidden="true" className="size-4" />
              Back to top
            </Link>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
