import { projects } from "./data/projects";

const ourWork = projects.filter((project) => project.folder === "Our Work");
const pastWork = projects.filter((project) => project.folder === "Past Work");

function statusClass(status: string) {
  if (status === "LIVE" || status === "ONLINE") return "status-live";
  if (status === "IN PROGRESS") return "status-progress";
  return "status-complete";
}

export default function Home() {
  return (
    <main className="arch-shell min-h-screen">
      <div className="arch-backdrop" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="arch-panel rounded-xl border p-6">
          <p className="text-xs tracking-[0.35em] text-[var(--gold-dim)]">ARCHANGEL LABORATORIES</p>
          <h1 className="mt-3 text-3xl tracking-[0.08em] sm:text-5xl">PROJECT SUITE</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--gold-dim)] sm:text-base">
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs tracking-[0.2em]">
            <a className="arch-btn" href="mailto:contact@archangel-labs.com">
              CONTACT
            </a>
          </div>
        </header>

        <section className="arch-panel rounded-xl border p-6">
          <h2 className="section-title">Our Work</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ourWork.map((project) => (
              <article key={project.id} className="arch-card rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm tracking-[0.15em] text-[var(--gold)]">{project.name}</h3>
                  <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--gold-dim)]">{project.type}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--gold-soft)]">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-4">
                  {/* <a href={`/projects/${project.id}`} className="text-xs link-inline">
                    VIEW ROUTE
                  </a> */}
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noreferrer" className="text-xs link-inline">
                      VISIT PROJECT
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="arch-panel rounded-xl border p-6">
          <h2 className="section-title">Past Work</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pastWork.map((project) => (
              <article key={project.id} className="arch-card rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm tracking-[0.15em] text-[var(--gold)]">{project.name}</h3>
                  <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--gold-dim)]">{project.type}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--gold-soft)]">{project.description}</p>
                <ul className="mt-4 space-y-1 text-xs text-[var(--gold-dim)]">
                  {project.features?.slice(0, 3).map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-4">
                  {/* <a href={`/projects/${project.id}`} className="text-xs link-inline">
                    VIEW ROUTE
                  </a> */}
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noreferrer" className="text-xs link-inline">
                      VIEW
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
