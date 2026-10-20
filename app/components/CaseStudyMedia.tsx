import Image from "next/image";
import type { CaseStudyMedia as Media } from "@/app/data/projects";

export function CaseStudyMedia({ media }: { media: Media }) {
  return (
    <figure className="case-study-media">
      {media.type === "video" ? (
        <video controls preload="metadata" poster={media.poster} aria-label={media.alt}>
          <source src={media.src} />
          Your browser does not support embedded video.
        </video>
      ) : (
        <Image src={media.src} alt={media.alt} width={1600} height={1000} sizes="(max-width: 900px) 100vw, 70rem" />
      )}
      {media.caption ? <figcaption>{media.caption}</figcaption> : null}
    </figure>
  );
}
