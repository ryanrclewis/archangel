import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ProjectClients } from "@/app/components/ProjectClients";
import { ProjectPreviewCard } from "@/app/components/ProjectPreviewCard";
import { getArchivedProjects, type Project } from "@/app/data/projects";
import { getValueHoverVars } from "@/app/utils/phraseStyles";

export const metadata: Metadata = {
  title: "Project Archive | Archangel Laboratories",
  description: "Archived research, explorations, and legacy systems from Archangel Laboratories.",
};

function projectTitleHoverStyle(project: Project): React.CSSProperties {
  const firstValue = project.values?.[0];
  return firstValue?.text ? getValueHoverVars(firstValue.text, firstValue.color) : {};
}

export default function ArchivePage() {
  const archivedProjects = getArchivedProjects();

  return (
    <main className="site-shell min-h-screen">
      <SiteHeader />

      <section className="archive-band" aria-labelledby="archive-page-title">
        <div className="section-heading">
          <h1 id="archive-page-title">Historical &amp; Legacy Records</h1>
          <p className="lede">
            Explorations, earlier system versions, and legacy research retained for reference. All archived projects remain indexed and searchable via <kbd className="search-hint">⌘K</kbd>.
          </p>
        </div>

        {archivedProjects.length === 0 ? (
          <div className="archive-empty">
            <p>No projects are currently archived. Active work is listed on the home page.</p>
          </div>
        ) : (
          <div className="archive-list">
            {archivedProjects.map((project) => {
              const tone = project.clients?.[0]?.tone ?? "muted";
              return (
                <ProjectPreviewCard
                  key={project.id}
                  project={project}
                  className="archive-row"
                  data-tone={tone}
                  style={projectTitleHoverStyle(project)}
                >
                  <div className="row-copy">
                    <span className="archive-name">{project.name}</span>
                    <ProjectClients
                      values={project.values ?? []}
                      className="row-clients"
                      ariaLabel={`${project.name} phrases`}
                    />
                  </div>
                  <span className="archive-type">{project.type}</span>
                </ProjectPreviewCard>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
