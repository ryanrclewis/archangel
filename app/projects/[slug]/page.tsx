import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById, getProjectIds } from "../../data/projects";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

function statusClass(status: string) {
  if (status === "LIVE" || status === "ONLINE") return "status-live";
  if (status === "IN PROGRESS") return "status-progress";
  return "status-complete";
}

export function generateStaticParams() {
  return getProjectIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    return {
      title: "Project Not Found | Archangel",
    };
  }

  return {
    title: `${project.name} | Archangel`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: RouteProps) {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="arch-shell min-h-screen">
      <div className="arch-backdrop" />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="arch-panel rounded-xl border p-6">
          <p className="text-xs tracking-[0.3em] text-[var(--gold-dim)]">{project.folder.toUpperCase()}</p>
          <h1 className="mt-3 text-2xl tracking-[0.08em] sm:text-4xl">{project.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="tag-chip">{project.type}</span>
            <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--gold-soft)] sm:text-base">{project.description}</p>
        </header>

        {project.features?.length ? (
          <section className="arch-panel rounded-xl border p-6">
            <h2 className="section-title">Highlights</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--gold-soft)]">
              {project.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.tags?.length ? (
          <section className="arch-panel rounded-xl border p-6">
            <h2 className="section-title">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="arch-panel rounded-xl border p-6">
          <h2 className="section-title">Resources</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-xs tracking-[0.16em]">
            <a href="/" className="arch-btn">
              BACK TO SUITE
            </a>
            {project.url ? (
              <a href={project.url} className="arch-btn" target="_blank" rel="noreferrer">
                LIVE URL
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
