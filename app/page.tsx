import { SiteHeader } from "@/app/components/SiteHeader";
import { PageLayout } from "@/app/components/PageLayout";
import { ProjectClients } from "@/app/components/ProjectClients";
import Typewriter from "./components/Typewriter";
import { getProjectLaunchLabel, projects, type Project } from "./data/projects";

const firstCompletedIndex = projects.findIndex((project) => project.status === "COMPLETED");
const ourWork = firstCompletedIndex >= 0 ? projects.slice(0, firstCompletedIndex) : projects;
const pastWork = firstCompletedIndex >= 0 ? projects.slice(firstCompletedIndex).filter((project) => project.id !== "contact") : [];
const publicSystems = pastWork.filter(
  (project) => project.type.includes("Government") || project.type.includes("Design System"),
);
const finerIndex = pastWork.findIndex((p) => p.id === "finer-dining");
const alloIndex = pastWork.findIndex((p) => p.id === "allo-redesign");
const universityProjects =
  finerIndex >= 0 && alloIndex >= 0 && alloIndex >= finerIndex
    ? pastWork.slice(finerIndex, alloIndex + 1).filter((p) => p.id !== "coetic-3")
    : [];
const universityIds = universityProjects.map((p) => p.id);

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
  return project.url ?? `/projects/${project.id}`;
}

function projectTarget(project: Project) {
  return project.url?.startsWith("http") ? "_blank" : undefined;
}

export default function Home() {
  return (
    <PageLayout>
      <section className="hero-band" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Technology with Telos</p>
          <h1 id="home-title">
            Technology in service of{"\u00A0"}
            <br />
            <Typewriter
              phrases={[
                "magnificent humanity.",
                "our common home.",
                "a successful life.",
                "a fruitful life.",
                "fraternity.", 
                "love.",
                "hope.",
                "charity.",
                "truth.",
                "labor.",
                "capital.",
                "faith.",
                "reason.",
                "life.",
                "liberty.",
                "the pursuit of happiness.",
                "the common defense.",
                "the general welfare.",
                "domestic tranquility.",
                "our posterity.",
                "the United States of America.",
              ]}
            />
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
          <p className="eyebrow">Principles</p>
          <h2 id="principles-title">Our foundational values</h2>
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
          <p className="eyebrow">Bespoke</p>
          <h2 id="work-title">Our tailored solutions for unique clients</h2>
        </div>

        <div className="project-grid">
          {ourWork.map((project) => {
            const tone = project.clients?.[0]?.tone ?? "muted";
            return (
              <a
                key={project.id}
                className="project-card"
                data-tone={tone}
                href={projectHref(project)}
                target={projectTarget(project)}
                rel={projectTarget(project) ? "noreferrer" : undefined}
              >
                <div className="project-card-topline">
                  <span>{project.type}</span>
                  <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
                </div>
                <ProjectClients
                  clients={project.clients ?? []}
                  className="project-card-clients"
                  ariaLabel={`${project.name} clients`}
                />
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {project.tags?.length ? (
                  <ul className="tag-list" aria-label={`${project.name} tags`}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </a>
            );
          })}
        </div>
      </section>

      <section className="systems-band" id="government" aria-labelledby="systems-title">
        <div className="section-heading">
          <p className="eyebrow">Government</p>
          <h2 id="systems-title">Our public service</h2>
        </div>

        <div className="systems-list">
          {publicSystems.slice(0, 8).map((project) => {
            const tone = project.clients?.[0]?.tone ?? "muted";
            return (
              <a className="system-row" data-tone={tone} href={`/projects/${project.id}`} key={project.id}>
                <span>{project.status}</span>
                <div className="row-copy">
                  <strong>{project.name}</strong>
                  <ProjectClients
                    clients={project.clients ?? []}
                    className="row-clients"
                    ariaLabel={`${project.name} clients`}
                  />
                </div>
                <em>{project.type}</em>
              </a>
            );
          })}
        </div>
      </section>

      <section className="archive-band" id="industry" aria-labelledby="archive-title">
        <div className="section-heading">
          <p className="eyebrow">Industry</p>
          <h2 id="archive-title">Our work with industrial partners</h2>
        </div>

        <div className="archive-list">
          {pastWork
            .filter((project) =>
              !project.type.includes("Government") &&
              project.id !== "digital-standards" &&
              project.id !== "digital-guidelines" &&
              !universityIds.includes(project.id)
            )
            .map((project) => {
              const tone = project.clients?.[0]?.tone ?? "muted";
              return (
                <a className="archive-row" data-tone={tone} href={`/projects/${project.id}`} key={project.id}>
                  <span className={`status-text ${statusClass(project.status)}`}>{getProjectLaunchLabel(project)}</span>
                  <div className="row-copy">
                    <span className="archive-name">{project.name}</span>
                    <ProjectClients
                      clients={project.clients ?? []}
                      className="row-clients"
                      ariaLabel={`${project.name} clients`}
                    />
                  </div>
                  <span className="archive-type">{project.type}</span>
                </a>
              );
            })}
        </div>
      </section>

      <section className="university-band" id="research" aria-labelledby="university-title">
        <div className="section-heading">
          <p className="eyebrow">Research</p>
          <h2 id="university-title">Our experiments and explorations</h2>
        </div>

        <div className="university-list">
          {universityProjects.map((project) => {
            const tone = project.clients?.[0]?.tone ?? "muted";
            return (
              <a className="archive-row" data-tone={tone} href={`/projects/${project.id}`} key={project.id}>
                <span className={`status-text ${statusClass(project.status)}`}>{getProjectLaunchLabel(project)}</span>
                <div className="row-copy">
                  <span className="archive-name">{project.name}</span>
                  <ProjectClients
                    clients={project.clients ?? []}
                    className="row-clients"
                    ariaLabel={`${project.name} clients`}
                  />
                </div>
                <span className="archive-type">{project.type}</span>
              </a>
            );
          })}
        </div>
      </section>

      <footer className="site-footer">
        <p>Designed and engineered by Archangel Laboratories.</p>
        <a href="mailto:contact@archangel-labs.com">contact@archangel-labs.com</a>
      </footer>
    </PageLayout>
  );
}
