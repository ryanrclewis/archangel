import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "../../components/project-detail";
import { getProjectById, getProjectIds } from "../../data/projects";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

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

  return <ProjectDetail project={project} />;
}
