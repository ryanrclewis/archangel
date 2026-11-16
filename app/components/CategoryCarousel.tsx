"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Project } from "@/app/data/projects";

type Props = {
  projects: Project[];
};

export function CategoryCarousel({ projects }: Props) {
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
        <h2 id="category-lineup-title">Explore the lineup.</h2>
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
        {projects.map((project, index) => (
          <Link className="category-project-card" href={`/projects/${project.id}`} key={project.id}>
            <div className="category-project-art" data-tone={project.clients?.[0]?.tone ?? "muted"}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.name.slice(0, 1)}</strong>
            </div>
            <div className="category-project-meta">
              <span>{project.type}</span>
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <span className="category-project-link">View project <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
