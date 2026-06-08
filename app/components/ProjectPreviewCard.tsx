"use client";

import { PreviewCard } from "@base-ui-components/react/preview-card";
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
  const embed = project.embed;

  // Only show preview for projects that have an embed
  if (!embed?.src) {
    return (
      <a className={className} style={style} href={`/projects/${project.id}`} {...rest}>
        {children}
      </a>
    );
  }

  const isPortrait = embed.width && embed.height && embed.width < embed.height;
  const previewWidth = isPortrait ? 260 : 420;
  const previewHeight = isPortrait
    ? Math.round(260 * (embed.height! / embed.width!))
    : Math.round(420 * ((embed.height ?? 450) / (embed.width ?? 800)));

  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        delay={400}
        closeDelay={200}
        render={
          <a className={className} style={style} href={`/projects/${project.id}`} {...rest} />
        }
      >
        {children}
      </PreviewCard.Trigger>

      <PreviewCard.Portal>
        <PreviewCard.Positioner side="top" align="center" sideOffset={12}>
          <PreviewCard.Popup className="project-preview-popup">
            <iframe
              src={embed.src}
              title={embed.title ?? `${project.name} preview`}
              width={previewWidth}
              height={previewHeight}
              style={{ border: "none", display: "block", borderRadius: 6 }}
              loading="lazy"
            />
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
