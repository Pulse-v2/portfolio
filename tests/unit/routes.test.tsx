import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import ProjectPage, { generateMetadata, generateStaticParams } from "@/app/projects/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { navigation } from "@/data/navigation";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { getProjectBySlug, getVisibleProjects } from "@/lib/projects";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) }) as PageProps<"/projects/[slug]">;

describe("dynamic project routes", () => {
  it("prerenders a page for every public project", () => {
    expect(generateStaticParams()).toEqual(getVisibleProjects().map((p) => ({ slug: p.slug })));
  });

  it("renders a project page", async () => {
    render(await ProjectPage(params("interactive-webar-learning-platform")));
    expect(screen.getByRole("heading", { level: 1, name: "Interactive WebAR Learning Platform" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Key features" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "More projects" })).toBeInTheDocument();
  });

  it("labels planned functionality instead of presenting it as finished", () => {
    const base = getProjectBySlug("pulseboard")!;
    const allPlanned = { ...base, features: [{ label: "Alerts", planned: true }, { label: "Exports", planned: true }] };
    const { unmount } = render(<ProjectDetails project={allPlanned} />);
    expect(screen.getByRole("heading", { name: "Planned features" })).toBeInTheDocument();
    expect(screen.getByText(/planned and not yet available/)).toBeInTheDocument();
    unmount();

    const mixed = { ...base, features: [{ label: "Dashboard" }, { label: "Alerts", planned: true }] };
    render(<ProjectDetails project={mixed} />);
    expect(screen.getByRole("heading", { name: "Key features" })).toBeInTheDocument();
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });

  it("shows architecture for projects that document it", async () => {
    render(await ProjectPage(params("pulseboard")));
    expect(screen.getByRole("heading", { name: "Key features" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Architecture" })).toBeInTheDocument();
  });

  it("shows no demo or source buttons when the URLs are missing", async () => {
    render(await ProjectPage(params("pulseboard")));
    expect(screen.queryByRole("link", { name: /Live demo/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Source code/ })).not.toBeInTheDocument();
  });

  it("responds with not-found for an unknown slug", async () => {
    await expect(ProjectPage(params("does-not-exist"))).rejects.toMatchObject({
      digest: expect.stringContaining("404"),
    });
  });

  it("builds metadata for known slugs and none for unknown ones", async () => {
    const meta = await generateMetadata(params("pulseboard"));
    expect(meta.title).toBe("Pulseboard — Real-time Analytics Dashboard");
    expect(meta.alternates?.canonical).toBe("/projects/pulseboard");
    expect(await generateMetadata(params("nope"))).toEqual({});
  });
});

describe("home page", () => {
  it("has a target for every in-page navigation link", () => {
    const { container } = render(<HomePage />);
    for (const item of navigation.filter((n) => n.href.includes("#"))) {
      const id = item.href.split("#")[1];
      expect(container.querySelector(`#${id}`), item.href).not.toBeNull();
    }
  });

  it("links every project card to its page", () => {
    render(<HomePage />);
    for (const project of getVisibleProjects()) {
      expect(screen.getByRole("link", { name: project.title })).toHaveAttribute("href", `/projects/${project.slug}`);
    }
  });

  it("gives every interactive element an accessible name (axe)", async () => {
    const { container } = render(<HomePage />);
    const result = await axe.run(container, {
      runOnly: ["button-name", "link-name", "image-alt", "aria-allowed-attr", "aria-valid-attr-value", "duplicate-id-aria", "list", "listitem"],
    });
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(", ")}`)).toEqual([]);
  });
});

describe("sitemap and robots", () => {
  it("lists the home page, the projects page and every public project", () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(urls).toEqual(["/", "/projects", ...getVisibleProjects().map((p) => `/projects/${p.slug}`)]);
  });

  it("allows indexing outside preview deployments", () => {
    expect(robots().rules).toMatchObject({ allow: "/" });
  });
});
