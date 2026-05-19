import { projects, type Project } from "@/app/data/projects";

export function searchProjects(query: string): Project[] {
  if (!query.trim()) {
    return projects;
  }

  const lowerQuery = query.toLowerCase();

  return projects.filter((project) => {
    // Search in name
    if (project.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in description
    if (project.description.toLowerCase().includes(lowerQuery)) return true;

    // Search in type
    if (project.type.toLowerCase().includes(lowerQuery)) return true;

    // Search in client names
    if (project.clients?.some((client) => client.name.toLowerCase().includes(lowerQuery)))
      return true;

    // Search in project values
    if (project.values?.some((val) => val.text.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}
