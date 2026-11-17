import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const aspectClasses = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
} as const;

interface ImagePlaceholderProps {
  /** What will be shown here, e.g. "Pulseboard cover". */
  label: string;
  /**
   * Where the real file should be saved, e.g. "public/images/projects/pulseboard/cover.webp".
   * Shown in development only, as a hint for adding the image.
   */
  expectedPath?: string;
  aspect?: keyof typeof aspectClasses;
  className?: string;
}

/**
 * Clearly identified slot for an image that has not been provided yet.
 * It reserves the final aspect ratio (no layout shift once the real image
 * lands) and never pretends to be a real screenshot.
 */
export function ImagePlaceholder({
  label,
  expectedPath,
  aspect = "16/10",
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}. Image not yet available.`}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-md border border-dashed border-border-strong bg-surface p-4 text-center",
        "bg-[repeating-linear-gradient(135deg,transparent_0_14px,var(--surface-raised)_14px_15px)]",
        aspectClasses[aspect],
        className,
      )}
    >
      <ImageIcon aria-hidden="true" className="size-6 text-subtle" />
      <div className="space-y-1.5">
        <p className="font-mono text-[0.6875rem] tracking-widest text-subtle uppercase">
          Image placeholder
        </p>
        <p className="text-sm font-medium text-muted">{label}</p>
        {expectedPath && process.env.NODE_ENV === "development" && (
          <p className="font-mono text-xs break-all text-subtle">
            {expectedPath}
          </p>
        )}
      </div>
    </div>
  );
}
