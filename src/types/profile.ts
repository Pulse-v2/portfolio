export interface Availability {
  /** Set to true only when the label reflects the real current status. */
  visible: boolean;
  label: string;
}

export interface SocialLinks {
  /** Full profile URL, or null to hide the link everywhere. */
  linkedin: string | null;
  /** Full profile URL, or null to hide the link everywhere. */
  github: string | null;
}

export interface CvFile {
  /** Public path of the PDF, relative to /public. */
  path: string;
  /** File name suggested to the browser on download. */
  fileName: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Education {
  title: string;
  institution: string;
  period: string;
}

export interface Profile {
  name: string;
  /** Short mark used in the logo and favicon. */
  initials: string;
  title: string;
  location: string;
  experienceLabel: string;
  statement: string;
  supporting: string;
  /** Used for meta descriptions and structured data. */
  summary: string;
  heroTechnologies: string[];
  about: string[];
  availability: Availability;
  email: string;
  socials: SocialLinks;
  cv: CvFile;
  languages: Language[];
  education: Education[];
  contactMessage: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
