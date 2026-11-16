import { notFound } from "next/navigation";
import { CategoryCarousel } from "@/app/components/CategoryCarousel";
import { PageLayout } from "@/app/components/PageLayout";
import { projects, type ProjectSection } from "@/app/data/projects";

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
    description: "Experience and product work for teams building at meaningful scale.",
  },
  research: {
    label: "Research",
    description: "Experiments, studies, and prototypes that turn questions into useful direction.",
  },
};

export function generateStaticParams() {
  return Object.keys(categoryDetails).map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const details = categoryDetails[categorySlug as ProjectSection];

  if (!details) notFound();

  const categoryProjects = projects.filter(
    (project) => project.section === categorySlug && !project.archived,
  );

  return (
    <PageLayout>
      <div className="category-page">
        <section className="category-hero" aria-labelledby="category-title">
          <h1 id="category-title">{details.label}</h1>
          <p>{details.description}</p>
        </section>
        <CategoryCarousel projects={categoryProjects} />
      </div>
    </PageLayout>
  );
}
