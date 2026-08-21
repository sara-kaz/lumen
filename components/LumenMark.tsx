/**
 * The Lumen mark: a vessel lumen in cross-section — the open channel, lit.
 * Inherits currentColor for the wall so it can sit on any surface.
 */
export function LumenMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <radialGradient id="lumen-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eafffb" />
          <stop offset="55%" stopColor="#7fe3d8" />
          <stop offset="100%" stopColor="#4db6ac" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="17.5" fill="none" stroke="currentColor" strokeWidth="6.5" />
      <circle cx="32" cy="32" r="7.5" fill="url(#lumen-core)" />
    </svg>
  );
}

export function LumenWordmark() {
  return (
    <span className="flex items-center gap-2.5 text-accent">
      <LumenMark size={18} />
      <span className="font-mono text-xs uppercase tracking-[0.28em]">Lumen</span>
    </span>
  );
}
