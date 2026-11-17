import type { NavigationItem } from "@/types/profile";

/**
 * Primary navigation. Section links are root-relative so they also work
 * from project pages.
 */
export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
