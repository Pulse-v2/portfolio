import { existsSync } from "node:fs";
import path from "node:path";
import { profile } from "@/data/profile";

/**
 * Returns the public CV path only when the PDF really exists in /public,
 * so the site never links to a missing file. Server-only (build time).
 */
export function getCvHref(): string | null {
  const absolute = path.join(process.cwd(), "public", profile.cv.path);
  return existsSync(absolute) ? profile.cv.path : null;
}
