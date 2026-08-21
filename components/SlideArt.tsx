/**
 * Slide illustrations. Abstract and on-brand rather than photographic — they read as
 * designed at banner scale without pretending to be photography we cannot produce.
 * Each uses currentColor for the accent so it inherits the theme.
 */

const wrap = {
  viewBox: "0 0 220 150",
  fill: "none",
  className: "h-full w-full",
  "aria-hidden": true as const,
};

/** Medications: a strip of capsules, one of them singled out. */
export function MedsArt() {
  return (
    <svg {...wrap}>
      <defs>
        <linearGradient id="ma" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="75" r="58" fill="var(--accent)" opacity="0.07" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${52 + i * 42} 46) rotate(28 24 24)`}>
          <rect
            width="48"
            height="26"
            rx="13"
            fill={i === 1 ? "url(#ma)" : "none"}
            stroke="var(--accent)"
            strokeWidth={i === 1 ? 0 : 1.6}
            opacity={i === 1 ? 1 : 0.45}
          />
          <line
            x1="24" y1="0" x2="24" y2="26"
            stroke={i === 1 ? "var(--background)" : "var(--accent)"}
            strokeWidth="1.6"
            opacity={i === 1 ? 0.8 : 0.45}
          />
        </g>
      ))}
      <g opacity="0.55">
        <circle cx="150" cy="104" r="15" stroke="var(--accent)" strokeWidth="1.6" />
        <line x1="161" y1="115" x2="172" y2="126" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Lab report: rows of values, one flagged. */
export function LabsArt() {
  return (
    <svg {...wrap}>
      <circle cx="110" cy="75" r="58" fill="var(--accent)" opacity="0.07" />
      <rect x="62" y="24" width="96" height="102" rx="7" stroke="var(--accent)" strokeWidth="1.6" opacity="0.5" />
      {[0, 1, 2, 3, 4].map((i) => {
        const flagged = i === 2;
        return (
          <g key={i} transform={`translate(76 ${44 + i * 17})`}>
            <rect width={flagged ? 68 : 44} height="6" rx="3" fill="var(--accent)" opacity={flagged ? 0.85 : 0.28} />
            {flagged && <circle cx="-8" cy="3" r="3.5" fill="var(--warn)" />}
          </g>
        );
      })}
    </svg>
  );
}

/** Care navigation: a route from where you are to where help is. */
export function CareArt() {
  return (
    <svg {...wrap}>
      <circle cx="110" cy="75" r="58" fill="var(--accent)" opacity="0.07" />
      <path
        d="M58 116 C 78 96, 92 104, 104 84 S 132 52, 158 44"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeDasharray="5 6"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="58" cy="116" r="6" fill="var(--accent)" opacity="0.7" />
      <circle cx="58" cy="116" r="13" stroke="var(--accent)" strokeWidth="1.4" opacity="0.3" />
      <g transform="translate(142 26)">
        <path d="M16 34 C 16 34, 0 22, 0 12 A 16 16 0 0 1 32 12 C 32 22, 16 34, 16 34 Z"
          stroke="var(--accent)" strokeWidth="1.8" fill="var(--accent)" fillOpacity="0.12" />
        <path d="M16 6v12M10 12h12" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
