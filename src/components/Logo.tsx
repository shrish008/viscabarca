export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Magical Realm"
    >
      <defs>
        <radialGradient id="mr-badge-bg" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#7a3597" />
          <stop offset="55%" stopColor="#4b1f6f" />
          <stop offset="100%" stopColor="#220f36" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#mr-badge-bg)" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#c9a227" strokeOpacity="0.5" strokeWidth="1.5" />

      {/* flourish */}
      <g fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <path d="M42 74c10-14 24-16 32-6 6 8-1 16-9 12-6-3-4-11 4-10" />
        <path d="M158 74c-10-14-24-16-32-6-6 8 1 16 9 12 6-3 4-11-4-10" />
        <path d="M74 68c8-8 18-10 26-4" />
        <path d="M126 68c-8-8-18-10-26-4" />
      </g>
      <path d="M100 56l3.5 9 9 3.5-9 3.5-3.5 9-3.5-9-9-3.5 9-3.5z" fill="#c9a227" opacity="0.95" />
      <path d="M30 92c22 10 48 4 70-4 22 8 48 14 70 4" fill="none" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

      {/* wordmark */}
      <text
        x="100"
        y="120"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="23"
        fontWeight="700"
        letterSpacing="1.5"
        fill="#e9c25f"
      >
        MAGICAL
      </text>
      <text
        x="100"
        y="144"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="23"
        fontWeight="700"
        letterSpacing="1.5"
        fill="#e9c25f"
      >
        REALM
      </text>

      <g stroke="#c9a227" strokeWidth="1.2" opacity="0.8">
        <line x1="46" y1="156" x2="86" y2="156" />
        <line x1="114" y1="156" x2="154" y2="156" />
      </g>
      <path d="M94 156l6-4 6 4-6 4z" fill="#c9a227" opacity="0.8" />

      <text
        x="100"
        y="172"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="11"
        letterSpacing="3.5"
        fill="#d9b862"
      >
        EVENTS
      </text>
    </svg>
  );
}
