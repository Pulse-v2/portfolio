import { describe, expect, it } from "vitest";
import { experience } from "@/data/experience";
import { findOverlaps, formatDuration, formatYearMonth, formatYearMonthShort } from "@/lib/dates";
import { createPageMetadata } from "@/lib/metadata";
import { getAdjacentProjects, getProjectBySlug, getVisibleProjects } from "@/lib/projects";
import { serializeJsonLd } from "@/lib/structured-data";

describe("dates", () => {
  it("formats year-month values", () => {
    expect(formatYearMonth("2025-05")).toBe("May 2025");
    expect(formatYearMonthShort("2026-11")).toBe("Nov 2026");
  });

  it("formats inclusive durations", () => {
    expect(formatDuration("2025-10", "2026-04")).toBe("7 mos");
    expect(formatDuration("2024-05", "2025-05")).toBe("1 yr 1 mo");
    expect(formatDuration("2018-03", "2020-12")).toBe("2 yrs 10 mos");
    expect(formatDuration("2021-01", "2021-12")).toBe("1 yr");
  });

  it("detects parallel engagements in the real work history", () => {
    const byId = (id: string) => experience.find((e) => e.id === id)!;
    const overlapIds = (id: string) => findOverlaps(byId(id), experience).map((e) => e.id);

    expect(overlapIds("digis")).toEqual(["merge-rocks"]);
    expect(overlapIds("bridgelt")).toEqual(["startup-project"]);
    // A handover in the same month is not an overlap.
    expect(overlapIds("nocode-rebels")).toEqual([]);
    expect(overlapIds("thinkmobiles")).toEqual([]);
  });
});

describe("projects helpers", () => {
  it("returns public projects in sortOrder", () => {
    const orders = getVisibleProjects().map((p) => p.sortOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("finds projects by slug and returns undefined for unknown slugs", () => {
    expect(getProjectBySlug("pulseboard")?.title).toBe("Pulseboard");
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("links neighbours without wrapping around", () => {
    const list = getVisibleProjects();
    const first = getAdjacentProjects(list[0].slug);
    const last = getAdjacentProjects(list.at(-1)!.slug);
    expect(first.previous).toBeNull();
    expect(first.next?.slug).toBe(list[1].slug);
    expect(last.next).toBeNull();
    expect(last.previous?.slug).toBe(list.at(-2)!.slug);
    expect(getAdjacentProjects("does-not-exist")).toEqual({ previous: null, next: null });
  });
});

describe("metadata", () => {
  it("builds canonical, Open Graph and Twitter metadata for a page", () => {
    const meta = createPageMetadata({ title: "Projects", description: "All projects", path: "/projects" });
    expect(meta.title).toBe("Projects");
    expect(meta.alternates?.canonical).toBe("/projects");
    expect(meta.openGraph).toMatchObject({ url: "/projects", description: "All projects" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("escapes < in JSON-LD to prevent script injection", () => {
    const output = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(output).not.toContain("<");
    expect(JSON.parse(output)).toEqual({ name: "</script><script>alert(1)" });
  });
});
