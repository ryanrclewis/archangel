import type { ProjectValue } from "@/app/data/projects";
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
      {visible.map((val, index) => (
        <li key={`${val.text}-${index}-${val.tone ?? "muted"}`}>
          <span className="client-chip" data-tone={val.tone ?? "muted"} style={getPhraseChipStyle(val.text, val.color)}>
            {val.text}
          </span>
        </li>
      ))}
    </ul>
  );
}