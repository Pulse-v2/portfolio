import type { SkillCategory } from "@/types/skill";

/** Technologies grouped by area. Order here is display order. */
export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: "frontend",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "React Hooks"],
  },
  {
    id: "ui",
    title: "UI Development",
    icon: "ui",
    skills: ["HTML", "CSS", "Sass / SCSS", "Tailwind CSS", "Material UI", "Bootstrap"],
  },
  {
    id: "state",
    title: "State Management",
    icon: "state",
    skills: ["Redux", "Recoil"],
  },
  {
    id: "backend",
    title: "Backend & Data",
    icon: "backend",
    skills: ["Supabase", "PostgreSQL", "MySQL", "Firebase", "Xano", "REST APIs", "n8n"],
  },
  {
    id: "graphics",
    title: "3D Graphics & Interactive Experiences",
    icon: "graphics",
    skills: ["Three.js", "WebGL", "A-Frame"],
  },
  {
    id: "tools",
    title: "Tools",
    icon: "tools",
    skills: ["Git", "Webpack"],
  },
];
