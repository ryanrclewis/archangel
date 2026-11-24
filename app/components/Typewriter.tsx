"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { getPhraseAccentVars } from "@/app/utils/phraseStyles";

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
  paused?: boolean;
};

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener?.("change", onStoreChange);
  return () => mql.removeEventListener?.("change", onStoreChange);
}

export default function Typewriter({
  phrases,
  valueColors = {} as Partial<Record<string, string>>,
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1400,
  paused = false,
}: Props) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getPrefersReducedMotion,
    () => false,
  );
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isStatic = prefersReducedMotion || paused;

  useEffect(() => {
    if (!phrases || phrases.length === 0 || isStatic) return;

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
      timeout = window.setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && display.length === 0) {
      timeout = window.setTimeout(() => {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [display, isDeleting, index, phrases, typingSpeed, deletingSpeed, pause, isStatic]);

  if (!phrases || phrases.length === 0) return null;

  const phraseObj = phrases[index % phrases.length];
  const currentLink = typeof phraseObj === "string" ? undefined : phraseObj.link;
  const currentText = typeof phraseObj === "string" ? phraseObj : phraseObj.text;
  const visibleText = isStatic ? currentText : display;
  const lookupText = currentText.replace(/[.,!?;:]+$/, "");
  const valueColor = valueColors[lookupText] ?? undefined;
  const accentVars = getPhraseAccentVars(currentText, valueColor);
  const isExternal = Boolean(currentLink && /^https?:\/\//i.test(currentLink));

  const visualContent = (
    <>
      <span aria-hidden="true">{visibleText}</span>
      {!isStatic && <span className="typewriter-caret" aria-hidden="true">&nbsp;</span>}
    </>
  );

  return (
    <span className="typewriter-phrase">
      {currentLink ? (
        <a
          href={currentLink}
          className="typewriter-link"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          aria-label={isExternal ? `${currentText} (opens in a new tab)` : currentText}
          style={accentVars}
        >
          {visualContent}
        </a>
      ) : (
        <span>
          <span className="sr-only">{currentText}</span>
          {visualContent}
        </span>
      )}
    </span>
  );
}
