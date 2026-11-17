import type { ExperienceEntry } from "@/types/experience";

/**
 * Work history, newest first. Dates are "YYYY-MM".
 * engagement / arrangement are set only where they are known; overlapping
 * engagements are detected from the dates automatically.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "digis",
    company: "Digis",
    role: "Frontend / Full Stack Developer",
    start: "2025-05",
    end: "2026-11",
    arrangement: "Remote",
    client: "French logistics company",
    summary:
      "Worked on web platforms for a logistics business, including administrative panels and driver-facing mission websites.",
    contributions: [
      "Built administrative interfaces and driver-facing applications using WeWeb and Supabase.",
      "Expanded responsibilities from frontend development into backend logic and database development.",
      "Implemented driver document processing and logistics-related functionality.",
      "Worked with large volumes of data.",
      "Integrated multiple external services and APIs.",
      "Contributed to React and Next.js projects.",
    ],
    technologies: ["WeWeb", "Supabase", "React", "Next.js", "n8n"],
  },
  {
    id: "merge-rocks",
    company: "Merge Rocks",
    role: "Frontend Developer",
    start: "2025-10",
    end: "2026-04",
    engagement: "Contract",
    arrangement: "Remote",
    summary: "Developed a CRM system for a clothing and accessories store.",
    technologies: ["WeWeb", "Supabase"],
  },
  {
    id: "nocode-rebels",
    company: "Nocode Rebels",
    role: "Frontend Developer",
    start: "2024-05",
    end: "2025-05",
    engagement: "Contract",
    arrangement: "Hybrid",
    summary: "Worked on several no-code products.",
    projects: [
      {
        title: "Social media dashboard",
        description:
          "A dashboard for aggregating and analyzing data from multiple platforms.",
      },
      {
        title: "Resource collection platform",
        description:
          "A platform for email campaigns, including automated content extraction, organization, and filtering.",
      },
      {
        title: "Tech NonProfit platform",
        description:
          "A platform for Tech NonProfit organizations with complex filtering by impact locations, technologies, and issue areas.",
      },
    ],
    contributions: [
      "Implemented dynamic filtering and custom interface functionality.",
      "Integrated REST APIs and backend services.",
      "Developed complex database queries.",
      "Customized no-code applications with JavaScript.",
      "Optimized and refactored existing projects.",
      "Mentored junior developers and supported teammates.",
    ],
    technologies: ["WeWeb", "Xano", "HubSpot", "Outseta", "Nylas", "REST APIs", "JavaScript"],
  },
  {
    id: "bridgelt",
    company: "BridgeLT",
    role: "Frontend AR Developer",
    start: "2023-03",
    end: "2024-04",
    engagement: "Freelance",
    summary:
      "Worked on a WebAR educational platform featuring interactive 3D models and browser-based augmented reality experiences.",
    contributions: [
      "Developed interactive WebAR lessons using React and TypeScript.",
      "Implemented 3D scenes and graphics rendering using WebGL and Three.js.",
      "Created animations and particle systems.",
      "Worked with 3D model manipulation and dynamic textures.",
      "Developed custom React Hooks.",
      "Built reusable interface components for interacting with 3D objects.",
      "Improved rendering performance, responsiveness, and UX.",
      "Collaborated with designers, scriptwriters, and testers in an English-speaking team.",
    ],
    technologies: ["React", "TypeScript", "Three.js", "WebGL", "A-Frame"],
  },
  {
    id: "startup-project",
    company: "Startup Project",
    role: "Frontend Developer",
    start: "2022-03",
    end: "2023-07",
    engagement: "Freelance",
    summary: "Two separate products, worked on in parallel during this freelance engagement.",
    projects: [
      {
        title: "Progressive web application for pet owners",
        description: "A PWA with social features for pet owners.",
        highlights: [
          "Social functionality for pet owners.",
          "Integration with external social networks.",
          "Communication with veterinarians and clinics.",
          "User-to-user chat and photo sharing.",
          "Interactive event calendar.",
        ],
        technologies: ["React", "TypeScript", "Sass", "Recoil", "Firebase", "REST APIs", "Zulip"],
      },
      {
        title: "CRM application for a retail business",
        description: "Contributed to a CRM application for a retail business.",
        highlights: [
          "Supplier management.",
          "Customer management.",
          "Product catalog.",
          "Orders and invoices.",
          "Multi-currency accounting.",
          "Currency exchange rates and conversions.",
          "Payment and supplier payout tracking.",
          "Internal expense management.",
          "Financial reports by currency and consolidated reports.",
          "Nova Poshta API integration for order status tracking.",
        ],
        technologies: ["Angular", "Supabase", "PostgreSQL", "Nova Poshta API"],
      },
    ],
  },
  {
    id: "thinkmobiles",
    company: "ThinkMobiles",
    role: "Junior Frontend / PHP Developer",
    start: "2021-01",
    end: "2022-02",
    summary: "Worked on frontend development and WordPress-based projects.",
    contributions: [
      "Created interface components and customized forms.",
      "Implemented website functionality.",
      "Worked with WordPress themes and plugins.",
      "Integrated frontend layouts into WordPress.",
      "Worked with PHP and MySQL.",
    ],
    technologies: ["React", "PHP", "WordPress", "MySQL"],
  },
  {
    id: "isp-compot",
    company: "ISP Compot",
    role: "System Administrator / Director",
    start: "2018-03",
    end: "2020-12",
    compact: true,
  },
];
