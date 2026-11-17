import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { experience } from "@/data/experience";
import { navigation } from "@/data/navigation";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

/**
 * Content integrity: catches broken links, missing folders and claims the
 * content rules forbid (for example planned features on a completed project).
 */
describe("projects data", () => {
  it("has unique, URL-safe slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has an image folder in /public for every project", () => {
    for (const project of projects) {
      const dir = path.join(process.cwd(), "public", "images", "projects", project.imageFolder);
      expect(existsSync(dir), `${project.slug}: missing ${dir}`).toBe(true);
    }
  });

  it("only uses absolute https demo and source links, never empty ones", () => {
    for (const project of projects) {
      for (const url of [project.demoUrl, project.githubUrl]) {
        if (url === undefined) continue;
        expect(url, project.slug).toMatch(/^https:\/\/\S+$/);
      }
    }
  });

  it("never marks features of a completed project as planned", () => {
    for (const project of projects) {
      if (project.status === "completed") {
        expect(project.features.some((f) => f.planned), project.slug).toBe(false);
      }
    }
  });

  it("gives every project with planned features an in-development status", () => {
    for (const project of projects) {
      if (project.features.some((f) => f.planned)) {
        expect(project.status, project.slug).toBe("in-development");
      }
    }
  });

  it("has unique sort orders and alt text for declared screenshots", () => {
    const orders = projects.map((p) => p.sortOrder);
    expect(new Set(orders).size).toBe(orders.length);
    for (const project of projects) {
      for (const shot of project.screenshots) expect(shot.alt.trim(), shot.file).not.toBe("");
    }
  });
});

describe("experience data", () => {
  it("has unique ids and valid, ordered date ranges", () => {
    const ids = experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of experience) {
      expect(entry.start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      expect(entry.end).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      expect(entry.start <= entry.end, entry.id).toBe(true);
    }
  });

  it("is listed newest first (by end date)", () => {
    const ends = experience.map((e) => e.end);
    expect([...ends].sort().reverse()).toEqual(ends);
  });

  it("keeps compact entries free of invented details", () => {
    for (const entry of experience.filter((e) => e.compact)) {
      expect(entry.summary).toBeUndefined();
      expect(entry.contributions).toBeUndefined();
      expect(entry.projects).toBeUndefined();
    }
  });
});

describe("profile, skills and navigation", () => {
  it("has a valid email and https social links (or none)", () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    for (const url of Object.values(profile.socials)) {
      if (url !== null) expect(url).toMatch(/^https:\/\/\S+$/);
    }
  });

  it("points the CV at a PDF in /files/cv", () => {
    expect(profile.cv.path).toMatch(/^\/files\/cv\/[^/]+\.pdf$/);
    expect(profile.cv.fileName).toMatch(/\.pdf$/);
  });

  it("has unique skill categories without duplicates inside them", () => {
    const ids = skillCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const category of skillCategories) {
      expect(new Set(category.skills).size).toBe(category.skills.length);
    }
  });

  it("uses root-relative navigation links", () => {
    for (const item of navigation) expect(item.href).toMatch(/^\/(#[a-z-]+)?$/);
  });
});
