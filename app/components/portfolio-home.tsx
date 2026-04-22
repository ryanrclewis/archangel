"use client";

import { AnchorButton, Card, Elevation, H1, H2, H3, Tag } from "@blueprintjs/core";
import type { Project } from "../data/projects";
import { statusIntent } from "../lib/project-status";

type PortfolioHomeProps = {
  projects: Project[];
};

export default function PortfolioHome({ projects }: PortfolioHomeProps) {
  return (
    <main className="arch-page">
      <div className="arch-backdrop" />
      <div className="arch-content">
        <Card elevation={Elevation.TWO}>
          <H1 className="arch-heading">ARCHANGEL LABORATORIES</H1>
          <p className="arch-kicker">TECHNOLOGY WITH TELOS</p>
          <p className="arch-copy">
            Archangel Laboratories builds technology in the service of human dignity. Please contact us if you have
            a project in mind or want to learn more about our work.
          </p>
          <AnchorButton icon="envelope" text="CONTACT" href="mailto:contact@archangel-labs.com" />
        </Card>

        <Card elevation={Elevation.ONE}>
          <H2 className="arch-section-title">Our Work</H2>
          <div className="arch-grid">
            {projects.map((project) => (
              <Card key={project.id} elevation={Elevation.ZERO} className="arch-project-card">
                <div className="arch-project-header">
                  <H3 className="arch-project-title">{project.name}</H3>
                  <Tag minimal intent={statusIntent(project.status)}>
                    {project.status}
                  </Tag>
                </div>
                <p className="arch-type">{project.type}</p>
                <p className="arch-copy">{project.description}</p>
                {project.tags?.length ? (
                  <div className="arch-tags">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                ) : null}
                {project.url ? (
                  <AnchorButton
                    minimal
                    icon="share"
                    text="VISIT PROJECT"
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                  />
                ) : null}
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
