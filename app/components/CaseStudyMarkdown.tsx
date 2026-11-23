import React from "react";
import { MermaidDiagram } from "./MermaidDiagram";

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderInline(text: string, keyPrefix = "in"): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let tokenIndex = 0;

  const pattern =
    /(<br\s*\/?>)|(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+(?:\*(?!\*)[^*]*)*)\*\*)|(\*([^*]+)\*)/;

  while (remaining.length > 0) {
    const match = pattern.exec(remaining);
    if (!match) {
      nodes.push(remaining);
      break;
    }

    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index));
    }

    const key = `${keyPrefix}-${tokenIndex++}`;

    if (match[1]) {
      nodes.push(<br key={key} />);
    } else if (match[2]) {
      nodes.push(<code key={key}>{match[2].slice(1, -1)}</code>);
    } else if (match[3]) {
      const label = match[4];
      const href = match[5];
      const isExternal = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {renderInline(label, `${key}-a`)}
        </a>
      );
    } else if (match[6]) {
      nodes.push(
        <strong key={key}>{renderInline(match[7], `${key}-b`)}</strong>
      );
    } else if (match[8]) {
      nodes.push(<em key={key}>{renderInline(match[9], `${key}-i`)}</em>);
    }

    remaining = remaining.slice(match.index + match[0].length);
  }

  return nodes;
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  const cells = splitTableRow(trimmed);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isListLine(line: string): { indent: number; ordered: boolean; content: string } | null {
  const ul = /^(\s*)[-*+]\s+(.*)$/.exec(line);
  if (ul) {
    return { indent: ul[1].length, ordered: false, content: ul[2] };
  }
  const ol = /^(\s*)\d+\.\s+(.*)$/.exec(line);
  if (ol) {
    return { indent: ol[1].length, ordered: true, content: ol[2] };
  }
  return null;
}

function parseList(
  lines: string[],
  startIndex: number,
  keyPrefix: string
): { node: React.ReactNode; nextIndex: number } {
  const first = isListLine(lines[startIndex]);
  if (!first) {
    return { node: null, nextIndex: startIndex + 1 };
  }

  const baseIndent = first.indent;
  const ordered = first.ordered;
  const items: React.ReactNode[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const current = isListLine(lines[i]);
    if (!current || current.indent < baseIndent) break;
    if (current.indent > baseIndent) {
      i++;
      continue;
    }
    if (current.ordered !== ordered) break;

    const itemContentLines: string[] = [current.content];
    const nestedChildren: React.ReactNode[] = [];
    i++;

    while (i < lines.length) {
      if (!lines[i].trim()) {
        // Check if list continues after blank line at greater indent
        const nextLine = lines[i + 1];
        const nextParsed = nextLine ? isListLine(nextLine) : null;
        if (nextParsed && nextParsed.indent > baseIndent) {
          i++;
          continue;
        }
        break;
      }

      const sub = isListLine(lines[i]);
      if (sub) {
        if (sub.indent > baseIndent) {
          const nested = parseList(lines, i, `${keyPrefix}-sub-${items.length}-${nestedChildren.length}`);
          nestedChildren.push(nested.node);
          i = nested.nextIndex;
          continue;
        }
        break;
      }

      // Indented continuation paragraph inside list item
      if (/^\s{2,}/.test(lines[i])) {
        itemContentLines.push(lines[i].trim());
        i++;
        continue;
      }

      break;
    }

    const itemKey = `${keyPrefix}-li-${items.length}`;
    items.push(
      <li key={itemKey}>
        {renderInline(itemContentLines.join(" "), itemKey)}
        {nestedChildren}
      </li>
    );
  }

  const Tag = ordered ? "ol" : "ul";
  return {
    node: (
      <Tag key={keyPrefix} className="case-study-list">
        {items}
      </Tag>
    ),
    nextIndex: i,
  };
}

