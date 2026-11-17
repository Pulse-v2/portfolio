/** Year and month, e.g. "2025-05". */
export type YearMonth = `${number}-${number}`;

export type EngagementType = "Contract" | "Freelance";
export type WorkArrangement = "Remote" | "Hybrid" | "On-site";

export interface ExperienceProject {
  title: string;
  description: string;
  highlights?: string[];
  /** Stack of this product only. */
  technologies?: string[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  start: YearMonth;
  end: YearMonth;
  /** Only set when stated; never inferred. */
  engagement?: EngagementType;
  arrangement?: WorkArrangement;
  client?: string;
  summary?: string;
  contributions?: string[];
  /** Distinct products within one engagement; their stacks stay separate. */
  projects?: ExperienceProject[];
  technologies?: string[];
  /** Compact entries show only role, company and dates. */
  compact?: boolean;
}
