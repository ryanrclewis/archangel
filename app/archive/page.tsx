import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/app/components/PageLayout";
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
    <PageLayout>
      <section className="archive-band" aria-labelledby="archive-page-title">
        <div className="section-heading">
          <h1 id="archive-page-title">Project Archive</h1>
          <p className="lede">
            Earlier explorations, older system versions, and past research kept here for reference. Everything in the archive is still indexed and searchable with <kbd className="search-hint">⌘K</kbd>.
          </p>
        </div>

        {archivedProjects.length === 0 ? (
          <div className="archive-empty">
            <p>Nothing is in the archive right now. All current work is listed on the home page.</p>
            <Link href="/" className="button-secondary">
              Back to all work
            </Link>
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
    </PageLayout>
  );
}
