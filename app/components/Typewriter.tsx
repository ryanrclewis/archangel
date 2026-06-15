"use client";

import React, { useEffect, useState } from "react";
import { getPhraseChipColor } from "@/app/utils/phraseStyles";

export type TypewriterPhrase = {
  text: string;
  link?: string;
  enabled?: boolean;
};

type Props = {
  phrases: (string | TypewriterPhrase)[];
  valueColors?: Partial<Record<string, string>>;
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
};

export default function Typewriter({
  phrases,
  valueColors = {} as Partial<Record<string, string>>,
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1400,
}: Props) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const phraseObj = phrases[index % phrases.length];
    const current = typeof phraseObj === "string" ? phraseObj : phraseObj.text;

    let timeout: number;

    if (!isDeleting && display.length < current.length) {
      timeout = window.setTimeout(() => {
        setDisplay(current.slice(0, display.length + 1));
      }, typingSpeed);
    } else if (isDeleting && display.length > 0) {
      timeout = window.setTimeout(() => {
        setDisplay(current.slice(0, display.length - 1));
      }, deletingSpeed);
    } else if (!isDeleting && display.length === current.length) {
      // pause, then start deleting
      timeout = window.setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && display.length === 0) {
      // move to next
      setIsDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [display, isDeleting, index, phrases, typingSpeed, deletingSpeed, pause]);

  const phraseObj = phrases[index % phrases.length];
  const currentLink = typeof phraseObj === "string" ? undefined : phraseObj.link;
  const currentText = typeof phraseObj === "string" ? phraseObj : phraseObj.text;
  const lookupText = currentText.replace(/[.,!?;:]+$/, "");
  const valueColor = valueColors[lookupText] ?? undefined;
  const hoverColor = getPhraseChipColor(currentText, valueColor);
  const inner = (
    <>
      {display}
      <span className="typewriter-caret" aria-hidden="true">&nbsp;</span>
    </>
  );

  return (
    <span className="typewriter-phrase" aria-live="polite">
      {currentLink ? (
        <a
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="typewriter-link"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          style={{ color: isHovered ? undefined : hoverColor } as React.CSSProperties}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </span>
  );
}