function renderBlocks(markdown: string, keyPrefix = "blk"): React.ReactNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    const key = `${keyPrefix}-${blocks.length}`;

    // Fenced code blocks & Mermaid
    const fenceMatch = /^```(\w*)\s*$/.exec(trimmed);
    if (fenceMatch) {
      const lang = fenceMatch[1].toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      const code = codeLines.join("\n");
      if (lang === "mermaid") {
        blocks.push(<MermaidDiagram key={key} chart={code} />);
      } else {
        blocks.push(
          <pre key={key} className="case-study-code" data-lang={lang || undefined}>
            <code>{code}</code>
          </pre>
        );
      }
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push(<hr key={key} className="case-study-hr" />);
      i++;
      continue;
    }

    // Headings
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();
      const id = slugifyHeading(content);
      if (level === 1) {
        blocks.push(
          <p key={key} className="case-study-subtitle">
            {renderInline(content, key)}
          </p>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={key} id={id} className="case-study-h2">
            {renderInline(content, key)}
          </h2>
        );
      } else if (level === 3) {
        blocks.push(
          <h3 key={key} id={id} className="case-study-h3">
            {renderInline(content, key)}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={key} id={id} className="case-study-h4">
            {renderInline(content, key)}
          </h4>
        );
      }
      i++;
      continue;
    }

    // Standalone image
    const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      blocks.push(
        <figure key={key} className="case-study-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
      i++;
      continue;
    }

    // Blockquotes & GitHub-style alerts
    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }

      const alertMatch = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/i.exec(
        quoteLines[0]?.trim() ?? ""
      );
      if (alertMatch) {
        const alertType = alertMatch[1].toLowerCase();
        const bodyMd = quoteLines.slice(1).join("\n");
        blocks.push(
          <aside
            key={key}
            className={`case-study-callout case-study-callout--${alertType}`}
          >
            <p className="case-study-callout-label">
              {alertMatch[1].charAt(0).toUpperCase() + alertMatch[1].slice(1).toLowerCase()}
            </p>
            <div className="case-study-callout-body">
              {renderBlocks(bodyMd, `${key}-alert`)}
            </div>
          </aside>
        );
      } else {
        const bodyMd = quoteLines.join("\n");
        blocks.push(
          <blockquote key={key} className="case-study-quote">
            {renderBlocks(bodyMd, `${key}-q`)}
          </blockquote>
        );
      }
      continue;
    }

    // GFM Tables
    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const headers = splitTableRow(lines[i]);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push(
        <div key={key} className="case-study-table-wrap">
          <table className="case-study-table">
            <thead>
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={`${key}-th-${hIdx}`}>
                    {renderInline(h, `${key}-th-${hIdx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={`${key}-tr-${rIdx}`}>
                  {headers.map((_, cIdx) => (
                    <td key={`${key}-td-${rIdx}-${cIdx}`}>
                      {renderInline(row[cIdx] ?? "", `${key}-td-${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Lists
    if (isListLine(line)) {
      const parsed = parseList(lines, i, key);
      if (parsed.node) blocks.push(parsed.node);
      i = parsed.nextIndex;
      continue;
    }

    // Paragraph (preserve trailing two-space hard line breaks)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```/.test(lines[i].trim()) &&
      !/^(#{1,4})\s+/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i].trim()) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !/^!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim()) &&
      !isListLine(lines[i]) &&
      !(lines[i].trim().includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    const paraContent: React.ReactNode[] = [];
    paraLines.forEach((pLine, pIdx) => {
      const hasHardBreak = /\s{2}$/.test(pLine);
      paraContent.push(...renderInline(pLine.trim(), `${key}-p-${pIdx}`));
      if (pIdx < paraLines.length - 1) {
        paraContent.push(hasHardBreak ? <br key={`${key}-br-${pIdx}`} /> : " ");
      }
    });

    blocks.push(
      <p key={key} className="case-study-p">
        {paraContent}
      </p>
    );
  }

  return blocks;
}

type Props = {
  markdown: string;
};

export function CaseStudyMarkdown({ markdown }: Props) {
  return <div className="case-study-body">{renderBlocks(markdown, "cs")}</div>;
}
