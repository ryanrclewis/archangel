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
import { getTagEncyclical } from "@/app/data/tag-encyclicals";
import { formatUppercaseLabel } from "@/app/utils/brandText";
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
  const encyclical = getTagEncyclical(tag.slug);
  return {
    title: `${title} | Archangel Laboratories`,
    description:
      encyclical?.description ??
      `Projects ordered toward ${tag.name} from Archangel Laboratories.`,
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
  const encyclical = getTagEncyclical(tag.slug);
  const tagAccentVars = getValueHoverVars(tag.name, tag.color);

  return (
    <PageLayout>
      <div className="tag-page">
        <section className="tag-hero" aria-labelledby="tag-page-title">
          <div className="tag-hero-eyebrow">
            <span
              className="client-chip"
              style={getPhraseChipStyle(tag.name, tag.color)}
            >
              {displayTitle}
            </span>
            <span className="tag-hero-count">
              {matchingProjects.length}{" "}
              {matchingProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          <h1 id="tag-page-title">{displayTitle}</h1>
          <p className="tag-hero-description">
            {encyclical
              ? encyclical.description
              : `Work across Archangel Laboratories shaped by ${tag.name}.`}
          </p>
          {encyclical && (
            <div className="tag-encyclical-cta" style={tagAccentVars}>
              <a
                href={encyclical.href}
                className="tag-encyclical-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  Read <em>{encyclical.documentTitle}</em> ({encyclical.author}, {encyclical.year})
                </span>
              </a>
            </div>
          )}

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
                  <span>{formatTagTitle(item.name)}</span>
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
                    data-project={project.id}
                    style={projectTitleHoverStyle(project)}
                  >
                    <div className="project-card-topline">
                      <span>
                        {project.section ? `${formatUppercaseLabel(project.section)} · ` : ""}
                        {formatUppercaseLabel(project.type)}
                      </span>
                      <span className="project-card-topline-end">
                        {isFeatured && <span className="featured-badge">Featured</span>}
                        {project.emoji && (
                          <span className="project-card-emoji" aria-hidden="true">
                            {project.emoji}
                          </span>
                        )}
                      </span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.tagline || project.description}</p>
                    {isFeatured && project.whatItProves && (
                      <p className="what-it-proves">
                        <strong>Proves:</strong> {project.whatItProves}
                      </p>
                    )}
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
