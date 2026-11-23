import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageLayout } from "@/app/components/PageLayout";
import { ProjectClients } from "@/app/components/ProjectClients";
import { ProjectPreviewCard } from "@/app/components/ProjectPreviewCard";
import {
  formatTagTitle,
  getAllProjectTags,
  getProjectsByTagSlug,
  getTagBySlug,
  type Project,
} from "@/app/data/projects";
import { getPhraseChipStyle, getValueHoverVars } from "@/app/utils/phraseStyles";
import "./tag.css";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllProjectTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tag = getTagBySlug(tagSlug);
  if (!tag) return { title: "Tag Not Found | Archangel Laboratories" };

  const title = formatTagTitle(tag.name);
  return {
    title: `${title} | Archangel Laboratories`,
    description: `Projects ordered toward ${tag.name} from Archangel Laboratories.`,
  };
}

function projectTitleHoverStyle(project: Project): React.CSSProperties {
  const firstValue = project.values?.[0];
  return firstValue?.text ? getValueHoverVars(firstValue.text, firstValue.color) : {};
}

export default async function TagPage({ params }: PageProps) {
  const { tag: tagSlug } = await params;
  const tag = getTagBySlug(tagSlug);

  if (!tag) notFound();

  const matchingProjects = getProjectsByTagSlug(tag.slug);
  const allTags = getAllProjectTags();
  const displayTitle = formatTagTitle(tag.name);

  return (
    <PageLayout>
      <div className="tag-page">
        <section className="tag-hero" aria-labelledby="tag-page-title">
          <div className="tag-hero-eyebrow">
            <span
              className="client-chip"
              style={getPhraseChipStyle(tag.name, tag.color)}
            >
              {tag.name}
            </span>
            <span className="tag-hero-count">
              {matchingProjects.length}{" "}
              {matchingProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          <h1 id="tag-page-title">{displayTitle}</h1>
          <p className="tag-hero-description">
            Work across Archangel Laboratories shaped by {tag.name}.
          </p>

          <nav className="tag-switcher" aria-label="All project tags">
            {allTags.map((item) => {
              const isCurrent = item.slug === tag.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/tags/${item.slug}`}
                  className={`client-chip tag-switcher-chip ${isCurrent ? "is-current" : ""}`}
                  style={getPhraseChipStyle(item.name, item.color)}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span>{item.name}</span>
                  <span className="command-palette-tag-count">{item.count}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        <section className="tag-projects-band" aria-label={`Projects tagged ${tag.name}`}>
          {matchingProjects.length === 0 ? (
            <div className="tag-empty">
              <p>No published projects are currently tagged with &ldquo;{tag.name}&rdquo;.</p>
              <Link href="/" className="button-secondary">
                Back to all work
              </Link>
            </div>
          ) : (
            <div className="project-grid">
              {matchingProjects.map((project) => {
                const tone = project.clients?.[0]?.tone ?? "muted";
                const isFeatured = Boolean(project.featured);
                return (
                  <ProjectPreviewCard
                    key={project.id}
                    project={project}
                    className={`project-card ${isFeatured ? "project-card--featured" : ""}`}
                    data-tone={tone}
                    style={projectTitleHoverStyle(project)}
                  >
                    <div className="project-card-topline">
                      <span>
                        {project.section ? `${project.section} · ` : ""}
                        {project.type}
                      </span>
                      <span className="status-text">{project.status}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <ProjectClients
                      values={project.values ?? []}
                      className="project-card-clients"
                      ariaLabel={`${project.name} phrases`}
                    />
                    <span className="project-card-link">Learn more</span>
                  </ProjectPreviewCard>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
