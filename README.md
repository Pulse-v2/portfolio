# Serhii Demianyk — Portfolio

Personal developer portfolio. Statically generated, content-driven, no backend.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Lucide icons · pnpm

## Getting started

Requires Node.js 22.12+ and pnpm (the version is pinned in `package.json`).

```bash
pnpm install
cp .env.example .env.local   # optional locally
pnpm dev                     # http://localhost:3000
```

| Command          | What it does                                        |
| ---------------- | --------------------------------------------------- |
| `pnpm dev`       | Development server                                  |
| `pnpm build`     | Production build                                    |
| `pnpm start`     | Serve the production build                          |
| `pnpm lint`      | ESLint                                              |
| `pnpm typecheck` | Route type generation + TypeScript check            |
| `pnpm test`      | Unit and component tests (Vitest)                   |
| `pnpm test:e2e`  | Production build + end-to-end tests (Playwright)    |
| `pnpm check`     | Lint, type check and unit tests in one go           |

## Testing

**Unit and component tests** (`tests/unit`, Vitest + Testing Library, jsdom):

- content integrity: unique slugs, existing image folders, https-only links,
  no planned features on completed projects, valid and ordered dates;
- helpers: durations, parallel-engagement detection, project ordering and
  neighbours, cover and screenshot discovery, CV detection, metadata, JSON-LD escaping;
- components: navigation links, mobile menu (open, Escape, close on navigate),
  theme switching and persistence, project cards, CV button, contact links,
  experience timeline;
- routes: static params, project page rendering, 404 for unknown slugs,
  metadata, sitemap, robots, accessible names (axe-core).

**End-to-end tests** (`tests/e2e`, Playwright, desktop and Pixel 7 viewports)
run against the production build:

- smoke: homepage loads without console errors, navigation to Projects,
  opening a project and moving between projects, 404 page, contact section,
  theme persistence, CV links point to real files, mobile menu, no horizontal overflow;
- every internal link and anchor resolves (crawls all pages);
- axe WCAG 2.2 AA audit in both themes, and a visible focus indicator on every
  focusable element.

First run only: `pnpm exec playwright install chromium`.

CI (`.github/workflows/ci.yml`) runs lint, type check, unit tests, build and
end-to-end tests on every push to `main` and on pull requests.

## Environment

| Variable               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for canonical links, sitemap, Open Graph. |

When it is not set, the site falls back to the Vercel production URL, then to
`http://localhost:3000`. No domain is assumed.

## SEO

Generated at build time from the content files, nothing to maintain by hand:

| Output                         | Source                                                       |
| ------------------------------ | ------------------------------------------------------------ |
| Titles, descriptions, canonical URLs, Open Graph, Twitter cards | `src/lib/metadata.ts` (`createPageMetadata`) |
| Social images (1200×630)       | `opengraph-image.tsx` for the site, `/projects` and each project |
| `/sitemap.xml`                 | `src/app/sitemap.ts`: home, `/projects`, every public project |
| `/robots.txt`                  | `src/app/robots.ts`                                          |
| `/manifest.webmanifest`        | `src/app/manifest.ts`                                        |
| Person + WebSite JSON-LD       | `src/lib/structured-data.ts`, rendered on the home page      |

Absolute URLs use `NEXT_PUBLIC_SITE_URL`. Vercel **preview** deployments
(`VERCEL_ENV=preview`) are served with `noindex, nofollow` and a robots.txt
that disallows everything, so only production is indexed.

## Editing content

All content lives in `src/data/`; components contain no personal text.

| File                     | Content                                               |
| ------------------------ | ----------------------------------------------------- |
| `src/data/profile.ts`    | Name, title, texts, email, social links, CV, availability |
| `src/data/navigation.ts` | Header navigation items                               |
| `src/data/projects.ts`   | Projects: texts, status, visibility, order, links     |
| `src/data/skills.ts`     | Skill categories and technologies                     |
| `src/data/experience.ts` | Work history (dates as `YYYY-MM`)                     |

- **GitHub link:** set `socials.github` in `profile.ts`. While it is `null`, no GitHub link is rendered.
- **Availability badge:** set `availability.visible` to `true` and edit `availability.label`.
- **New project:** add an entry to `projects.ts`, create a folder under
  `public/images/projects/` and set `imageFolder` to its name.
  `featured: true` places it under *Personal projects*.
- **Project status:** `status: "in-development" | "completed"`, or omit it.
  Mark unfinished capabilities with `planned: true`; they are labelled as planned.
- **Hide a draft:** `visibility: "hidden"` removes it from the homepage and its route.
- **Demo / source links:** set `demoUrl` / `githubUrl` only when they work; buttons
  appear only for links that are set.
- **Experience:** `engagement` (Contract / Freelance) and `arrangement` are optional.
  Parallel engagements are detected from the dates and labelled automatically.

## Assets: where to put images and the CV

Folders are already in place. Drop files into them using the names below.

```text
public/
  files/
    cv/
      Serhii_Demianyk_CV.pdf      <- CV
  images/
    projects/
      pulseboard/
      ai-agent-workspace/
      web-ar/
      retail-crm/
      logistics/
      business-platforms/
      pet-social-network/
```

### CV

Save the PDF as `public/files/cv/Serhii_Demianyk_CV.pdf` and rebuild. The
Download CV buttons (header, hero, mobile menu) appear automatically once the
file exists, and stay hidden while it is missing, so there is never a broken
link. To use a different file name, change `cv` in `src/data/profile.ts`.

