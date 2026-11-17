import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Geist, the site font, read from the geist package at build time. */
const fontDir = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts");

let fontsPromise: Promise<NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"]> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(path.join(fontDir, "geist-sans", "Geist-Regular.ttf")),
    readFile(path.join(fontDir, "geist-sans", "Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "geist-mono", "GeistMono-Regular.ttf")),
  ]).then(([regular, semiBold, mono]) => [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semiBold, weight: 600 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ]);
  return fontsPromise;
}

/** Shared Open Graph image canvas (1200×630), drawn with the site's dark palette. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const colors = {
  background: "#0a0f1c",
  surface: "#0f1626",
  border: "#1e2940",
  grid: "#131b2d",
  borderStrong: "#2d3b5a",
  foreground: "#e9edf5",
  muted: "#a3aec4",
  subtle: "#8390aa",
  accent: "#74b8ff",
  warning: "#f0b860",
};

interface OgCardInput {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  footer: string;
  /** Optional status pill, e.g. "In Development". */
  status?: string;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function renderOgCard({ eyebrow, title, description, tags, footer, status }: OgCardInput) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: colors.background,
          backgroundImage: `linear-gradient(to right, ${colors.grid} 1px, transparent 1px), linear-gradient(to bottom, ${colors.grid} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          color: colors.foreground,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: colors.accent,
            }}
          >
            {eyebrow}
          </div>
          {status && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px",
                border: `1px solid ${colors.borderStrong}`,
                borderRadius: 6,
                fontSize: 20,
                color: colors.warning,
                background: colors.surface,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 8, background: colors.warning }} />
              {status}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 32 ? 64 : 80,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {truncate(title, 60)}
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: colors.muted, maxWidth: 980 }}>
            {truncate(description, 140)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 820 }}>
            {tags.slice(0, 5).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 14px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  background: colors.surface,
                  fontFamily: "Geist Mono",
                  fontSize: 19,
                  color: colors.muted,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: colors.subtle }}>{footer}</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
