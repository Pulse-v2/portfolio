import type { ComponentProps } from "react";
import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/data/profile";

type DownloadCvButtonProps = Omit<
  ComponentProps<typeof ButtonLink>,
  "href" | "download" | "children"
> & {
  /** Result of getCvHref(); the button renders nothing while the PDF is missing. */
  href: string | null;
  label?: string;
};

export function DownloadCvButton({
  href,
  label = "Download CV",
  ...props
}: DownloadCvButtonProps) {
  if (!href) return null;

  return (
    <ButtonLink href={href} download={profile.cv.fileName} {...props}>
      <Download aria-hidden="true" />
      {label}
    </ButtonLink>
  );
}
