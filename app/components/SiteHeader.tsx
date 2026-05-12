import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Site header">
      <Link className="site-mark" href="/">
        <Image src="/icon.svg" alt="" width={32} height={32} priority />
        <span>Archangel Laboratories</span>
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
{/*         <Link href="/#work">Work</Link>
        <Link href="/#principles">Principles</Link>
        <Link href="/#archive">Archive</Link> */}
        <a href="mailto:contact@archangel-labs.com">Contact</a>
      </nav>
    </header>
  );
}
