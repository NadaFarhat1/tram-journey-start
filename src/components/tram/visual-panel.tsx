/**
 * Abstract geometric visual used on the 40% side of the split auth layout.
 * Palette only: soft deep teal, light teal, pale teal, warm white/ivory,
 * with very small muted gold accents.
 */
export function VisualPanel() {
  return (
    <div
      aria-hidden="true"
      className="relative h-40 w-full overflow-hidden bg-teal sm:h-56 lg:h-full"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <rect width="400" height="700" fill="#397A78" />
        <circle cx="300" cy="150" r="180" fill="#6FA6A2" opacity="0.35" />
        <circle cx="120" cy="470" r="220" fill="#DCEBE9" opacity="0.14" />
        <path d="M0 700 L400 380 L400 700 Z" fill="#DCEBE9" opacity="0.12" />
        <path d="M0 300 L400 60 L400 130 L0 380 Z" fill="#FAF9F6" opacity="0.09" />
        <rect
          x="70"
          y="230"
          width="180"
          height="180"
          fill="none"
          stroke="#DCEBE9"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          transform="rotate(18 160 320)"
        />
        <rect
          x="110"
          y="270"
          width="100"
          height="100"
          fill="none"
          stroke="#C5A46D"
          strokeOpacity="0.85"
          strokeWidth="1.5"
          transform="rotate(18 160 320)"
        />
        <circle cx="160" cy="320" r="5" fill="#C5A46D" />
        <line
          x1="0"
          y1="560"
          x2="400"
          y2="560"
          stroke="#DCEBE9"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <circle cx="330" cy="560" r="4" fill="#C5A46D" />
        <circle cx="60" cy="90" r="26" fill="none" stroke="#DCEBE9" strokeOpacity="0.45" />
      </svg>
      <span className="absolute bottom-5 left-6 font-display text-sm tracking-[0.4em] text-[#FAF9F6]/80">
        TRAM
      </span>
    </div>
  );
}
