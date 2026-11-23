"use client";

import Link from "next/link";
import type { Project } from "@/app/data/projects";

type Props = {
  project: Project;
  children: React.ReactNode;
  /** Extra class names forwarded to the trigger wrapper */
  className?: string;
  /** Inline styles forwarded to the trigger */
  style?: React.CSSProperties;
  /** data-* props forwarded to the trigger */
  [key: `data-${string}`]: string | undefined;
};

export function ProjectPreviewCard({ project, children, className, style, ...rest }: Props) {
  return (
    <div className={className} style={style} {...rest}>
      <Link
        href={`/projects/${project.id}`}
        className="card-stretched-link"
        aria-label={project.name}
      />
      {children}
    </div>
  );
}
