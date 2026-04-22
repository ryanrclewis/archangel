import type { Project } from "../data/projects";

export function statusIntent(status: Project["status"]): "success" | "warning" | "none" {
  if (status === "LIVE" || status === "ONLINE") return "success";
  if (status === "IN PROGRESS") return "warning";
  return "none";
}
