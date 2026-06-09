import { SiteHeader } from "@/app/components/SiteHeader";
import { PageLayout } from "@/app/components/PageLayout";
import { ProjectClients } from "@/app/components/ProjectClients";
import { ProjectPreviewCard } from "@/app/components/ProjectPreviewCard";
import Typewriter from "./components/Typewriter";
import { getProjectLaunchLabel, projects, type Project } from "./data/projects";
import typewriterPhrases from "./data/typewriter-phrases.json";

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function launchDateToTimestamp(launchDate?: string) {
  if (!launchDate?.trim()) return Number.NEGATIVE_INFINITY;
  const parts = launchDate.trim().split(/\s+/);
  if (parts.length !== 2) return Number.NEGATIVE_INFINITY;
  const monthToken = parts[0].slice(0, 3).toLowerCase();
  const year = Number(parts[1]);
  const month = MONTH_INDEX[monthToken];
  if (Number.isNaN(year) || month === undefined) return Number.NEGATIVE_INFINITY;
  return Date.UTC(year, month, 1);
}

function sortProjectsByLaunchDateDesc(projectList: Project[]) {
  return [...projectList].sort(
    (a, b) => launchDateToTimestamp(b.launchDate) - launchDateToTimestamp(a.launchDate),
  );
}

const ourWorkSorted     = sortProjectsByLaunchDateDesc(projects.filter((p) => p.section === "bespoke"));
const publicSystems     = sortProjectsByLaunchDateDesc(projects.filter((p) => p.section === "government"));
const industryProjects  = sortProjectsByLaunchDateDesc(projects.filter((p) => p.section === "industry"));
const universityProjects = sortProjectsByLaunchDateDesc(projects.filter((p) => p.section === "research"));

const principles = [
  {
    title: "Design with dignity",
    text: "Tools should respect the people that use them. We don't build what we wouldn't use.",
  },
  {
    title: "Craft with clients",
    text: "Small details matter. We value your vision and work with you to implement it.",
  },
  {
    title: "Lead with longevity",
    text: "We take on projects that are timeless and offer support to match.",
  },
];

function statusClass(status: string) {
  if (status === "LIVE" || status === "ONLINE") return "status-live";
  if (status === "IN PROGRESS") return "status-progress";
  return "status-complete";
}

function projectHref(project: Project) {
  return `/projects/${project.id}`;
}

function projectTitleHoverStyle(project: Project): React.CSSProperties {
  const valueColor = project.values?.[0]?.color;
  return valueColor ? ({ ["--value-hover-color"]: valueColor } as React.CSSProperties) : {};
}

export default function Home() {
  return (
    <PageLayout>
      <section className="hero-band" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">🖥️ Technology with Telos</p>
          <h1 id="home-title">
            Technology in service of{"\u00A0"}
            <br />
            <Typewriter phrases={typewriterPhrases} />
          </h1>
          <p className="lede">
            Archangel Laboratories designs and builds technology for families, communities, teams, and public
            institutions that seek tools ordered to human flourishing and the common good.
          </p>
          <div className="action-row">
            <a className="button-primary" href="mailto:contact@archangel-labs.com">
              Start a project
            </a>
            <a className="button-secondary" href="#work">
              View work
            </a>
          </div>
        </div>
      </section>

      <section className="principles-band" id="principles" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">🪨 Principles</p>
          <h2 id="principles-title">Our foundation</h2>
        </div>

        <div className="principles-grid">
          {principles.map((principle, index) => (
            <article className="principle-item" key={principle.title}>
              <span>{(index + 1).toString().padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="work-band" id="bespoke" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">🧵 Bespoke</p>
          <h2 id="work-title">Our tailored solutions for unique clients</h2>
        </div>

        <div className="project-grid">
          {ourWorkSorted.map((project) => {
            const tone = project.clients?.[0]?.tone ?? "muted";
            return (
              <ProjectPreviewCard
                key={project.id}
                project={project}
                className="project-card"
                data-tone={tone}
                style={projectTitleHoverStyle(project)}
              >
                <div className="project-card-topline">
                  <span>{project.type}</span>
                  <span className={`status-text ${statusClass(project.status)}`}>{getProjectLaunchLabel(project)}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <ProjectClients
                  values={project.values ?? []}
                  className="project-card-clients"
                  ariaLabel={`${project.name} phrases`}
                />
              </ProjectPreviewCard>
            );
          })}
        </div>
      </section>

      <section className="systems-band" id="government" aria-labelledby="systems-title">
        <div className="section-heading">
          <p className="eyebrow">🏛️ Government</p>
          <h2 id="systems-title">Our public service</h2>
        </div>

        <div className="systems-list">
          {publicSystems.slice(0, 8).map((project) => {
            const tone = project.clients?.[0]?.tone ?? "muted";
            return (
              <ProjectPreviewCard
                key={project.id}
                project={project}
                className="system-row"
                data-tone={tone}
                style={projectTitleHoverStyle(project)}
              >
                <span>{project.status}</span>
                <div className="row-copy">
                  <strong>{project.name}</strong>
                  <ProjectClients
                    values={project.values ?? []}
                    className="row-clients"
                    ariaLabel={`${project.name} phrases`}
                  />
                </div>
                <em>{project.type}</em>
              </ProjectPreviewCard>
            );
          })}
        </div>
      </section>

      <section className="archive-band" id="industry" aria-labelledby="archive-title">
        <div className="section-heading">
          <p className="eyebrow">🏭 Industry</p>
          <h2 id="archive-title">Our work with industrial partners</h2>
        </div>

        <div className="archive-list">
          {industryProjects.map((project) => {
              const tone = project.clients?.[0]?.tone ?? "muted";
              return (
                <ProjectPreviewCard
                  key={project.id}
                  project={project}
                  className="archive-row"
                  data-tone={tone}
                  style={projectTitleHoverStyle(project)}
                >
                  <span className={`status-text ${statusClass(project.status)}`}>{getProjectLaunchLabel(project)}</span>
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
      </section>

      <section className="university-band" id="research" aria-labelledby="university-title">
        <div className="section-heading">
          <p className="eyebrow">📚 Research</p>
          <h2 id="university-title">Our experiments and explorations</h2>
        </div>

        <div className="university-list">
          {universityProjects.map((project) => {
            const tone = project.clients?.[0]?.tone ?? "muted";
            return (
              <ProjectPreviewCard
                key={project.id}
                project={project}
                className="archive-row"
                data-tone={tone}
                style={projectTitleHoverStyle(project)}
              >
                <span className={`status-text ${statusClass(project.status)}`}>{getProjectLaunchLabel(project)}</span>
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
      </section>

      <footer className="site-footer">
        <p>Designed and engineered by Archangel Laboratories.</p>
        <a href="mailto:contact@archangel-labs.com">contact@archangel-labs.com</a>
        <a href="https://x.com/ArchangelLabs" target="_blank" rel="noopener noreferrer">@ArchangelLabs</a>
      </footer>
    </PageLayout>
  );
}
