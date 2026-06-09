"use client";

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
    <a className={className} style={style} href={`/projects/${project.id}`} {...rest}>
      {children}
    </a>
  );
}
