"use client";

import { useState, useSyncExternalStore } from "react";
import { PauseFillIcon, PlayFillIcon } from "@/app/components/SfSymbols";
import Typewriter, { type TypewriterPhrase } from "@/app/components/Typewriter";

type Props = {
  phrases: (string | TypewriterPhrase)[];
  valueColors: Partial<Record<string, string>>;
  contactEmail: string;
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

export function HeroSection({ phrases, valueColors, contactEmail }: Props) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getPrefersReducedMotion,
    () => false,
  );
  const [paused, setPaused] = useState(false);

  return (
    <section className="hero-band homepage-section" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title">
          Technology in service of{"\u00A0"}
          <br />
          <Typewriter phrases={phrases} valueColors={valueColors} paused={paused} />
        </h1>
        <p className="lede">
          Archangel Laboratories designs and builds software for families, communities, teams, and public
          institutions looking for practical, well-crafted tools ordered to human flourishing and the common good.
        </p>
        <div className="action-row">
          <a className="button-primary" href={`mailto:${contactEmail}`}>
            Start a project
          </a>
          {!prefersReducedMotion && phrases.length > 1 && (
            <button
              type="button"
              className="typewriter-pause-btn"
              aria-pressed={paused}
              aria-label={paused ? "Play rotating phrases" : "Pause rotating phrases"}
              title={paused ? "Play rotating phrases" : "Pause rotating phrases"}
              onClick={() => setPaused((prev) => !prev)}
            >
              {paused ? <PlayFillIcon size="0.95rem" /> : <PauseFillIcon size="0.95rem" />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
