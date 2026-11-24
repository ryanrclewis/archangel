import type React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function baseProps(size: number | string = "1em", props: React.SVGProps<SVGSVGElement>) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: "false" as const,
    ...props,
  };
}

/** SF Symbol: magnifyingglass */
export function MagnifyingGlassIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="10.5" cy="10.5" r="6.75" />
      <path d="M15.5 15.5 20.5 20.5" />
    </svg>
  );
}

/** SF Symbol: xmark */
export function XmarkIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

/** SF Symbol: xmark.circle.fill */
export function XmarkCircleFillIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.22" />
      <path
        d="M9 9 15 15M15 9 9 15"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** SF Symbol: chevron.right */
export function ChevronRightIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M9.25 5.5 15.75 12l-6.5 6.5" />
    </svg>
  );
}

/** SF Symbol: chevron.left */
export function ChevronLeftIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M14.75 5.5 8.25 12l6.5 6.5" />
    </svg>
  );
}

/** SF Symbol: arrow.right */
export function ArrowRightIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M5 12h14" />
      <path d="m13.25 6.25 5.75 5.75-5.75 5.75" />
    </svg>
  );
}

/** SF Symbol: arrow.up.right */
export function ArrowUpRightIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M7.5 16.5 16.5 7.5" />
      <path d="M9 7.5h7.5V15" />
    </svg>
  );
}

/** SF Symbol: line.3.horizontal */
export function LineHorizontal3Icon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

/** SF Symbol: circle.lefthalf.filled (Automatic / System Appearance) */
export function CircleLeftHalfFilledIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12 2.75a9.25 9.25 0 0 0 0 18.5V2.75Z" fill="currentColor" />
    </svg>
  );
}

/** SF Symbol: sun.max */
export function SunMaxIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.75v2.25M12 19v2.25M4.93 4.93l1.6 1.6M17.47 17.47l1.6 1.6M2.75 12H5M19 12h2.25M4.93 19.07l1.6-1.6M17.47 6.53l1.6-1.6" />
    </svg>
  );
}

/** SF Symbol: moon */
export function MoonIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg {...baseProps(size, props)}>
      <path d="M19.5 14.25A7.75 7.75 0 0 1 9.75 4.5a7.75 7.75 0 1 0 9.75 9.75Z" />
    </svg>
  );
}

/** SF Symbol: pause.fill */
export function PauseFillIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="6" y="4.5" width="4.25" height="15" rx="1.25" />
      <rect x="13.75" y="4.5" width="4.25" height="15" rx="1.25" />
    </svg>
  );
}

/** SF Symbol: play.fill */
export function PlayFillIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M7.5 5.1c0-1.05 1.15-1.7 2.05-1.15l10.2 6.2a1.35 1.35 0 0 1 0 2.3l-10.2 6.2c-.9.55-2.05-.1-2.05-1.15V5.1Z" />
    </svg>
  );
}
