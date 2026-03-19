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
      "Database of saints and their final resting places, built as a resource for pilgrims and anyone interested in the saints.",
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
    description:
      "Crafted iOS app concept for the National Sci-Fi Museum focused on approachable navigation, inclusive interactions, and genre-inspired visual identity.",
    features: [
      "Avenir Next-led visual system for a futuristic but legible UI",
      "Accessibility-conscious interaction patterns and color contrast",
      "Inclusive features such as icon-supported exhibit media discovery",
      "Persona-driven design decisions for diverse museum audiences",
    ],
    legacyPath: "/legacy/projects/nsfm.html",
  },
  {
    id: "lwt",
    name: "LONG WALK TECHNOLOGIES",
    folder: "Past Work",
    type: "Web Development",
    status: "COMPLETED",
    description: "Website project for Long Walk Technologies.",
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
    url: "https://coetichr.com/",
    description: "Coetic Website 4.0 redesign and architecture refresh for CoeticHR.",
    features: [
      "Website architecture redesign",
      "Platform showcase for CoeticHR offerings",
      "Cross-functional collaboration with product and design teammates",
      "Improved UX clarity for navigation and feature communication",
    ],
    legacyPath: "/legacy/projects/coetic.html",
  },
  {
    id: "people-science",
    name: "PEOPLE SCIENCE",
    folder: "Past Work",
    type: "Web Experience",
    status: "COMPLETED",
    url: "https://coetichr.com/people-science",
    description: "Companion experience within the Coetic ecosystem focused on people science content.",
    features: [
      "Content-forward experience design",
      "Information architecture aligned with Coetic products",
      "Collaborative implementation with cross-functional creators",
      "Audience-friendly storytelling and conversion pathways",
    ],
  },
  {
    id: "effective-ministry-360",
    name: "EFFECTIVE MINISTRY 360",
    folder: "Past Work",
    type: "Product Experience",
    status: "COMPLETED",
    description: "Collaborative project focused on product and experience strategy for ministry operations.",
    features: [
      "Product and UX planning",
      "Cross-functional creator collaboration",
      "Information flow and workflow definition",
      "Experience refinement across core journeys",
    ],
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
    url: "https://www.figma.com/file/eUZ07Ey7U74UHdyJOMAa7RAR/Finer-Dining",
    description:
      "Value-centered design exploration for improving the dining discovery experience with research-backed prototyping.",
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
    description:
      "Research and redesign initiative delivering data and concepts to improve the Digital Scholarship Lab website experience.",
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
    description:
      "Experimental audio interface for publishing and interacting with scholarly sound content.",
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
    url: "https://www.figma.com/file/WZDUSUHeqSbW7HArjMvHe97k/All-Aboard",
    description:
      "Participatory design game prototype built to teach accessibility, with an initial focus on visual disabilities.",
    features: [
      "Educational game design",
      "Accessibility awareness training",
      "Interactive prototype",
      "User testing",
    ],
    legacyPath: "/legacy/projects/all-aboard.html",
  },
  {
    id: "coetic-3",
    name: "COETIC WEBSITE 3.0",
    folder: "Past Work",
    type: "Web Redesign",
    status: "COMPLETED",
    description: "Earlier Coetic website redesign iteration produced in a rapid collaborative cycle.",
    features: [
      "Rapid website iteration and redesign",
      "Cross-functional creator collaboration",
      "Content and navigation restructuring",
      "Brand and UI consistency improvements",
    ],
  },
  {
    id: "michigan-avenue-2030",
    name: "MICHIGAN AVENUE 2030",
    folder: "Past Work",
    type: "Human-Centered Research",
    status: "COMPLETED",
    description:
      "Collaboration with the Michigan Avenue Corridor Improvement Authority and Michigan State University to provide human-centered research for proposed corridor developments.",
    features: [
      "Community-centered research planning",
      "Stakeholder collaboration with public institutions",
      "Insight synthesis for urban development decisions",
      "Human-centered framing for strategic proposals",
    ],
  },
  {
    id: "global-payment-network",
    name: "GLOBAL PAYMENT NETWORK",
    folder: "Past Work",
    type: "Research Project",
    status: "COMPLETED",
    description: "Investigation into online payments and the underlying technology stack that enables them.",
    features: [
      "Payments ecosystem research",
      "Technology stack analysis",
      "User and system flow mapping",
      "Findings documentation and presentation",
    ],
  },
  {
    id: "jane-the-brain",
    name: "JANE THE BRAIN",
    folder: "Past Work",
    type: "Campaign Design",
    status: "COMPLETED",
    url: "https://www.figma.com/file/L5vtCesfaLYyz8LVorePmjQx/Jane-the-Brain-Presents-Mental-Health-Awareness",
    description:
      "Mental health awareness campaign designed to educate Michigan State University students on available campus resources.",
    features: [
      "Rhetorical and campaign design strategy",
      "Student-focused mental health education",
      "Messaging and experience design for campus audiences",
      "Figma-based campaign artifact production",
    ],
  },
  {
    id: "allo-redesign",
    name: "ALLO REDESIGN",
    folder: "Past Work",
    type: "UX Concept",
    status: "COMPLETED",
    description:
      "UX concept exploring the future of Google Material Design through an Allo redesign before platform sunset.",
    features: [
      "Material Design exploration",
      "Conversation-focused interaction redesign",
      "Concept validation through UX principles",
      "Product narrative for emerging interface patterns",
    ],
  },
  {
    id: "casual-grey-logo",
    name: "CASUAL GREY LOGO DESIGN",
    folder: "Past Work",
    type: "Brand Design",
    status: "COMPLETED",
    description: "Logo design for an outerwear brand blending class-forward identity with modern styling.",
    features: [
      "Brand identity exploration",
      "Logo concept and refinement",
      "Modern-classic visual balance",
      "Client-guided design iteration",
    ],
  },
  {
    id: "wur-modernization",
    name: "WATER USE REPORTING MODERNIZATION",
    folder: "Past Work",
    type: "Government Modernization",
    status: "IN PROGRESS",
    description:
      "Modernization effort for Michigan's Water Use Reporting program to improve usability, reliability, and long-term maintainability.",
    features: [
      "Legacy workflow modernization",
      "Service design for agency and public users",
      "Improved performance and platform maintainability",
      "Alignment to State of Michigan digital standards",
    ],
  },
  {
    id: "icdb-modernization",
    name: "MDARD ICDB MODERNIZATION",
    folder: "Past Work",
    type: "Government Modernization",
    status: "IN PROGRESS",
    description:
      "Modernized the legacy Intentional Conversation Database used to track performance conversations and policy adherence at MDARD.",
    features: [
      "Legacy database modernization",
      "Lower-cost architecture and improved sustainability",
      "Updated UX aligned to state guidelines",
      "Support for performance and pay-period workflows",
    ],
  },
  {
    id: "fish-modernization",
    name: "FISH PROGRAM MODERNIZATION",
    folder: "Past Work",
    type: "Government Modernization",
    status: "IN PROGRESS",
    description:
      "Supported modernization of the Fisheries Information System Hub to strengthen data quality and collaboration for fisheries management.",
    features: [
      "Data-heavy system modernization",
      "Cross-agency collaboration support",
      "Improved usability for science and policy workflows",
      "Platform updates for long-term program resilience",
    ],
  },
  {
    id: "wwat-modernization",
    name: "WWAT MODERNIZATION",
    folder: "Past Work",
    type: "Government Modernization",
    status: "IN PROGRESS",
    description:
      "Modernization of the Water Withdrawal Assessment Tool to support required pre-installation impact checks for large quantity withdrawals.",
    features: [
      "Modernization of a critical statewide assessment tool",
      "Continuity after transfer from Michigan State University",
      "Improved digital experience and system reliability",
      "Policy-aligned workflows for water resource protection",
    ],
  },
  {
    id: "mif-modernization",
    name: "MICHIGAN FOREST INVENTORY",
    folder: "Past Work",
    type: "Government Digital Platform",
    status: "IN PROGRESS",
    description:
      "Web platform work supporting Michigan Forest Inventory workflows for conservation, treatment planning, and timber sale execution.",
    features: [
      "Forestry operations workflow support",
      "Inventory and treatment planning enablement",
      "Business function continuity for MDNR teams",
      "Improved digital tooling for forest management",
    ],
  },
  {
    id: "miehdwis",
    name: "MIEHDWIS",
    folder: "Past Work",
    type: "Government Digital Platform",
    status: "IN PROGRESS",
    description:
      "Delivered platform improvements for MiEHDWIS, the regulated-entity workspace for monitoring results, permits, and program documentation.",
    features: [
      "Regulated-entity submission experience",
      "Permit and licensing workflow support",
      "Documentation and monitoring result intake",
      "Program operations enablement for DWEHD teams",
    ],
  },
  {
    id: "digital-standards",
    name: "DIGITAL STANDARDS",
    folder: "Past Work",
    type: "Design System / Standards",
    status: "IN PROGRESS",
    description:
      "Contributed to statewide digital standards focused on consistent, trustworthy, and seamless citizen experiences across agencies.",
    features: [
      "Cross-channel consistency framework",
      "Guidance for websites, apps, and digital communication",
      "Trust-centered user experience principles",
      "Scalable standards for multi-agency implementation",
    ],
  },
  {
    id: "digital-guidelines",
    name: "DIGITAL GUIDELINES",
    folder: "Past Work",
    type: "Design System / Guidelines",
    status: "IN PROGRESS",
    description:
      "Helped shape practical digital guidelines that enable teams to kickstart app design and development with user-trusted patterns.",
    features: [
      "Developer and designer onboarding support",
      "Pattern guidance for trusted digital experiences",
      "Usability-first implementation recommendations",
      "Alignment with broader One State, One Brand direction",
    ],
  },
  {
    id: "one-state-one-brand",
    name: "ONE STATE, ONE BRAND",
    folder: "Past Work",
    type: "Government Experience Strategy",
    status: "IN PROGRESS",
    description:
      "Experience strategy work advancing consistent service experiences across Michigan digital properties for residents, businesses, and visitors.",
    features: [
      "Human-centered strategy alignment",
      "Cross-agency digital experience consistency",
      "Support for strategic IT and service objectives",
      "Design-led modernization advocacy",
    ],
  },
  {
    id: "portfolio",
    name: "PORTFOLIO",
    folder: "Past Work",
    type: "Portfolio Website",
    status: "LIVE",
    url: "http://ryanrclewis.family",
    description: "Professional portfolio created to present work and capabilities to employers and collaborators.",
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
