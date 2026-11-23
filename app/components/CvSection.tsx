import Link from "next/link";
import type { CvEntry } from "@/app/data/cv";
import { formatUppercaseLabel } from "@/app/utils/brandText";

type CvSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  entries: CvEntry[];
};

export function CvSection({ id, title, subtitle, entries }: CvSectionProps) {
  if (!entries.length) return null;

  return (
    <section className="cv-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="cv-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      <ol className="cv-list">
        {entries.map((entry) => (
          <li key={entry.id} className="cv-entry">
            <div className="cv-meta">
              <span className="cv-timeframe">{formatUppercaseLabel(entry.timeframe)}</span>
              {entry.status ? <span className="cv-status">{formatUppercaseLabel(entry.status)}</span> : null}
            </div>

            <div className="cv-body">
              <h3>{entry.title}</h3>
              <p className="cv-organization">{entry.organization}</p>
              <p className="cv-summary">{entry.summary}</p>

              {entry.highlights?.length ? (
                <ul className="cv-highlights">
                  {entry.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {entry.links?.length ? (
                <div className="cv-links" aria-label={`${entry.title} related work`}>
                  {entry.links.map((link) => (
                    <Link key={link.href} href={link.href} className="cv-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