### Project images

Each project folder takes one cover and any number of screenshots:

| File                         | Used for                        | Recommended size         |
| ---------------------------- | ------------------------------- | ------------------------ |
| `cover.webp`                 | Project card and page header    | 1600 × 1000 px (16:10)   |
| `01.webp`, `02.webp`, ...    | Gallery on the project page     | 1920 × 1200 px (16:10)   |

- Formats: WebP preferred; PNG or JPG also work. Keep each file under about 500 KB.
- Keep the 16:10 ratio so images fit their slots without cropping surprises.
- Remove or blur client names, personal data and anything confidential before exporting.
- Use only real screenshots of the actual product. Until an image exists, the
  site shows a clearly labelled placeholder (`ImagePlaceholder`) with the
  expected file path, never a mockup.

The cover is detected at build time: save `cover.webp` (or `.avif`, `.png`,
`.jpg`) into the project folder and rebuild, and it replaces the placeholder.
In `pnpm dev` each placeholder also shows the exact path it expects.

Screenshots work the same way: numbered files (`01.webp`, `02.webp`, ...) in
the project folder appear in the project page gallery in number order, with
a full-screen viewer. Until a project has any, its page shows three labelled
empty slots (`01`–`03`).

To add a caption or better alt text, describe the file in `projects.ts`:

```ts
screenshots: [
  {
    file: "01.webp",
    alt: "Event Explorer with status filters applied",
    caption: "Event Explorer: filtering events by status and source.",
  },
],
```

An entry whose file does not exist yet is shown as a labelled placeholder,
which is a way to plan a gallery before taking the screenshots. `order`
overrides the position given by the file number.

## Project structure

```text
src/
  app/            Routes, root layout, global styles and design tokens
  components/
    layout/       Header, MobileNavigation, Footer
    sections/     Homepage sections (Hero, Projects, Skills, Experience, About, Contact)
    projects/     ProjectCard, ProjectGrid, ProjectCollections, ProjectCover,
                  ProjectDetails, ProjectGallery, ProjectNavigation, ProjectStatusBadge
    seo/          JsonLd (structured data script)
    ui/           Button, Badge, Container, Section, SectionHeading, TagList,
                  ThemeToggle, ImagePlaceholder, DownloadCvButton
  data/           Content (profile, navigation, projects, skills, experience)
  lib/            Helpers (class names, site URL, theme, CV, projects, dates,
                  metadata, structured data, social image renderer)
  types/          Shared TypeScript types
public/
  images/         Project images
  files/cv/       CV PDF
```

## Theming

Design tokens are CSS variables in `src/app/globals.css`: light values on
`:root`, dark overrides on `[data-theme="dark"]`. Dark is the default. The
visitor's choice is stored in `localStorage` and applied before first paint by
a small inline script, so there is no theme flash.

## Deployment (Vercel)

The site is fully static and deploys to the **Vercel Hobby** plan (free, for
personal non-commercial projects). No secrets are needed: the only variable is
the public site URL.

### 1. Push to GitHub

```bash
git add .
git commit -m "Portfolio"
git remote add origin https://github.com/<your-account>/<repo>.git
git push -u origin main
```

`.env*` files are git-ignored (only `.env.example` is committed).

### 2. Import the project

1. In Vercel: **Add New → Project**, pick the GitHub repository.
2. Framework preset: **Next.js** (detected automatically). Keep the default
   build command and output settings.
3. Environment variables (Production):
   - `NEXT_PUBLIC_SITE_URL` = the final URL, e.g. `https://your-domain.com`.
     Until a domain exists, leave it unset: the `*.vercel.app` production URL is used.
   - `ENABLE_EXPERIMENTAL_COREPACK` = `1`, so Vercel installs the exact pnpm
     version pinned in `package.json` (`packageManager`). Only needed if the
     install step reports a pnpm version mismatch.
4. **Deploy.**

### 3. Preview deployments

Every pull request and non-`main` branch gets its own preview URL
automatically. Previews are served with `noindex, nofollow` and a robots.txt
that disallows crawling (`VERCEL_ENV=preview`), so they never compete with the
production site in search results.

### 4. Custom domain

1. **Project → Settings → Domains → Add**, enter the domain.
2. Add the DNS records Vercel shows at your registrar. HTTPS is issued automatically.
3. Set `NEXT_PUBLIC_SITE_URL` to the domain and **redeploy**, so canonical
   URLs, the sitemap and social images use it.

### After deploying

- Check `https://<domain>/sitemap.xml` and `https://<domain>/robots.txt`.
- Submit the sitemap in Google Search Console.
- Test link previews with a social preview tool (LinkedIn Post Inspector).

## Before publishing: content checklist

- [ ] Add the CV: `public/files/cv/Serhii_Demianyk_CV.pdf`.
- [ ] Set the GitHub URL in `src/data/profile.ts` (`socials.github`), or keep it `null`.
- [ ] Confirm the LinkedIn URL opens the right profile.
- [ ] Decide on the availability badge (`availability.visible`).
- [ ] Add real covers and screenshots (see *Assets* above); blur client data.
- [ ] Add `demoUrl` / `githubUrl` for projects with a public demo or code.
- [ ] Optionally add `architecture`, `challenges` and `outcomes` to projects.
- [ ] Set `NEXT_PUBLIC_SITE_URL` once the domain is known.
