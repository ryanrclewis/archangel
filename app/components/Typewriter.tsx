"use client";

import React, { useEffect, useState } from "react";

type Props = {
  phrases: string[];
  typingSpeed?: number; // ms per char
  deletingSpeed?: number; // ms per char when deleting
  pause?: number; // pause after full phrase
};

export default function Typewriter({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1400,
}: Props) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const current = phrases[index % phrases.length];

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

  return (
    <span className="typewriter-phrase" aria-live="polite">
      {display}
      <span className="typewriter-caret" aria-hidden="true">&nbsp;</span>
    </span>
  );
}
