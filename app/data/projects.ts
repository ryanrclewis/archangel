export type ProjectStatus = "LIVE" | "IN PROGRESS" | "COMPLETED" | "ONLINE";

export type Project = {
  id: string;
  name: string;
  folder: "Our Work" | "Past Work" | "Archangel";
  type: string;
  status: ProjectStatus;
  description: string;
  url?: string;
  tags?: string[];
  features?: string[];
  legacyPath?: string;
};

export const projects: Project[] = [
  {
    id: "saintstombs",
    name: "SAINTSTOMBS",
    folder: "Our Work",
    type: "Web Application",
    status: "LIVE",
    url: "https://saintstombs.com",
    description:
      "Explore the final resting places of the world's most revered holy figures.",
    tags: ["Catholic", "History", "Geography", "Web"],
  },
  {
    id: "mithril",
    name: "MITHRIL",
    folder: "Our Work",
    type: "Docker / Networking",
    status: "LIVE",
    url: "https://github.com/ryanrclewis/mithril",
    description:
      "Docker-based DNS filtering solution that blocks NSFW content across your network.",
    tags: ["Docker", "DNS", "Networking", "Security"],
  },
  {
    id: "heirloom",
    name: "HEIRLOOM",
    folder: "Our Work",
    type: "Web Application",
    status: "IN PROGRESS",
    url: "https://heirloom-two.vercel.app/login",
    description: "A digital keepsake for your family's history.",
    tags: ["Family", "History", "Digital Preservation"],
  },
  {
    id: "crisis-catalog",
    name: "CRISIS CATALOG",
    folder: "Our Work",
    type: "Web Application",
    status: "IN PROGRESS",
    url: "https://crisis-catalog.pages.dev/",
    description: "A checklist for emergency preparedness for Catholic families.",
    tags: ["Catholic", "Preparedness", "Checklist", "Emergency"],
  },
  {
    id: "psalm113-3",
    name: "PSALM 113:3",
    folder: "Our Work",
    type: "Web Visualization",
    status: "IN PROGRESS",
    url: "https://github.com/ryanrclewis/psalm113-3",
    description: "A visualization of Earth, reactive to the Consecration of the Eucharist.",
    tags: ["Catholic", "Visualization", "Interactive", "Spiritual"],
  },
  {
    id: "pantrie",
    name: "PANTRIE",
    folder: "Our Work",
    type: "Docker / CLI Tool",
    status: "IN PROGRESS",
    url: "https://github.com/ryanrclewis/pantrie",
    description: "Docker utility to catalog what is in your pantry and when it expires.",
    tags: ["Docker", "Home", "Inventory", "CLI"],
  },
  {
    id: "nsfm",
    name: "NATIONAL SCI-FI MUSEUM",
    folder: "Past Work",
    type: "iOS Application",
    status: "COMPLETED",
    description: "iOS design and development for the National Science Fiction Museum.",
    features: [
      "Native iOS application development",
      "Interactive museum exhibits",
      "User interface design",
      "Custom navigation system",
    ],
    legacyPath: "/legacy/projects/nsfm.html",
  },
  {
    id: "lwt",
    name: "LONG WALK TECHNOLOGIES",
    folder: "Past Work",
    type: "Web Development",
    status: "COMPLETED",
    description: "Creative consultancy and web development services.",
    features: [
      "Creative direction and strategy",
      "Web application development",
      "Technical consulting",
      "Brand implementation",
    ],
    legacyPath: "/legacy/projects/lwt.html",
  },
  {
    id: "coetic",
    name: "COETICHR",
    folder: "Past Work",
    type: "Web Redesign",
    status: "COMPLETED",
    description: "Website rearchitecture and software showcase for CoeticHR.",
    features: [
      "Website architecture redesign",
      "Software feature showcase",
      "Performance optimization",
      "UX improvements",
    ],
    legacyPath: "/legacy/projects/coetic.html",
  },
  {
    id: "woether",
    name: "WOETHER",
    folder: "Past Work",
    type: "Web Application",
    status: "COMPLETED",
    description: "Project management application founded on organizational psychology.",
    features: [
      "Organizational psychology framework",
      "Team workflow management",
      "Psychology-based productivity",
      "Custom reporting",
    ],
    legacyPath: "/legacy/projects/woether.html",
  },
  {
    id: "finer-dining",
    name: "FINER DINING",
    folder: "Past Work",
    type: "UX / Product Design",
    status: "COMPLETED",
    description: "Enhancing the dining experience in Apple Maps.",
    features: [
      "Apple Maps integration design",
      "Restaurant discovery features",
      "Enhanced dining information",
      "User experience research",
    ],
    legacyPath: "/legacy/projects/finer-dining.html",
  },
  {
    id: "dsl",
    name: "DIGITAL SCHOLARSHIP LAB",
    folder: "Past Work",
    type: "Web Redesign",
    status: "COMPLETED",
    description: "Website redesign to draw in new users.",
    features: [
      "User research and analysis",
      "Complete visual redesign",
      "Improved navigation",
      "Accessibility improvements",
    ],
    legacyPath: "/legacy/projects/dsl.html",
  },
  {
    id: "h2home",
    name: "H2HOME",
    folder: "Past Work",
    type: "Product Design",
    status: "COMPLETED",
    description: "Sustainable product design, centered on water conservation.",
    features: [
      "Sustainable design principles",
      "Water conservation focus",
      "Product prototyping",
      "Environmental impact analysis",
    ],
    legacyPath: "/legacy/projects/h2home.html",
  },
  {
    id: "soundwriting",
    name: "SOUNDWRITING",
    folder: "Past Work",
    type: "Interface Design",
    status: "COMPLETED",
    description: "A revolutionary interface for audio content.",
    features: [
      "Audio content navigation",
      "Innovative interface design",
      "Accessibility considerations",
      "Cross-platform implementation",
    ],
    legacyPath: "/legacy/projects/soundwriting.html",
  },
  {
    id: "all-aboard",
    name: "ALL ABOARD",
    folder: "Past Work",
    type: "Game Prototype",
    status: "COMPLETED",
    description: "A prototype for a game to learn about accessibility.",
    features: [
      "Educational game design",
      "Accessibility awareness training",
      "Interactive prototype",
      "User testing",
    ],
    legacyPath: "/legacy/projects/all-aboard.html",
  },
  {
    id: "portfolio",
    name: "PORTFOLIO",
    folder: "Past Work",
    type: "Portfolio Website",
    status: "LIVE",
    url: "https://ryanrclewis.family",
    description: "The legacy portfolio of work from Ryan R. C. Lewis.",
    tags: ["Portfolio", "Design", "Development"],
    legacyPath: "/legacy/index.html",
  },
  {
    id: "contact",
    name: "CONTACT",
    folder: "Archangel",
    type: "Info",
    status: "ONLINE",
    url: "mailto:contact@archangel-labs.com",
    description: "Get in touch with Archangel Laboratories.",
  },
];

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getProjectIds() {
  return projects.map((project) => project.id);
}
