import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { projects } from "@/data/projects";
import type { GallerySlot, Project, ProjectImage, ProjectStatus } from "@/types/project";

/** Public projects ordered by sortOrder. Hidden drafts never leave this module. */
export function getVisibleProjects(): Project[] {
  return projects
    .filter((project) => project.visibility === "public")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getVisibleProjects().find((project) => project.slug === slug);
}

/** Neighbours in display order, for previous / next navigation. */
export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const list = getVisibleProjects();
  const index = list.findIndex((project) => project.slug === slug);
  return {
    previous: index > 0 ? list[index - 1] : null,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
  };
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  "in-development": "In Development",
  completed: "Completed",
};

const IMAGE_EXTENSIONS = ["webp", "avif", "png", "jpg", "jpeg"] as const;
const NUMBERED_IMAGE = /^(\d+)\.(webp|avif|png|jpe?g)$/i;

/** Number of empty slots shown while a project has no screenshots yet. */
const DEFAULT_PLACEHOLDER_SLOTS = 3;

export function getProjectImageFolder(project: Project): string {
  return `/images/projects/${project.imageFolder}`;
}

function listFolder(project: Project): string[] {
  const dir = path.join(process.cwd(), "public", getProjectImageFolder(project));
  return existsSync(dir) ? readdirSync(dir) : [];
}

/**
 * Finds public/images/projects/<folder>/cover.<ext> at build time.
 * Returns null while no cover has been added, so the UI shows a placeholder.
 */
export function getProjectCover(project: Project): ProjectImage | null {
  const files = listFolder(project);
  const file = IMAGE_EXTENSIONS.map((ext) => `cover.${ext}`).find((name) =>
    files.includes(name),
  );
  if (!file) return null;

  return {
    src: `${getProjectImageFolder(project)}/${file}`,
    alt: `${project.title} — project cover`,
  };
}

/**
 * Builds the screenshot gallery from the project folder and the optional
 * `screenshots` entries in the data file:
 * - numbered files (01.webp, 02.png, ...) are picked up automatically;
 * - entries add captions / alt text and can reorder files;
 * - entries whose file is missing stay as labelled placeholders;
 * - with nothing at all, a few empty numbered slots mark where images go.
 */
export function getProjectGallery(project: Project): GallerySlot[] {
  const folder = getProjectImageFolder(project);
  const files = listFolder(project);
  const declaredFiles = new Set(project.screenshots.map((shot) => shot.file));

  const numberOf = (file: string) => {
    const match = NUMBERED_IMAGE.exec(file);
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  };

  const declared = project.screenshots.map((shot, index) => ({
    slot: {
      file: shot.file,
      src: `${folder}/${shot.file}`,
      alt: shot.alt,
      caption: shot.caption,
      exists: files.includes(shot.file),
    },
    order: shot.order ?? (Number.isFinite(numberOf(shot.file)) ? numberOf(shot.file) : 1000 + index),
  }));

  const discovered = files
    .filter((file) => NUMBERED_IMAGE.test(file) && !declaredFiles.has(file))
    .map((file) => ({
      slot: {
        file,
        src: `${folder}/${file}`,
        alt: `${project.title} — screenshot ${numberOf(file)}`,
        exists: true,
      },
      order: numberOf(file),
    }));

  const slots = [...declared, ...discovered]
    .sort((a, b) => a.order - b.order || a.slot.file.localeCompare(b.slot.file))
    .map(({ slot }) => slot);

  if (slots.length > 0) return slots;

  return Array.from({ length: DEFAULT_PLACEHOLDER_SLOTS }, (_, index) => {
    const file = `${String(index + 1).padStart(2, "0")}.webp`;
    return {
      file,
      src: `${folder}/${file}`,
      alt: `${project.title} — screenshot ${index + 1}`,
      exists: false,
    };
  });
}
