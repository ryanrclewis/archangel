import projectsData from "./projects-data.json";
import valueColorsData from "./value-colors.json";

export type ProjectStatus = "LIVE" | "IN PROGRESS" | "COMPLETED" | "UNSUPPORTED" | "DEPRECATED" | "BETA";

export type ProjectClientTone = "ink" | "muted" | "blue" | "green" | "amber" | "red" | "purple";

export type ProjectClient = {
  name: string;
  tone?: ProjectClientTone;
};

export type ProjectPhraseChip = {
  text: string;
  tone?: ProjectClientTone;
};

export type ProjectValue = {
  text: string;
  color?: string;
  tone?: ProjectClientTone;
};

export type ProjectEmbed = {
  src: string;
  title?: string;
  width?: number;
  height?: number;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectSection = "bespoke" | "government" | "industry" | "research";

export type ProjectDegree =
  | "Bachelor of Arts in Experience Architecture, Michigan State University"
  | "Master of Science in User Experience, Michigan State University";

export type Project = {
  id: string;
  /** When true, the project is excluded from listings and has no detail page. */
  hidden?: boolean;
  featured?: boolean;
  featuredOrder?: number;
  whatItProves?: string;
  archived?: boolean;
  section?: ProjectSection;
  degree?: ProjectDegree;
  version?: string;
  name: string;
  type: string;
  status: ProjectStatus;
  /** Concise 1-sentence tagline shown on project cards. */
  tagline?: string;
  description: string;
  url?: string;
  externalLinks?: ProjectLink[];
  clients?: ProjectClient[];
  // `values` are the new project-associated phrases.
  values?: ProjectValue[];
  features?: string[];
  launchDate?: string;
  embed?: ProjectEmbed;
  /** Optional long-form Markdown case study rendered on the project detail page. */
  caseStudy?: string;
  /** Admin-only flag indicating this project needs more information to serve as a strong portfolio piece. */
  needsWork?: boolean;
  /** Admin-only suggestions for strengthening this project for university and Big Tech roles. */
  portfolioSuggestions?: string[];
};

// helper: normalize a text or ProjectValue into a ProjectValue, using explicit colors map
const normalizeValueItem = (item: string | ProjectValue, tone?: ProjectClientTone): ProjectValue => {
  if (typeof item === "string") {
    const text = item;
    return { text, color: valueColors[text], tone };
  }
  return { text: item.text, color: item.color ?? valueColors[item.text], tone: item.tone ?? tone };
};

export const valueColors: Partial<Record<string, string>> = valueColorsData;

function resolveProjectValues(project: Project) {
  const tone = project.clients?.[0]?.tone ?? "muted";
  if (project.values && project.values.length) {
    return project.values.map((v) => normalizeValueItem(v, tone));
  }

  const fallback = ["magnificent humanity"];
  return fallback.map((text) => normalizeValueItem(text, tone));
}

const baseProjects: Project[] = projectsData as Project[];

export const projects: Project[] = baseProjects
  .filter((project) => !project.hidden)
  .map((project) => ({
    ...project,
    values: resolveProjectValues(project),
  }));

export const homepageExampleIds = new Set([
  "saintstombs",
  "heirloom",
  "wwat-modernization",
  "digital-guidelines",
  "gm",
  "nsfm",
  "listening-to-users",
  "healthy-habits",
]);

export function getActiveProjects() {
  return projects.filter((project) => !project.archived);
}

export function getFeaturedProjects() {
  return projects
    .filter((project) => !project.archived && project.featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

export function getArchivedProjects() {
  return projects.filter((project) => Boolean(project.archived));
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getProjectIds() {
  return projects.map((project) => project.id);
}

export function getProjectLaunchLabel(project: Project) {
  return project.launchDate ?? (project.status === "IN PROGRESS" ? "IN PROGRESS" : project.status);
}

export type ProjectTag = {
  name: string;
  slug: string;
  color?: string;
  count: number;
};

export function tagToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MINOR_TITLE_WORDS = new Set(["of", "on", "in", "to", "for", "and", "the", "a", "an"]);

export function formatTagTitle(name: string): string {
  const words = name.trim().split(/\s+/);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && MINOR_TITLE_WORDS.has(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getAllProjectTags(): ProjectTag[] {
  const counts = new Map<string, ProjectTag>();

  for (const project of projects) {
    const seen = new Set<string>();
    for (const val of project.values ?? []) {
      const name = val.text?.trim();
      if (!name) continue;
      const slug = tagToSlug(name);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      const existing = counts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(slug, {
          name,
          slug,
          color: val.color ?? valueColors[name],
          count: 1,
        });
      }
    }
  }

  return Array.from(counts.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
}

export function getTagBySlug(slug: string): ProjectTag | undefined {
  const normalized = tagToSlug(slug);
  const activeTag = getAllProjectTags().find((t) => t.slug === normalized);
  if (activeTag) return activeTag;

  for (const [name, color] of Object.entries(valueColors)) {
    if (tagToSlug(name) === normalized) {
      return { name, slug: normalized, color, count: 0 };
    }
  }
  return undefined;
}

export function getProjectsByTagSlug(slug: string): Project[] {
  const normalized = tagToSlug(slug);
  return projects.filter((project) =>
    (project.values ?? []).some((val) => tagToSlug(val.text ?? "") === normalized)
  );
}
