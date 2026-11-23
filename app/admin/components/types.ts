export type TypewriterPhrase = {
  text: string;
  link?: string;
  enabled?: boolean;
  _todo?: string;
};

export type ProjectStatus =
  | "LIVE"
  | "IN PROGRESS"
  | "COMPLETED"
  | "UNSUPPORTED"
  | "DEPRECATED"
  | "BETA";

export type ProjectClientTone =
  | "ink"
  | "muted"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "purple";

export type ProjectClient = { name: string; tone?: ProjectClientTone };
export type ProjectValue = { text: string; color?: string; tone?: ProjectClientTone };
export type ProjectEmbed = { src: string; title?: string; width?: number; height?: number };
export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  name: string;
  type: string;
  status: ProjectStatus;
  description: string;
  url?: string;
  clients?: ProjectClient[];
  values?: ProjectValue[];
  features?: string[];
  launchDate?: string;
  embed?: ProjectEmbed;
  hidden?: boolean;
  featured?: boolean;
  featuredOrder?: number;
  whatItProves?: string;
  archived?: boolean;
  section?: string;
  degree?: string;
  version?: string;
  externalLinks?: ProjectLink[];
  caseStudy?: string;
  needsWork?: boolean;
  portfolioSuggestions?: string[];
};

export type Theme = {
  id: string;
  name: string;
  backgroundImage: string;
  enabledPhrases: string[];
};

export type SiteConfig = {
  domain?: string;
  siteUrl?: string;
  contactEmail?: string;
  twitterHandle?: string;
  backgroundImage?: string;
  activeTheme?: string;
};

export type ToastMessage = {
  text: string;
  tone?: "success" | "info" | "error";
};

export type AdminTabId = "projects" | "themes" | "typewriter" | "background" | "colors";

export const COLOR_LABELS: Record<string, string> = {
  "--paper": "Paper",
  "--paper-warm": "Paper Warm",
  "--ink": "Ink",
  "--muted": "Muted",
  "--hairline": "Hairline",
  "--blue": "Blue",
  "--blue-dark": "Blue Dark",
  "--red": "Red",
  "--green": "Green",
  "--amber": "Amber",
  "--white": "White",
};

export type HeritageColor = { name: string; sw: string; hex: string };

export const HERITAGE_COLORS: HeritageColor[] = [
  { name: "Rookwood Jade", sw: "94283", hex: "#7d9a7a" },
  { name: "Renwick Olive", sw: "94150", hex: "#6e7349" },
  { name: "Colonial Revival Yellow", sw: "94440", hex: "#d9c98e" },
  { name: "Downing Cream", sw: "94028", hex: "#d6cba6" },
  { name: "Colonial Revival Ivory", sw: "94432", hex: "#d9cfae" },
  { name: "Rookwood Amber", sw: "94184", hex: "#c79a3f" },
  { name: "Renwick Heather", sw: "94143", hex: "#9a958c" },
  { name: "Colonial Revival Blue", sw: "94416", hex: "#91a3aa" },
  { name: "Renwick Fence Green", sw: "94119", hex: "#5f7250" },
  { name: "Tiffany Bronze", sw: "94366", hex: "#8a8741" },
  { name: "Classical White", sw: "94408", hex: "#e2dcc8" },
  { name: "Downing Straw", sw: "94077", hex: "#c4b079" },
  { name: "Renwick Yellow", sw: "94176", hex: "#c9a94e" },
  { name: "Rookwood Clay", sw: "94234", hex: "#b89b6e" },
  { name: "Renwick Beige", sw: "94101", hex: "#c2b49a" },
  { name: "Rookwood Red", sw: "94325", hex: "#7e2f23" },
  { name: "Rookwood Dark Red", sw: "94275", hex: "#5a241c" },
  { name: "Colonial Revival Gray", sw: "94424", hex: "#b6bdba" },
  { name: "Rookwood Blue Green", sw: "94218", hex: "#4f6f63" },
  { name: "Tiffany Olive", sw: "94382", hex: "#7c7d3e" },
  { name: "Downing Yellow", sw: "94085", hex: "#c9b454" },
  { name: "Rookwood Antique Gold", sw: "94192", hex: "#b29b5c" },
  { name: "Downing Sand", sw: "94044", hex: "#c7b386" },
  { name: "Rookwood Brown", sw: "94228", hex: "#8a6a45" },
  { name: "Renwick Rose Beige", sw: "94168", hex: "#c2a48d" },
  { name: "Rookwood Dark Brown", sw: "94242", hex: "#4a3a2c" },
  { name: "Downing Slate", sw: "94051", hex: "#8f9794" },
  { name: "Rookwood Sash Green", sw: "94333", hex: "#3f5642" },
  { name: "Tiffany Palm Green", sw: "94390", hex: "#5f7141" },
  { name: "Tiffany Moss Green", sw: "94374", hex: "#7b7d3f" },
  { name: "Downing Stone", sw: "94069", hex: "#9d9171" },
  { name: "Renwick Gold", sw: "94127", hex: "#b58f3e" },
  { name: "Rookwood Terra Cotta", sw: "94358", hex: "#a85a32" },
  { name: "Rookwood Medium Brown", sw: "94291", hex: "#6e5236" },
  { name: "Rookwood Shutter Green", sw: "94341", hex: "#2f4032" },
  { name: "Rookwood Dark Green", sw: "94259", hex: "#3a4a30" },
  { name: "Rookwood Dark Olive", sw: "94267", hex: "#4a4a2c" },
  { name: "Rookwood Olive", sw: "94317", hex: "#6a6238" },
  { name: "Downing Earth", sw: "94036", hex: "#6f6149" },
  { name: "Renwick Golden Oak", sw: "94135", hex: "#8a6e3c" },
];

export const STATUS_OPTIONS: ProjectStatus[] = [
  "LIVE",
  "IN PROGRESS",
  "BETA",
  "COMPLETED",
  "UNSUPPORTED",
  "DEPRECATED",
];

export const TONE_OPTIONS: ProjectClientTone[] = [
  "ink",
  "muted",
  "blue",
  "green",
  "amber",
  "red",
  "purple",
];

export const SECTION_OPTIONS = [
  { id: "bespoke", label: "Bespoke" },
  { id: "government", label: "Government" },
  { id: "industry", label: "Industry" },
  { id: "research", label: "Research" },
] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeEmptyProject(defaultSection?: string): Project {
  return {
    id: "",
    name: "",
    type: "",
    status: "IN PROGRESS",
    description: "",
    url: "",
    section: defaultSection && defaultSection !== "all" ? defaultSection : "bespoke",
    clients: [],
    values: [],
    features: [],
    externalLinks: [],
    launchDate: "",
    hidden: true,
    featured: false,
    archived: false,
  };
}
