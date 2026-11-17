import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/projects", "/projects/pulseboard", "/projects/business-applications-data-platforms"];

test.describe("links", () => {
  test.skip(({ isMobile }) => isMobile, "Link targets are the same on every viewport");

  test("every internal link and anchor resolves", async ({ page, request }) => {
    const visited = new Set<string>();
    const queue = ["/"];

    while (queue.length > 0) {
      const path = queue.shift()!;
      if (visited.has(path)) continue;
      visited.add(path);

      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);

      const hrefs = await page.locator("a[href]").evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")!),
      );

      for (const href of new Set(hrefs)) {
        if (/^(https?:|mailto:)/.test(href)) continue;
        const [target, hash] = href.split("#");

        if (hash) {
          // Anchors must exist on the page they point to.
          if (!target || target === path) {
            await expect(page.locator(`[id="${hash}"]`), `${path} -> ${href}`).toHaveCount(1);
          } else if (!visited.has(`${target}#${hash}`)) {
            visited.add(`${target}#${hash}`);
            const html = await (await request.get(target)).text();
            expect(html, `${path} -> ${href}`).toContain(`id="${hash}"`);
          }
        }
        if (target && !visited.has(target) && !queue.includes(target)) {
          if (target.startsWith("/files/")) {
            expect((await request.get(target)).status(), href).toBe(200);
          } else {
            queue.push(target);
          }
        }
      }
    }

    // Home, /projects and all seven project pages were crawled.
    expect([...visited].filter((p) => !p.includes("#")).length).toBeGreaterThanOrEqual(9);
  });

  test("serves the SEO files", async ({ request }) => {
    for (const path of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/opengraph-image"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });
});

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  for (const theme of ["dark", "light"] as const) {
    test(`has no violations in the ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);

      for (const path of PAGES) {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        // Audit the collapsed experience details too.
        await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const summary = results.violations.map(
          (v) => `${path} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
        );
        expect(summary).toEqual([]);
      }
    });
  }

  test("every focusable element shows a visible focus indicator", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard navigation is checked on desktop");
    await page.goto("/");
    let visited = 0;

    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        // Track DOM nodes, not labels: several links can share a label.
        const store = window as unknown as { __focused?: WeakSet<Element> };
        store.__focused ??= new WeakSet();
        if (store.__focused.has(el)) return null;
        store.__focused.add(el);

        const own = getComputedStyle(el);
        const card = el.closest("article");
        return {
          label: `${el.tagName} "${el.textContent?.trim().slice(0, 40)}" ${el.getAttribute("href") ?? ""}`,
          visible:
            (own.outlineStyle !== "none" && parseFloat(own.outlineWidth) > 0) ||
            (card ? getComputedStyle(card).outlineStyle !== "none" : false),
        };
      });
      if (!info) break;
      visited += 1;
      expect(info.visible, info.label).toBe(true);
    }

    expect(visited).toBeGreaterThan(20);
  });
});
