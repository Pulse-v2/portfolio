import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/types/project";

// The asset helpers read the filesystem at build time; fake the folder contents.
const files = vi.hoisted(() => ({ list: [] as string[] }));

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  const fake = {
    ...actual,
    existsSync: (p: string) => {
      const name = String(p).replace(/\\/g, "/").split("/").pop()!;
      // Folders always exist; files exist when listed.
      return name.includes(".") ? files.list.includes(name) : true;
    },
    readdirSync: () => files.list,
  };
  return { ...fake, default: fake };
});

const { getProjectCover, getProjectGallery } = await import("@/lib/projects");
const { getCvHref } = await import("@/lib/cv");

const project = {
  slug: "demo",
  title: "Demo",
  imageFolder: "demo",
  screenshots: [] as Project["screenshots"],
} as Project;

beforeEach(() => {
  files.list = [];
});

describe("project cover", () => {
  it("is null until a cover file exists", () => {
    expect(getProjectCover(project)).toBeNull();
  });

  it("picks up cover.webp from the project folder", () => {
    files.list = ["cover.webp", "01.webp"];
    expect(getProjectCover(project)).toEqual({
      src: "/images/projects/demo/cover.webp",
      alt: "Demo — project cover",
    });
  });
});

describe("project gallery", () => {
  it("shows three numbered placeholder slots when there are no screenshots", () => {
    const slots = getProjectGallery(project);
    expect(slots.map((s) => [s.file, s.exists])).toEqual([
      ["01.webp", false],
      ["02.webp", false],
      ["03.webp", false],
    ]);
  });

  it("discovers numbered files in number order and ignores other files", () => {
    files.list = ["cover.webp", "10.webp", "02.png", "01.webp", "notes.txt", "draft.png"];
    const slots = getProjectGallery(project);
    expect(slots.map((s) => s.file)).toEqual(["01.webp", "02.png", "10.webp"]);
    expect(slots.every((s) => s.exists)).toBe(true);
    expect(slots[0].alt).toBe("Demo — screenshot 1");
  });

  it("applies captions from data and keeps declared-but-missing files as placeholders", () => {
    files.list = ["01.webp", "02.webp"];
    const slots = getProjectGallery({
      ...project,
      screenshots: [
        { file: "02.webp", alt: "Event list", caption: "Filtering events", order: 0 },
        { file: "05.webp", alt: "Settings", caption: "Planned screenshot" },
      ],
    });
    expect(slots.map((s) => [s.file, s.exists, s.caption])).toEqual([
      ["02.webp", true, "Filtering events"],
      ["01.webp", true, undefined],
      ["05.webp", false, "Planned screenshot"],
    ]);
  });
});

describe("CV link", () => {
  it("is hidden while the PDF is missing", () => {
    expect(getCvHref()).toBeNull();
  });

  it("points to the PDF once it exists", () => {
    files.list = ["Serhii_Demianyk_CV.pdf"];
    expect(getCvHref()).toBe("/files/cv/Serhii_Demianyk_CV.pdf");
  });
});
