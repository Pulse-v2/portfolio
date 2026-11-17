import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navigation } from "@/data/navigation";
import { profile } from "@/data/profile";
import { getCvHref } from "@/lib/cv";
import { getProjectBySlug, getProjectCover } from "@/lib/projects";

const pulseboard = getProjectBySlug("pulseboard")!;
const retailCrm = getProjectBySlug("retail-management-crm")!;

describe("Header navigation", () => {
  it("renders every navigation item with its configured href", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const item of navigation) {
      expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
    }
  });

  it("links the logo to the home page", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /Serhii Demianyk.*home/ })).toHaveAttribute("href", "/");
  });

  it("renders the Download CV link only when the PDF exists", () => {
    render(<Header />);
    const link = screen.queryByRole("link", { name: /Download CV/ });
    const cvHref = getCvHref();
    if (cvHref) {
      expect(link).toHaveAttribute("href", cvHref);
      expect(link).toHaveAttribute("download", profile.cv.fileName);
    } else {
      expect(link).not.toBeInTheDocument();
    }
  });
});

describe("MobileNavigation", () => {
  const setup = (cvHref: string | null = null) => {
    const user = userEvent.setup();
    render(<MobileNavigation items={navigation} cvHref={cvHref} cvFileName="cv.pdf" />);
    return { user, toggle: screen.getByRole("button", { name: "Open menu" }) };
  };

  it("starts collapsed and expands on click", async () => {
    const { user, toggle } = setup();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Close menu");
    const menu = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(menu).getAllByRole("link")).toHaveLength(navigation.length);
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes after a link is chosen", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "Contact" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("offers the CV download only when a CV exists", async () => {
    const { user, toggle } = setup("/files/cv/cv.pdf");
    await user.click(toggle);
    expect(screen.getByRole("link", { name: /Download CV/ })).toHaveAttribute("download", "cv.pdf");
  });
});

describe("ThemeToggle", () => {
  it("switches the theme and remembers the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /dark and light theme/ });
    expect(document.documentElement.dataset.theme).toBe("dark");

    await user.click(button);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");

    await user.click(button);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("restores a stored theme on mount", () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("DownloadCvButton", () => {
  it("renders nothing without a CV", () => {
    const { container } = render(<DownloadCvButton href={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a download link with the configured file name", () => {
    render(<DownloadCvButton href={profile.cv.path} />);
    const link = screen.getByRole("link", { name: "Download CV" });
    expect(link).toHaveAttribute("href", profile.cv.path);
    expect(link).toHaveAttribute("download", profile.cv.fileName);
  });
});

describe("ProjectCard", () => {
  it("links the title to the project page", () => {
    render(<ProjectCard project={pulseboard} imageSizes="100vw" />);
    expect(screen.getByRole("heading", { level: 3, name: "Pulseboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pulseboard" })).toHaveAttribute("href", "/projects/pulseboard");
  });

  it("shows the status of in-development projects", () => {
    render(<ProjectCard project={pulseboard} imageSizes="100vw" />);
    expect(screen.getByText("In Development")).toBeInTheDocument();
  });

  it("shows no status for projects without one", () => {
    render(<ProjectCard project={retailCrm} imageSizes="100vw" />);
    expect(screen.queryByText("In Development")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });

  it("limits technology tags and summarises the rest", () => {
    render(<ProjectCard project={pulseboard} imageSizes="100vw" />);
    const tags = screen.getByRole("list", { name: "Pulseboard technologies" });
    const hidden = pulseboard.technologies.length - 5;
    expect(within(tags).getAllByRole("listitem")).toHaveLength(6);
    expect(within(tags).getByText(`+${hidden}`)).toBeInTheDocument();
  });

  it("shows the real cover when one exists, and a labelled placeholder otherwise", () => {
    for (const project of [pulseboard, retailCrm]) {
      const { unmount } = render(<ProjectCard project={project} imageSizes="100vw" />);
      if (getProjectCover(project)) {
        expect(screen.getByRole("img", { name: `${project.title} — project cover` })).toBeInTheDocument();
      } else {
        expect(screen.getByRole("img", { name: new RegExp(`Placeholder: ${project.title}`) })).toBeInTheDocument();
      }
      unmount();
    }
  });
});

describe("ContactSection", () => {
  it("uses a mailto link for the email address", () => {
    render(<ContactSection cvHref={null} />);
    for (const link of screen.getAllByRole("link", { name: /demianik\.serhii@gmail\.com|Send an email/ })) {
      expect(link).toHaveAttribute("href", `mailto:${profile.email}`);
    }
  });

  it("opens LinkedIn safely in a new tab", () => {
    render(<ContactSection cvHref={null} />);
    const linkedin = screen.getByRole("link", { name: /linkedin\.com/ });
    expect(linkedin).toHaveAttribute("href", profile.socials.linkedin);
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("hides GitHub while no URL is configured", () => {
    render(<ContactSection cvHref={null} />);
    expect(profile.socials.github).toBeNull();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });

  it("shows the location and the closing message", () => {
    render(<ContactSection cvHref={null} />);
    expect(screen.getByText(profile.location)).toBeInTheDocument();
    expect(screen.getByText(profile.contactMessage)).toBeInTheDocument();
  });
});

describe("ExperienceSection", () => {
  it("marks parallel engagements on both sides", () => {
    render(<ExperienceSection cvHref={null} />);
    expect(screen.getByText("In parallel with Merge Rocks")).toBeInTheDocument();
    expect(screen.getByText("In parallel with Digis")).toBeInTheDocument();
    expect(screen.getByText("In parallel with BridgeLT")).toBeInTheDocument();
  });

  it("keeps the two freelance products and their stacks separate", () => {
    render(<ExperienceSection cvHref={null} />);
    const pwa = screen.getByRole("list", { name: /Progressive web application for pet owners technologies/ });
    const crm = screen.getByRole("list", { name: /CRM application for a retail business technologies/ });
    expect(within(pwa).queryByText("Angular")).not.toBeInTheDocument();
    expect(within(crm).getByText("Angular")).toBeInTheDocument();
  });

  it("falls back to LinkedIn for the full history when there is no CV", () => {
    render(<ExperienceSection cvHref={null} />);
    expect(screen.getByRole("link", { name: /Full history on LinkedIn/ })).toHaveAttribute(
      "href",
      profile.socials.linkedin,
    );
  });
});
