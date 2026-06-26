import projectsData from "./projects-data.json";
import valueColorsData from "./value-colors.json";

export type ProjectStatus = "LIVE" | "IN PROGRESS" | "COMPLETED";

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

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getProjectIds() {
  return projects.map((project) => project.id);
}

export function getProjectLaunchLabel(project: Project) {
  return project.launchDate ?? (project.status === "IN PROGRESS" ? "IN PROGRESS" : project.status);
}
