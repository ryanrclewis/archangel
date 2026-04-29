import { projects } from "./data/projects";

const ourWork = projects.filter((project) => project.folder === "Our Work");
const pastWork = projects.filter((project) => project.folder === "Past Work");
void pastWork;

function statusClass(status: string) {
  if (status === "LIVE" || status === "ONLINE") return "status-live";
  if (status === "IN PROGRESS") return "status-progress";
  return "status-complete";
}

function statusLabel(status: string) {
  if (status === "LIVE" || status === "ONLINE") return "Live";
  if (status === "IN PROGRESS") return "In Progress";
  return "Completed";
}

export default function Home() {
  return (
    <>
      {/* Navigation Bar */}
      <header className="nav-bar">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <span className="text-base font-semibold tracking-tight" style={{ color: "var(--on-surface)" }}>
            Archangel Laboratories
          </span>
          <a className="hig-btn" href="mailto:contact@archangel-labs.com">
            Contact
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-14">
        {/* Hero */}
        <section className="mb-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
            Technology with Telos
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--on-surface)", letterSpacing: "-0.025em" }}>
            Building technology<br className="hidden sm:block" /> in service of human dignity.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "var(--secondary)" }}>
            Archangel Laboratories designs and builds software that puts people first. We focus on Catholic culture, family, and community — work that matters.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="hig-btn" href="mailto:contact@archangel-labs.com">
              Get in Touch
            </a>
          </div>
        </section>

        {/* Divider */}
        <div className="mb-12 h-px" style={{ background: "var(--border)" }} />

        {/* Our Work */}
        <section>
          <h2 className="hig-section-title mb-8">Our Work</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {ourWork.map((project) => (
              <article key={project.id} className="hig-card flex flex-col p-5">
                {/* Card header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold leading-snug" style={{ color: "var(--on-surface)" }}>
                      {project.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium" style={{ color: "var(--secondary)" }}>
                      {project.type}
                    </p>
                  </div>
                  <span className={`status-chip shrink-0 ${statusClass(project.status)}`}>
                    {statusLabel(project.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="grow text-sm leading-relaxed" style={{ color: "var(--on-surface)", opacity: 0.75 }}>
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {project.url && (
                  <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-inline"
                      aria-label={`Visit ${project.name} (opens in new tab)`}
                    >
                      Visit Project
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 10L10 2M10 2H4.5M10 2V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <p className="text-sm" style={{ color: "var(--secondary)" }}>
            © {new Date().getFullYear()} Archangel Laboratories
          </p>
          <a href="mailto:contact@archangel-labs.com" className="link-inline text-sm">
            contact@archangel-labs.com
          </a>
        </div>
      </footer>
    </>
  );
}

