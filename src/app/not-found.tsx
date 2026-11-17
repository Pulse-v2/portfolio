import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start py-28 sm:py-40">
      <p className="font-mono text-xs tracking-widest text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 text-headline font-semibold">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <ButtonLink href="/" variant="secondary" className="mt-8">
        <ArrowLeft aria-hidden="true" />
        Back to home
      </ButtonLink>
    </Container>
  );
}
