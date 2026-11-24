import Link from "next/link";
import { HeroSection } from "@/app/components/HeroSection";
import { PageLayout } from "@/app/components/PageLayout";
import { ProjectClients } from "@/app/components/ProjectClients";
import { ProjectPreviewCard } from "@/app/components/ProjectPreviewCard";
import { ChevronRightIcon } from "@/app/components/SfSymbols";
import { homepageExampleIds, projects, valueColors, type Project } from "./data/projects";
import { formatUppercaseLabel } from "./utils/brandText";
import { getValueHoverVars } from "./utils/phraseStyles";
import allTypewriterPhrases from "./data/typewriter-phrases.json";
import themes from "./data/themes.json";
import siteConfig from "./data/site-config.json";

const activeTheme = themes.find((t) => t.id === siteConfig.activeTheme);
const typewriterPhrases = (() => {
  if (!activeTheme) {
    return allTypewriterPhrases.filter((p) => p.enabled !== false);
  }
  const preferCivicLinks = activeTheme.id === "america-250";
  const isCivicLink = (link?: string) =>
    Boolean(link && /(archives\.gov|senate\.gov)/i.test(link));

  const seen = new Map<string, (typeof allTypewriterPhrases)[number]>();
  for (const phrase of allTypewriterPhrases) {
    if (!activeTheme.enabledPhrases.includes(phrase.text)) continue;
    const existing = seen.get(phrase.text);
    if (!existing) {
      seen.set(phrase.text, phrase);
    } else if (isCivicLink(phrase.link) === preferCivicLinks && isCivicLink(existing.link) !== preferCivicLinks) {
      seen.set(phrase.text, phrase);
    }
  }
  return Array.from(seen.values());
})();

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

// Active non-archived projects for homepage
const activeProjects     = projects.filter((p) => !p.archived);
const featuredProjects   = activeProjects.filter((p) => p.featured).sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
const homepageProjects = activeProjects.filter((project) => homepageExampleIds.has(project.id));
const ourWorkSorted      = homepageProjects.filter((p) => p.section === "bespoke");
const publicSystems      = sortProjectsByLaunchDateDesc(homepageProjects.filter((p) => p.section === "government"));
const industryProjects   = sortProjectsByLaunchDateDesc(homepageProjects.filter((p) => p.section === "industry"));
const universityProjects = sortProjectsByLaunchDateDesc(homepageProjects.filter((p) => p.section === "research"));

function projectTitleHoverStyle(project: Project): React.CSSProperties {
  const firstValue = project.values?.[0];
  return firstValue?.text ? getValueHoverVars(firstValue.text, firstValue.color) : {};
}

function renderProjectCard(project: Project) {
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
        <span>{formatUppercaseLabel(project.type)}</span>
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
        ariaLabel={`${project.name} values`}
      />
      <span className="project-card-link" aria-hidden="true">
        View project
      </span>
    </ProjectPreviewCard>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <HeroSection
        phrases={typewriterPhrases}
        valueColors={valueColors}
        contactEmail={siteConfig.contactEmail}
      />

      {featuredProjects.length > 0 && (
        <section className="work-band homepage-section" id="featured" aria-labelledby="featured-title">
          <div className="section-heading">
            <h2 id="featured-title">Featured Work</h2>
          </div>
          <div className="project-grid">
            {featuredProjects.map(renderProjectCard)}
          </div>
        </section>
      )}

      <section className="work-band homepage-section" id="bespoke" aria-labelledby="work-title">
        <div className="section-heading">
          <h2 id="work-title">
            <Link href="/categories/bespoke" className="section-heading-link">
              <span>🧵 Bespoke</span>
              <span className="section-heading-chevron" aria-hidden="true">
                <ChevronRightIcon size="1em" />
              </span>
            </Link>
          </h2>
        </div>

        <div className="project-grid">
          {ourWorkSorted.map(renderProjectCard)}
        </div>
      </section>

      <section className="systems-band homepage-section" id="government" aria-labelledby="systems-title">
        <div className="section-heading">
          <h2 id="systems-title">
            <Link href="/categories/government" className="section-heading-link">
              <span>🏛️ Government</span>
              <span className="section-heading-chevron" aria-hidden="true">
                <ChevronRightIcon size="1em" />
              </span>
            </Link>
          </h2>
        </div>

        <div className="project-grid">
          {publicSystems.map(renderProjectCard)}
        </div>
      </section>

      <section className="archive-band homepage-section" id="industry" aria-labelledby="archive-title">
        <div className="section-heading">
          <h2 id="archive-title">
            <Link href="/categories/industry" className="section-heading-link">
              <span>🏭 Industry</span>
              <span className="section-heading-chevron" aria-hidden="true">
                <ChevronRightIcon size="1em" />
              </span>
            </Link>
          </h2>
        </div>

        <div className="project-grid">
          {industryProjects.map(renderProjectCard)}
        </div>
      </section>

      <section className="university-band homepage-section" id="research" aria-labelledby="university-title">
        <div className="section-heading">
          <h2 id="university-title">
            <Link href="/categories/research" className="section-heading-link">
              <span>📚 Research</span>
              <span className="section-heading-chevron" aria-hidden="true">
                <ChevronRightIcon size="1em" />
              </span>
            </Link>
          </h2>
        </div>

        <div className="project-grid">
          {universityProjects.map(renderProjectCard)}
        </div>

      </section>
    </PageLayout>
  );
}
