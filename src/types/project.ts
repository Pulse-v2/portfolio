export type ProjectCategory = "Personal Project" | "Professional Experience";

/** Only set when it is accurate. Professional work usually has no status. */
export type ProjectStatus = "in-development" | "completed";

/** hidden projects are excluded from every list, route and the sitemap. */
export type ProjectVisibility = "public" | "hidden";

export interface ProjectFeature {
  label: string;
  /** true marks a planned capability that is not implemented yet. */
  planned?: boolean;
}

/** A resolved image ready to render. */
export interface ProjectImage {
  /** Public path, e.g. "/images/projects/pulseboard/01.webp". */
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Optional description of a screenshot file in the project's image folder.
 * Files named 01.webp, 02.png, ... are picked up even without an entry here;
 * add one to give the file a caption, better alt text or a custom position.
 */
export interface ProjectScreenshot {
  /** File name inside the project folder, e.g. "01.webp". */
  file: string;
  alt: string;
  caption?: string;
  /** Lower numbers come first. Defaults to the number in the file name. */
  order?: number;
}

/** A gallery slot: a real file, or a placeholder for a declared/expected one. */
export interface GallerySlot extends ProjectImage {
  file: string;
  exists: boolean;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

/** A self-contained sub-project, used when one engagement covers several products. */
export interface ProjectExample {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  /** Free-form type label, e.g. "Web application", "WebAR platform". */
  projectType: string;
  status?: ProjectStatus;
  featured: boolean;
  shortDescription: string;
  overview: string;
  /** Company or engagement the work belongs to. */
  organization?: string;
  /** Human-readable period, e.g. "May 2025 — November 2026". */
  period?: string;
  /** Where/how the work happened. */
  context?: string;
  role: string;
  responsibilities: string[];
  features: ProjectFeature[];
  examples?: ProjectExample[];
  technologies: string[];
  /**
   * Folder under /public/images/projects. Drop cover.webp (or .png/.jpg)
   * there and it is picked up automatically.
   */
  imageFolder: string;
  screenshots: ProjectScreenshot[];
  architecture?: string[];
  challenges?: ProjectChallenge[];
  outcomes?: string[];
  demoUrl?: string;
  githubUrl?: string;
  visibility: ProjectVisibility;
  sortOrder: number;
}
