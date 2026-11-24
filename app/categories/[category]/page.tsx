import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/app/components/BreadcrumbNav";
import { CategoryCarousel } from "@/app/components/CategoryCarousel";
import { CvSection } from "@/app/components/CvSection";
import { PageLayout } from "@/app/components/PageLayout";
import {
  bespokeEntries,
  educationEntries,
  experienceEntries,
  governmentEntries,
} from "@/app/data/cv";
import { projects, type ProjectSection } from "@/app/data/projects";
import siteConfig from "@/app/data/site-config.json";

const categoryDetails: Record<ProjectSection, { label: string; description: string }> = {
  bespoke: {
    label: "Bespoke",
    description: "Purpose-built tools for particular people, communities, and missions.",
  },
  government: {
    label: "Government",
    description: "Public systems designed to make essential services clearer and more humane.",
  },
  industry: {
    label: "Industry",
    description: "Product and experience design built alongside engineering and business teams.",
  },
  research: {
    label: "Research",
    description: "User research, prototypes, and explorations that turn open questions into grounded design decisions.",
  },
};

export function generateStaticParams() {
  return Object.keys(categoryDetails).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const details = categoryDetails[categorySlug as ProjectSection];
  if (!details) {
    return { title: "Category Not Found | Archangel Laboratories" };
  }
  return {
    title: `${details.label} | Archangel Laboratories`,
    description: details.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const details = categoryDetails[categorySlug as ProjectSection];

  if (!details) notFound();

  const categoryProjects = projects.filter(
    (project) => project.section === categorySlug && !project.archived,
  );

  const bespokeCtaCard =
    categorySlug === "bespoke"
      ? {
          emoji: "🤝",
          type: "Custom Software",
          title: "Your Business",
          description:
            "Thoughtful, human-centered software and AI workflows built around how your team actually works.",
          href: `mailto:${siteConfig.contactEmail}`,
          ctaLabel: "Start a project",
          tone: "amber" as const,
        }
      : undefined;

  return (
    <PageLayout>
      <div className="category-page">
        <section className="category-hero" aria-labelledby="category-title">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: details.label },
            ]}
          />
          <h1 id="category-title">{details.label}</h1>
          <p>
            {details.description}
            {categorySlug === "bespoke" && (
              <>
                {" "}
                To explore human-centered AI experiences for your organization,{" "}
                <a className="category-hero-link" href={`mailto:${siteConfig.contactEmail}`}>
                  contact us
                </a>
                .
              </>
            )}
          </p>
        </section>
        <CategoryCarousel projects={categoryProjects} ctaCard={bespokeCtaCard} />
        {categorySlug === "bespoke" && (
          <CvSection
            id="timeline"
            title="Timeline"
            entries={bespokeEntries}
          />
        )}
        {categorySlug === "government" && (
          <CvSection
            id="experience"
            title="Experience"
            entries={governmentEntries}
          />
        )}
        {categorySlug === "industry" && (
          <CvSection
            id="experience"
            title="Experience"
            entries={experienceEntries}
          />
        )}
        {categorySlug === "research" && (
          <CvSection
            id="education"
            title="Education"
            subtitle="Current graduate studies and prior undergraduate training at Michigan State University."
            entries={educationEntries}
          />
        )}
      </div>
    </PageLayout>
  );
}
