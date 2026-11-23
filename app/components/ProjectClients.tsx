import Link from "next/link";
import { formatTagTitle, tagToSlug, type ProjectValue } from "@/app/data/projects";
import { getPhraseChipStyle } from "@/app/utils/phraseStyles";

type ProjectClientsProps = {
  values: ProjectValue[];
  className?: string;
  ariaLabel?: string;
};

export function ProjectClients({ values, className, ariaLabel = "Associated phrases" }: ProjectClientsProps) {
  const visible = values.filter((v) => v.text?.trim());

  if (!visible.length) return null;

  return (
    <ul className={className ? `client-list ${className}` : "client-list"} aria-label={ariaLabel}>
      {visible.map((val, index) => {
        const slug = tagToSlug(val.text);
        const label = formatTagTitle(val.text);
        const style = getPhraseChipStyle(val.text, val.color);
        const tone = val.tone ?? "muted";
        return (
          <li key={`${val.text}-${index}-${tone}`}>
            {slug ? (
              <Link
                href={`/tags/${slug}`}
                className="client-chip client-chip-link"
                data-tone={tone}
                style={style}
              >
                {label}
              </Link>
            ) : (
              <span className="client-chip" data-tone={tone} style={style}>
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}