import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
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
    <main className="site-shell min-h-screen">
      <SiteHeader />

      <article className="project-detail">
        <header className="detail-hero">
          <p className="eyebrow">{project.folder}</p>
          <h1>{project.name}</h1>
          <div className="detail-meta">
            <span>{project.type}</span>
            <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
          </div>
          <p className="lede">{project.description}</p>
        </header>

        <div className="detail-grid">
          {project.features?.length ? (
            <section className="detail-section" aria-labelledby="highlights-title">
              <div className="section-heading compact">
                <p className="eyebrow">Project record</p>
                <h2 id="highlights-title">Highlights</h2>
              </div>
              <ul className="feature-list">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.tags?.length ? (
            <section className="detail-section" aria-labelledby="tags-title">
              <div className="section-heading compact">
                <p className="eyebrow">Index terms</p>
                <h2 id="tags-title">Tags</h2>
              </div>
              <ul className="tag-list spacious">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="detail-section" aria-labelledby="resources-title">
            <div className="section-heading compact">
              <p className="eyebrow">Resources</p>
              <h2 id="resources-title">Links</h2>
            </div>
            <div className="action-row">
              <Link href="/" className="button-secondary">
                Back to archive
              </Link>
              {project.url ? (
                <a href={project.url} className="button-primary" target="_blank" rel="noreferrer">
                  Open project
                </a>
              ) : null}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
