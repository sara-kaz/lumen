/** Simple stroke icons so the three doors are distinguishable at a glance. */

const base = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PillIcon() {
  return (
    <svg {...base}>
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-40 12 12)" />
      <line x1="9.2" y1="6.6" x2="17.4" y2="14.8" />
    </svg>
  );
}

export function ReportIcon() {
  return (
    <svg {...base}>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M8.5 16.5l2.5-3 2 2.2 2.5-4" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
