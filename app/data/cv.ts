export type CvEntryLink = {
  label: string;
  href: string;
};

export type CvEntry = {
  id: string;
  timeframe: string;
  status?: string;
  title: string;
  organization: string;
  summary: string;
  highlights?: string[];
  links?: CvEntryLink[];
};

export const bespokeEntries: CvEntry[] = [
  {
    id: "heirloom",
    timeframe: "In Progress",
    status: "iOS Application",
    title: "Heirloom",
    organization: "Self-directed",
    summary: "A digital keepsake for your family’s history, designed for iOS.",
    links: [{ label: "Heirloom", href: "/projects/heirloom" }],
  },
  {
    id: "saintstombs",
    timeframe: "Jan 2026",
    status: "Web Application",
    title: "SaintsTombs",
    organization: "BKO",
    summary:
      "An open-access digital pilgrimage gazetteer and hagiographical index mapping 14,290 holy figures across 5,824 shrines and 138 countries. Rebuilt as a zero-database React 19 and TypeScript app with a custom Git-backed Structured Markdown CMS on Cloudflare Pages Workers.",
    highlights: [
      "0.62 ms p50 client-side search across 14,290 indexed figures with a 75.48 KB gzipped entry bundle.",
      "Lossless Markdown round-trip editor and automatic liturgical calendar theming via browser-side Easter computus.",
    ],
    links: [{ label: "SaintsTombs", href: "/projects/saintstombs" }],
  },
  {
    id: "pantrie",
    timeframe: "Jan 2026",
    status: "Docker / CLI Tool",
    title: "Pantrie",
    organization: "JEL",
    summary:
      "A self-hosted pantry inventory and expiration tracker built with Node.js 20, Express, PostgreSQL 16, Redis 7, React 18, Docker Compose, and Caddy 2, paired with CLI admin scripts and a native SwiftUI and SwiftData iOS companion.",
    highlights: [
      "Mobile PWA UPC-A and EAN-13 camera barcode scanning with Open Food Facts lookup and graceful manual fallback.",
      "Daily 8:00 AM expiration alerts via VAPID Web Push and SMTP email with per-user 3 to 30 day windows.",
    ],
    links: [{ label: "Pantrie", href: "/projects/pantrie" }],
  },
];

export const governmentEntries: CvEntry[] = [
  {
    id: "state-of-michigan",
    timeframe: "2025 to Present",
    status: "Civic Technology",
    title: "UX Design & Application Modernization",
    organization: "State of Michigan (MDARD, EGLE, DNR, DTMB)",
    summary:
      "Modernizing public-facing and internal state web applications to meet WCAG 2.1 AA accessibility requirements ahead of federal enforcement deadlines and align with Michigan's One State, One Brand design standards.",
    highlights: [
      "Rebuilt public portals including MiSAFE, Well Record Retrieval System, Burn Permits, and Water Withdrawal Assessment Tool.",
      "Contributed design and implementation work supporting Michigan's Digital Standards and Digital Guidelines across agencies.",
    ],
    links: [
      { label: "Food Inspections Online Postings", href: "/projects/fiop-modernization" },
      { label: "Well Record Retrieval System", href: "/projects/wrrs-modernization" },
      { label: "Burn Permits", href: "/projects/burn-permits-modernization" },
      { label: "WWAT", href: "/projects/wwat-modernization" },
      { label: "Digital Guidelines", href: "/projects/digital-guidelines" },
    ],
  },
];

export const experienceEntries: CvEntry[] = [
  {
    id: "general-motors",
    timeframe: "Through May 2025",
    status: "Automotive",
    title: "Experience Architecture",
    organization: "General Motors",
    summary:
      "Designed human-centered interfaces for AI-powered features built around safety and user trust alongside engineering, product, and data science teams.",
    highlights: [
      "Dug into user analytics and behavioral data to close UX gaps and iterate on patterns that raised feature adoption by 40%.",
      "Helped standardize design-to-development handoffs across teams, reducing handoff time by 34%.",
    ],
    links: [{ label: "General Motors", href: "/projects/gm" }],
  },
  {
    id: "long-walk-technologies",
    timeframe: "Dec 2024",
    status: "Defense Technology",
    title: "Web Strategy, Design & Engineering",
    organization: "Long Walk Technologies",
    summary:
      "Partnered on website creative direction, brand implementation, technical consulting, and web application development.",
    links: [{ label: "Long Walk Technologies", href: "/projects/lwt" }],
  },
  {
    id: "stellantis",
    timeframe: "Through Jan 2022",
    status: "Automotive",
    title: "Experience Architecture",
    organization: "Stellantis",
    summary:
      "Led agile design sprints on a global team, owning the design process from user research and usability testing through prototyping and cross-platform web and mobile implementation.",
    highlights: [
      "Prioritized product work using user feedback and legacy NPS data, helping raise end-user scores by 15 points.",
      "Established design-to-development workflows with engineering partners across regions to keep build quality consistent.",
    ],
    links: [{ label: "Stellantis", href: "/projects/stellantis" }],
  },
  {
    id: "coetic-hr",
    timeframe: "2019 to 2020",
    status: "SaaS",
    title: "Product & Web Experience Design",
    organization: "CoeticHR",
    summary:
      "Worked with cross-functional product and design teammates across multiple web and product initiatives grounded in organizational psychology.",
    highlights: [
      "Helped redesign CoeticHR Websites 3.0 and 4.0 along with the companion People Science resource experience.",
      "Collaborated on workflow strategy for Effective Ministry 360 and product UX for the Woether project management app.",
    ],
    links: [
      { label: "CoeticHR", href: "/projects/coetic" },
      { label: "People Science", href: "/projects/people-science" },
      { label: "Effective Ministry 360", href: "/projects/effective-ministry-360" },
      { label: "Woether", href: "/projects/woether" },
    ],
  },
];

export const educationEntries: CvEntry[] = [
  {
    id: "ms-ux-msu",
    timeframe: "In Progress",
    status: "Graduate",
    title: "Master of Science in User Experience",
    organization: "Michigan State University",
    summary:
      "Graduate coursework and applied user research digging into how people connect emotionally with everyday tools, covering habit formation, music and mood, and spatial AR interfaces.",
    links: [
      { label: "Listening to Our Users", href: "/projects/listening-to-users" },
      { label: "Healthy Habits", href: "/projects/healthy-habits" },
      { label: "Style Co", href: "/projects/style-co" },
    ],
  },
  {
    id: "ba-xa-msu",
    timeframe: "Earned",
    status: "Undergraduate",
    title: "Bachelor of Arts in Experience Architecture",
    organization: "Michigan State University",
    summary:
      "Undergraduate training in human-centered research, information architecture, accessibility, and interaction design, including collaborations with MSU Libraries, Stanford University, Teach Access, and the Michigan Avenue Corridor Improvement Authority.",
    links: [
      { label: "All Aboard", href: "/projects/all-aboard" },
      { label: "Bento Box", href: "/projects/bento-box" },
      { label: "Digital Scholarship Lab", href: "/projects/dsl" },
      { label: "Michigan Avenue 2030", href: "/projects/michigan-avenue-2030" },
      { label: "Soundwriting", href: "/projects/soundwriting" },
      { label: "Finer Dining", href: "/projects/finer-dining" },
    ],
  },
];
