"use client";

import { AnchorButton, Card, Classes, Elevation, H1, H2, Tag } from "@blueprintjs/core";
import Link from "next/link";
import type { Project } from "../data/projects";
import { statusIntent } from "../lib/project-status";

type ProjectDetailProps = {
  project: Project;
};

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <main className="arch-page">
      <div className="arch-backdrop" />
      <div className="arch-content arch-content-narrow">
        <Card elevation={Elevation.TWO}>
          <p className="arch-kicker">{project.folder.toUpperCase()}</p>
          <H1 className="arch-heading">{project.name}</H1>
          <div className="arch-tags">
            <Tag>{project.type}</Tag>
            <Tag minimal intent={statusIntent(project.status)}>
              {project.status}
            </Tag>
          </div>
          <p className="arch-copy">{project.description}</p>
        </Card>

        {project.features?.length ? (
          <Card elevation={Elevation.ONE}>
            <H2 className="arch-section-title">Highlights</H2>
            <ul className="arch-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </Card>
        ) : null}

        {project.tags?.length ? (
          <Card elevation={Elevation.ONE}>
            <H2 className="arch-section-title">Tags</H2>
            <div className="arch-tags">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </Card>
        ) : null}

        <Card elevation={Elevation.ONE}>
          <H2 className="arch-section-title">Resources</H2>
          <div className="arch-actions">
            <Link href="/" className={Classes.BUTTON}>
              BACK TO SUITE
            </Link>
            {project.url ? (
              <AnchorButton icon="share" text="LIVE URL" href={project.url} target="_blank" rel="noreferrer" />
            ) : null}
          </div>
        </Card>
      </div>
    </main>
  );
}
