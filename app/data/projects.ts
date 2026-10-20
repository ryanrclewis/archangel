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

export type CaseStudyMedia =
  | {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}
  | {
  type: "video";
  src: string;
  alt: string;
  caption?: string;
  poster: string;
};

export type CaseStudy = {
  summary?: string;
  problem?: string;
  users?: string;
  constraints?: string;
  role?: string;
  keyDecisions?: Array<{ title: string; rationale: string }>;
  process?: string;
  artifacts?: CaseStudyMedia[];
  outcome?: string;
  reflection?: string;
  todo?: string;
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
  description: string;
  url?: string;
  externalLinks?: ProjectLink[];
  clients?: ProjectClient[];
  // `values` are the new project-associated phrases.
  values?: ProjectValue[];
  features?: string[];
  launchDate?: string;
  embed?: ProjectEmbed;
  caseStudy?: CaseStudy;
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

function normalizeStudioVoice(text: string) {
  return text
    .replace(/\bI approached\b/g, "We approached")
    .replace(/\bI worked\b/g, "We worked")
    .replace(/\bI opted\b/g, "we opted")
    .replace(/\bI used\b/g, "We used")
    .replace(/\bI relied\b/g, "We relied")
    .replace(/\bI made\b/g, "we made")
    .replace(/\bI would have\b/g, "we would have")
    .replace(/\bI followed\b/g, "We followed")
    .replace(/\bI redeveloped\b/g, "We redeveloped")
    .replace(/\bI rebuilt\b/g, "We rebuilt")
    .replace(/\bI supported\b/g, "We supported")
    .replace(/\bI delivered\b/g, "We delivered")
    .replace(/\bI contributed\b/g, "We contributed")
    .replace(/\bmy state agency\b/g, "our state agency")
    .replace(/\bmy experience\b/g, "our experience");
}

export const projects: Project[] = baseProjects
  .filter((project) => !project.hidden)
  .map((project) => ({
    ...project,
    description: normalizeStudioVoice(project.description),
    caseStudy: project.caseStudy
      ? {
          ...project.caseStudy,
          summary: project.caseStudy.summary ? normalizeStudioVoice(project.caseStudy.summary) : undefined,
          problem: project.caseStudy.problem ? normalizeStudioVoice(project.caseStudy.problem) : undefined,
          process: project.caseStudy.process ? normalizeStudioVoice(project.caseStudy.process) : undefined,
          outcome: project.caseStudy.outcome ? normalizeStudioVoice(project.caseStudy.outcome) : undefined,
          reflection: project.caseStudy.reflection ? normalizeStudioVoice(project.caseStudy.reflection) : undefined,
          role: project.caseStudy.role ? normalizeStudioVoice(project.caseStudy.role) : undefined,
        }
      : undefined,
    values: resolveProjectValues(project),
  }));

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
