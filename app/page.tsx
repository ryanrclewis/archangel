import Image from "next/image";
import { SiteHeader } from "@/app/components/SiteHeader";
import Typewriter from "@/app/components/Typewriter";
import { projects, type Project } from "./data/projects";

const ourWork = projects.filter((project) => project.folder === "Our Work");
const pastWork = projects.filter((project) => project.folder === "Past Work");
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
const activeWork = projects.filter(
  (project) => project.status === "LIVE" || project.status === "ONLINE" || project.status === "IN PROGRESS",
);

const principles = [
  {
    title: "Dignity first",
    text: "Systems should respect the time, attention, and judgment of the people who depend on them.",
  },
  {
    title: "Craft at service scale",
    text: "Small details matter most when the work has to survive repeated use, public scrutiny, and real constraints.",
  },
  {
    title: "Durable delivery",
    text: "Clear architecture, plain language, and accessible interfaces are treated as one operating discipline.",
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
    <main className="site-shell min-h-screen">
      <SiteHeader />

      <section className="hero-band" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Technology with Telos</p>
          <h1 id="home-title">
            Technology in service of{'\u00A0'}<br />
            <Typewriter
              phrases={[
                "human dignity.",
                "the pursuit of happiness.",
                "the common defense.",
                "the general welfare.",
              ]}
            />
          </h1>
          <p className="lede">
            Archangel Laboratories designs and builds technology for families, communities, teams, and public institutions that seek tools ordered to human flourishing and the common good.
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

      <section className="work-band" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">Current work</p>
          <h2 id="work-title">Useful systems, plainly named and built for real life.</h2>
        </div>

        <div className="project-grid">
          {ourWork.map((project) => (
            <a
              key={project.id}
              className="project-card"
              href={projectHref(project)}
              target={projectTarget(project)}
              rel={projectTarget(project) ? "noreferrer" : undefined}
            >
              <div className="project-card-topline">
                <span>{project.type}</span>
                <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              {project.status === "COMPLETED" ? (
                <div className="launch-date">
                  <span>Completed:</span> {project.launchDate}
                </div>
              ) : project.tags?.length ? (
                <ul className="tag-list" aria-label={`${project.name} tags`}>
                  {project.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </a>
          ))}
        </div>
      </section>

      <section className="principles-band" id="principles" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">Operating principles</p>
          <h2 id="principles-title">A studio posture for civic-grade software.</h2>
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

      <section className="systems-band" aria-labelledby="systems-title">
        <div className="section-heading">
          <p className="eyebrow">Public service work</p>
          <h2 id="systems-title">Modernization experience across government workflows.</h2>
        </div>

        <div className="systems-list">
          {publicSystems.slice(0, 8).map((project) => (
            <a className="system-row" href={`/projects/${project.id}`} key={project.id}>
              <span>{project.status}</span>
              <strong>{project.name}</strong>
              <em>{project.type}</em>
            </a>
          ))}
        </div>
      </section>

      <section className="archive-band" id="archive" aria-labelledby="archive-title">
        <div className="section-heading">
          <p className="eyebrow">Studio archive</p>
          <h2 id="archive-title">Selected work, experiments, and shipped projects.</h2>
        </div>

        <div className="archive-list">
          {pastWork
            .filter((project) =>
              !project.type.includes("Government") &&
              project.id !== "digital-standards" &&
              project.id !== "digital-guidelines" &&
              !universityIds.includes(project.id)
            )
            .map((project) => (
              <a className="archive-row" href={`/projects/${project.id}`} key={project.id}>
                <span className={`status-text ${statusClass(project.status)}`}>{project.launchDate || project.status}</span>
                <span className="archive-name">{project.name}</span>
                <span className="archive-type">{project.type}</span>
              </a>
            ))}
        </div>
      </section>

      <section className="university-band" aria-labelledby="university-title">
        <div className="section-heading">
          <p className="eyebrow">University Projects</p>
          <h2 id="university-title">Selected university and research work.</h2>
        </div>

        <div className="university-list">
          {universityProjects.map((project) => (
            <a className="archive-row" href={`/projects/${project.id}`} key={project.id}>
              <span className={`status-text ${statusClass(project.status)}`}>{project.launchDate || project.status}</span>
              <span className="archive-name">{project.name}</span>
              <span className="archive-type">{project.type}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>Designed and engineered by Archangel Laboratories.</p>
        <a href="mailto:contact@archangel-labs.com">contact@archangel-labs.com</a>
      </footer>
    </main>
  );
}
