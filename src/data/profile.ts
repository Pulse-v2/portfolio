import type { Profile } from "@/types/profile";

/**
 * Single source of truth for personal information.
 * Update values here; no component hardcodes any of this.
 */
export const profile: Profile = {
  name: "Serhii Demianyk",
  initials: "SD",
  title: "Frontend / Full Stack Developer",
  location: "Uzhhorod, Ukraine",
  experienceLabel: "6+ years of commercial experience",
  statement:
    "Building scalable web applications, interactive experiences, and data-driven products.",
  supporting:
    "6+ years of experience building web applications with JavaScript, TypeScript, React, and modern technologies.",
  summary:
    "Frontend / Full Stack Developer with 6+ years of experience building web applications, business platforms, interactive interfaces, and data-driven products.",
  heroTechnologies: [
    "React",
    "TypeScript",
    "Next.js",
    "Angular",
    "Supabase",
    "Three.js",
  ],
  about: [
    "I'm a Frontend / Full Stack Developer with over 6 years of commercial experience building web applications, business platforms, and interactive experiences.",
    "My experience combines frontend engineering with backend logic, database development, API integrations, and low-code solutions.",
    "I enjoy understanding complex business requirements, choosing practical technical solutions, and building products that are reliable, maintainable, and easy to use.",
  ],

  // Hidden by default. Turn on only when the label is actually true.
  availability: {
    visible: false,
    label: "Available for new opportunities",
  },

  email: "demianik.serhii@gmail.com",

  socials: {
    linkedin: "https://www.linkedin.com/in/serhii-demianyk",
    // Add the real profile URL to show GitHub links across the site.
    github: null,
  },

  // The Download CV buttons appear only once this file exists in /public.
  cv: {
    path: "/files/cv/Serhii_Demianyk_CV.pdf",
    fileName: "Serhii_Demianyk_CV.pdf",
  },

  languages: [
    { name: "Ukrainian", level: "Native" },
    { name: "English", level: "Upper-Intermediate" },
  ],

  education: [
    {
      title: "Master of Applied Physics",
      institution: "Uzhhorod National University",
      period: "September 2010 — June 2016",
    },
    {
      title: "Frontend Development Courses",
      institution: "IT Step Academy",
      period: "May 2021 — October 2021",
    },
  ],

  contactMessage:
    "Have an interesting project or opportunity? I'd be happy to connect.",
};
