import type { ExperienceEntry, YearMonth } from "@/types/experience";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parse(value: YearMonth): { year: number; month: number } {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
}

/** Months since year 0; makes ranges easy to compare. */
function toIndex(value: YearMonth): number {
  const { year, month } = parse(value);
  return year * 12 + (month - 1);
}

/** "2025-05" → "May 2025" */
export function formatYearMonth(value: YearMonth): string {
  const { year, month } = parse(value);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "2025-05" → "May 2025" with a shortened month, for tight layouts. */
export function formatYearMonthShort(value: YearMonth): string {
  const { year, month } = parse(value);
  return `${MONTHS[month - 1].slice(0, 3)} ${year}`;
}

/** Inclusive duration, e.g. "1 yr 7 mos". */
export function formatDuration(start: YearMonth, end: YearMonth): string {
  const total = toIndex(end) - toIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
}

/**
 * Entries whose date ranges overlap the given one by at least a full month.
 * A handover in the same month (one ends, the next starts) is not an overlap.
 */
export function findOverlaps(
  entry: ExperienceEntry,
  entries: ExperienceEntry[],
): ExperienceEntry[] {
  const start = toIndex(entry.start);
  const end = toIndex(entry.end);
  return entries.filter(
    (other) =>
      other.id !== entry.id &&
      toIndex(other.start) < end &&
      start < toIndex(other.end),
  );
}
