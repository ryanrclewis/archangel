import Link from "next/link";
import { ChevronRightIcon } from "@/app/components/SfSymbols";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function BreadcrumbNav({ items }: Props) {
  if (!items.length) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {index > 0 && (
                <span className="breadcrumb-sep" aria-hidden="true">
                  <ChevronRightIcon size="0.85em" />
                </span>
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
