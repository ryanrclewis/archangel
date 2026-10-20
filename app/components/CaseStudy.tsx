import type { CaseStudy as CaseStudyData } from "@/app/data/projects";
import { CaseStudyMedia } from "./CaseStudyMedia";

const sections = [
  ["summary", "Summary"],
  ["problem", "Problem"],
  ["users", "Users"],
  ["constraints", "Constraints"],
  ["role", "My Role"],
  ["process", "Process"],
  ["outcome", "Outcome"],
  ["reflection", "Reflection"],
] as const;

export function CaseStudy({ data }: { data?: CaseStudyData }) {
  if (!data) return null;
  return (
    <div className="case-study">
      {sections.map(([key, label]) => {
        const value = data[key];
        return value ? (
          <section className="case-study-section" key={key}>
            <p className="eyebrow">{label}</p>
            <div className="case-study-copy"><p>{value}</p></div>
          </section>
        ) : null;
      })}
      {data.keyDecisions?.length ? (
        <section className="case-study-section">
          <p className="eyebrow">Key Decisions</p>
          <div className="decision-list">
            {data.keyDecisions.map((decision) => (
              <article key={decision.title}>
                <h3>{decision.title}</h3>
                <p>{decision.rationale}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {data.artifacts?.length ? (
        <section className="case-study-section">
          <p className="eyebrow">Process and Artifacts</p>
          <div className="case-study-artifacts">{data.artifacts.map((media) => <CaseStudyMedia key={media.src} media={media} />)}</div>
        </section>
      ) : null}
    </div>
  );
}
