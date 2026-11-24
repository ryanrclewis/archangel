"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProjectClients } from "@/app/components/ProjectClients";
import { ChevronLeftIcon, ChevronRightIcon } from "@/app/components/SfSymbols";
import type { Project } from "@/app/data/projects";
import { formatUppercaseLabel } from "@/app/utils/brandText";
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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(maxScroll - el.scrollLeft > 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollBounds();
    el.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);
    return () => {
      el.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [updateScrollBounds, projects.length, ctaCard]);

  const move = (direction: number) => {
    const el = trackRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * Math.min(el.clientWidth * 0.78, 440),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="category-lineup" aria-labelledby="category-lineup-title">
      <div className="category-lineup-heading">
        <h2 id="category-lineup-title">Selected Work</h2>
        <div className="category-carousel-controls">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous Projects"
          >
            <ChevronLeftIcon size="1.15rem" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canScrollNext}
            aria-label="Next Projects"
          >
            <ChevronRightIcon size="1.15rem" />
          </button>
        </div>
      </div>

      <div
        className="category-carousel"
        ref={trackRef}
        role="region"
        tabIndex={0}
        aria-label="Selected Projects"
      >
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
                aria-label={`${project.name} — View project`}
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
                <span>{formatUppercaseLabel(project.type)}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.tagline || project.description}</p>
              <ProjectClients
                values={project.values ?? []}
                className="category-project-clients"
                ariaLabel={`${project.name} values`}
              />
              <span className="category-project-link" aria-hidden="true">
                View project
              </span>
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
              <span>{formatUppercaseLabel(ctaCard.type)}</span>
            </div>
            <h3>{ctaCard.title}</h3>
            <p>{ctaCard.description}</p>
            <span className="category-project-link category-project-link--cta" aria-hidden="true">
              {ctaCard.ctaLabel}
            </span>
          </article>
        )}
      </div>
    </section>
  );
}
