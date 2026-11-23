"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProjectClients } from "@/app/components/ProjectClients";
import type { Project } from "@/app/data/projects";
import { getValueHoverVars } from "@/app/utils/phraseStyles";

export type CategoryCtaCard = {
  emoji: string;
  type: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  tone?: "muted" | "blue" | "green" | "amber" | "red" | "purple";
};

type Props = {
  projects: Project[];
  ctaCard?: CategoryCtaCard;
};

export function CategoryCarousel({ projects, ctaCard }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    trackRef.current?.scrollBy({
      left: direction * Math.min(trackRef.current.clientWidth * 0.78, 440),
      behavior: "smooth",
    });
  };

  return (
    <section className="category-lineup" aria-labelledby="category-lineup-title">
      <div className="category-lineup-heading">
        <h2 id="category-lineup-title">Selected work</h2>
        <div className="category-carousel-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous projects">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next projects">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="category-carousel" ref={trackRef} tabIndex={0} aria-label="Projects">
        {projects.map((project) => {
          const firstValue = project.values?.[0];
          const valueHoverStyle = firstValue?.text
            ? getValueHoverVars(firstValue.text, firstValue.color)
            : undefined;
          return (
          <article
            className="category-project-card"
            key={project.id}
            data-project={project.id}
            style={valueHoverStyle}
          >
            <Link
              href={`/projects/${project.id}`}
              className="card-stretched-link"
              aria-label={project.name}
            />
            <div className="category-project-art" data-tone={project.clients?.[0]?.tone ?? "muted"}>
              <div className="category-project-art-bottom">
                {project.emoji && (
                  <span className="category-project-emoji" aria-hidden="true">
                    {project.emoji}
                  </span>
                )}
              </div>
            </div>
            <div className="category-project-meta">
              <span>{project.type}</span>
            </div>
            <h3>{project.name}</h3>
            <p>{project.tagline || project.description}</p>
            <ProjectClients
              values={project.values ?? []}
              className="category-project-clients"
              ariaLabel={`${project.name} phrases`}
            />
            <span className="category-project-link">Learn more</span>
          </article>
          );
        })}

        {ctaCard && (
          <article className="category-project-card category-project-card--cta">
            <a
              href={ctaCard.href}
              className="card-stretched-link"
              aria-label={`${ctaCard.title}: ${ctaCard.ctaLabel}`}
            />
            <div className="category-project-art" data-tone={ctaCard.tone ?? "amber"}>
              <div className="category-project-art-bottom">
                <span className="category-project-emoji" aria-hidden="true">
                  {ctaCard.emoji}
                </span>
              </div>
            </div>
            <div className="category-project-meta">
              <span>{ctaCard.type}</span>
            </div>
            <h3>{ctaCard.title}</h3>
            <p>{ctaCard.description}</p>
            <span className="category-project-link category-project-link--cta">
              {ctaCard.ctaLabel}
            </span>
          </article>
        )}
      </div>
    </section>
  );
}
