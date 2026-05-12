import type { ProjectClient } from "@/app/data/projects";

type ProjectClientsProps = {
  clients: ProjectClient[];
  className?: string;
  ariaLabel?: string;
};

export function ProjectClients({ clients, className, ariaLabel = "Clients" }: ProjectClientsProps) {
  const visibleClients = clients.filter((client) => client.name.trim().toLowerCase() !== "self-directed");

  if (!visibleClients.length) {
    return null;
  }

  return (
    <ul className={className ? `client-list ${className}` : "client-list"} aria-label={ariaLabel}>
      {visibleClients.map((client) => (
        <li key={`${client.name}-${client.tone ?? "muted"}`}>
          <span className="client-chip" data-tone={client.tone ?? "muted"}>
            {client.name}
          </span>
        </li>
      ))}
    </ul>
  );
}