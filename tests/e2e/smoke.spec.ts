import { expect, test, type Page } from "@playwright/test";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 1024;

/** Opens a homepage section through the visible navigation (menu on mobile). */
async function navigateTo(page: Page, label: string) {
  if (isMobile(page)) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: label }).click();
  } else {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label, exact: true }).click();
  }
}

test.describe("smoke", () => {
  test("homepage loads without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()));

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Serhii Demianyk/);
    await expect(page.getByRole("heading", { level: 1, name: "Serhii Demianyk" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Projects" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact Me" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("navigates to the Projects section", async ({ page }) => {
    await page.goto("/");
    await navigateTo(page, "Projects");
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.getByRole("heading", { level: 2, name: "Selected projects" })).toBeInViewport();
  });

  test("opens a project page and moves between projects", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").getByRole("link", { name: "Pulseboard" }).click();
    await expect(page).toHaveURL(/\/projects\/pulseboard$/);
    await expect(page.getByRole("heading", { level: 1, name: "Pulseboard" })).toBeVisible();
    await expect(page.getByText("In Development").first()).toBeVisible();

    await page.getByRole("navigation", { name: "More projects" }).getByRole("link", { name: /AI Agent Workspace/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: "AI Agent Workspace" })).toBeVisible();

    await page.getByRole("link", { name: "All projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { level: 1, name: "All projects" })).toBeVisible();
  });

  test("returns 404 for an unknown project", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });

  test("shows the contact section with working links", async ({ page }) => {
    await page.goto("/");
    await navigateTo(page, "Contact");
    const contact = page.locator("#contact");
    await expect(contact).toBeInViewport();
    await expect(contact.getByRole("link", { name: "Send an email" })).toHaveAttribute(
      "href",
      "mailto:demianik.serhii@gmail.com",
    );
    const linkedin = contact.getByRole("link", { name: /linkedin\.com/ });
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    await expect(contact.getByText("Uzhhorod, Ukraine")).toBeVisible();
  });

  test("keeps the chosen theme after a reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: /dark and light theme/ }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("only links to CV files that exist", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page.locator("a[download]").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    if (hrefs.length === 0) {
      // No CV yet: the file must really be missing, and no button is shown.
      expect((await request.get("/files/cv/Serhii_Demianyk_CV.pdf")).status()).toBe(404);
    }
    for (const href of new Set(hrefs)) {
      const response = await request.get(href!);
      expect(response.status(), href!).toBe(200);
      expect(response.headers()["content-type"]).toContain("pdf");
    }
  });
});

test.describe("mobile menu", () => {
  test.beforeEach(({ page }) => {
    test.skip(!isMobile(page), "Mobile menu is only shown below the desktop breakpoint");
  });

  test("opens, closes with Escape and closes after navigation", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();

    await toggle.click();
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Mobile" });
    for (const label of ["Home", "Projects", "Skills", "Experience", "About", "Contact"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();

    await toggle.click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("has no horizontal overflow", async ({ page }) => {
    for (const path of ["/", "/projects", "/projects/business-applications-data-platforms"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBe(0);
    }
  });
});
