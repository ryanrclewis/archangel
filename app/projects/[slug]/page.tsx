import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ProjectClients } from "@/app/components/ProjectClients";
import { getProjectById, getProjectIds, getProjectLaunchLabel } from "../../data/projects";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

function formatDegree(degree: string): { abbr: string; institution: string } {
  const abbrMap: Record<string, string> = {
    "Bachelor of Arts in Experience Architecture": "B.A., Experience Architecture",
    "Master of Science in User Experience": "M.S., User Experience",
  };
  const [program, institution] = degree.split(", Michigan State University");
  return {
    abbr: abbrMap[program.trim()] ?? program.trim(),
    institution: institution ? "Michigan State University" : "",
  };
}

function statusClass(status: string) {
  if (status === "LIVE") return "status-live";
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

  const projectLinks = [
    ...(project.url ? [{ label: "Open project", href: project.url }] : []),
    ...(project.externalLinks ?? []),
  ];

  const isPortraitEmbed = Boolean(
    project.embed?.width && project.embed?.height && project.embed.width < project.embed.height,
  );

  const landscapeEmbed = project.embed && !isPortraitEmbed ? (
    <section className="detail-embed detail-embed-landscape" aria-label={`${project.name} embed`}>
      <iframe
        src={project.embed.src}
        title={project.embed.title ?? `${project.name} embed`}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.1)",
          width: "100%",
          height: project.embed.height ? `${project.embed.height}px` : "450px",
        }}
        allowFullScreen
      />
    </section>
  ) : null;

  const heroContent = (
    <div className={`detail-hero-content ${project.embed && isPortraitEmbed ? "detail-hero-content--portrait" : ""}`}>
      <div className="detail-hero-copy">
        <p className="eyebrow">Project</p>
        <h1>{project.name}</h1>
        <div className="detail-meta">
          <span>{project.type}</span>
          <span>{getProjectLaunchLabel(project)}</span>
          <span className={`status-chip ${statusClass(project.status)}`} aria-label={`Status: ${project.status}`}>
            {project.status}
          </span>
          {project.degree && (() => {
            const { abbr, institution } = formatDegree(project.degree);
            return (
              <span className="degree-meta" title={project.degree}>
                {abbr} · {institution}
              </span>
            );
          })()}
        </div>
        <ProjectClients values={project.values ?? []} className="detail-clients" ariaLabel={`${project.name} phrases`} />
        <p className="lede">{project.description}</p>
      </div>

      {project.embed && isPortraitEmbed ? (
        <section className="detail-embed detail-embed-portrait" aria-label={`${project.name} embed`}>
          <iframe
            src={project.embed.src}
            title={project.embed.title ?? `${project.name} embed`}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              width: "100%",
              height: project.embed.height ? `${project.embed.height}px` : "450px",
            }}
            allowFullScreen
          />
        </section>
      ) : null}
    </div>
  );

  return (
    <main className="site-shell min-h-screen">
      <SiteHeader />

      <article className="project-detail">
        <header className="detail-hero">{heroContent}</header>

        {landscapeEmbed}

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

          <section className="detail-section" aria-labelledby="resources-title">
            <div className="section-heading compact">
              <p className="eyebrow">Resources</p>
              <h2 id="resources-title">Links</h2>
            </div>
            <div className="action-row">
              {projectLinks.map((link) => (
                <a key={link.href} href={link.href} className="button-primary" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
