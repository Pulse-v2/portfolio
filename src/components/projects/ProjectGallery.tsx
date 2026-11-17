"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";
import type { GallerySlot } from "@/types/project";

interface ProjectGalleryProps {
  slots: GallerySlot[];
  /** Public folder of the project, shown in development as an upload hint. */
  folder: string;
}

const SWIPE_THRESHOLD = 50;

/**
 * Screenshot grid with an accessible lightbox built on the native <dialog>:
 * it is modal (background inert), closes on Escape, and returns focus to the
 * thumbnail that opened it. Arrow keys and swipes move between images.
 */
export function ProjectGallery({ slots, folder }: ProjectGalleryProps) {
  const images = slots.filter((slot) => slot.exists);
  const indexByFile = new Map(images.map((slot, index) => [slot.file, index]));
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef(new Map<number, HTMLButtonElement>());
  const swipeStart = useRef<number | null>(null);
  // Set after a swipe so the click that ends the gesture does not close the viewer.
  const justSwiped = useRef(false);
  const [active, setActive] = useState<number | null>(null);

  const count = images.length;
  const current = active === null ? null : images[active];

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const step = useCallback(
    (delta: number) => {
      setActive((index) => (index === null ? index : (index + delta + count) % count));
    },
    [count],
  );

  // Runs for every way of closing: button, Escape, backdrop click.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onClose() {
      setActive((index) => {
        if (index !== null) triggerRefs.current.get(index)?.focus();
        return null;
      });
    }

    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (count < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  function onPointerDown(event: PointerEvent) {
    swipeStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent) {
    if (swipeStart.current === null || count < 2) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      justSwiped.current = true;
      step(distance < 0 ? 1 : -1);
    }
  }

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {slots.map((slot, position) => {
          const isLead = position === 0;
          const itemClass = cn(isLead && "sm:col-span-2");

          if (!slot.exists) {
            return (
              <li key={slot.file} className={itemClass}>
                <figure>
                  <ImagePlaceholder
                    label={slot.caption ?? `Screenshot ${String(position + 1).padStart(2, "0")}`}
                    expectedPath={`public${folder}/${slot.file}`}
                  />
                </figure>
              </li>
            );
          }

          const index = indexByFile.get(slot.file) ?? 0;

          return (
            <li key={slot.file} className={itemClass}>
              <figure>
                <button
                  type="button"
                  ref={(node) => {
                    if (node) triggerRefs.current.set(index, node);
                    else triggerRefs.current.delete(index);
                  }}
                  onClick={() => open(index)}
                  aria-haspopup="dialog"
                  aria-label={`Open screenshot in full size: ${slot.alt}`}
                  className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-md border border-border bg-surface-raised"
                >
                  <Image
                    src={slot.src}
                    alt={slot.alt}
                    fill
                    sizes={
                      isLead
                        ? "(min-width: 1152px) 1088px, 100vw"
                        : "(min-width: 1152px) 532px, (min-width: 640px) 50vw, 100vw"
                    }
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-md border border-border bg-background/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <Maximize2 className="size-4" />
                  </span>
                </button>
                {slot.caption && (
                  <figcaption className="mt-3 text-sm leading-relaxed text-muted">
                    {slot.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Screenshot viewer"
        onKeyDown={onKeyDown}
        onClick={(event) => {
          // A click on the dialog element itself is a click on the backdrop area.
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-background p-0 text-foreground backdrop:bg-black/70 open:flex open:flex-col"
      >
        {current && (
          <>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p aria-live="polite" className="font-mono text-xs text-muted">
                {active! + 1} / {count}
              </p>
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close viewer" autoFocus>
                <X aria-hidden="true" />
              </Button>
            </div>

            <div
              className="relative min-h-0 flex-1 touch-pan-y px-4 sm:px-16"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onClick={(event) => {
                if (justSwiped.current) {
                  justSwiped.current = false;
                  return;
                }
                if (event.target === event.currentTarget) close();
              }}
            >
              <div className="pointer-events-none relative h-full w-full">
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {count > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => step(-1)}
                    aria-label="Previous screenshot"
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/80 backdrop-blur-sm sm:left-4"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => step(1)}
                    aria-label="Next screenshot"
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/80 backdrop-blur-sm sm:right-4"
                  >
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </>
              )}
            </div>

            <p className="mx-auto max-w-3xl px-4 py-4 text-center text-sm leading-relaxed text-muted sm:px-6">
              {current.caption ?? current.alt}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
