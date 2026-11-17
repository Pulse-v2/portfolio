export type SkillCategoryIcon =
  | "frontend"
  | "ui"
  | "state"
  | "backend"
  | "graphics"
  | "tools";

export interface SkillCategory {
  id: string;
  title: string;
  icon: SkillCategoryIcon;
  skills: string[];
}
