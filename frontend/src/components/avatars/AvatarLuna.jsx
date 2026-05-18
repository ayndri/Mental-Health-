export default function AvatarLuna({ size = 80, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="150" cy="150" r="150" fill="#EDE9FE" />

      {/* Neck */}
      <rect x="128" y="195" width="44" height="30" rx="10" fill="#FDDCBE" />

      {/* Body / shirt */}
      <ellipse cx="150" cy="255" rx="62" ry="45" fill="#7C3AED" />
      <ellipse cx="150" cy="248" rx="50" ry="38" fill="#A78BFA" />

      {/* Head */}
      <ellipse cx="150" cy="155" rx="62" ry="65" fill="#FDDCBE" />

      {/* Hair base */}
      <ellipse cx="150" cy="120" rx="62" ry="48" fill="#4C1D95" />

      {/* Left bun */}
      <circle cx="94" cy="108" r="22" fill="#4C1D95" />
      <circle cx="88" cy="100" r="10" fill="#7C3AED" />
      {/* Bun highlight */}
      <circle cx="88" cy="96" r="4" fill="#A78BFA" opacity="0.6" />

      {/* Right bun */}
      <circle cx="206" cy="108" r="22" fill="#4C1D95" />
      <circle cx="212" cy="100" r="10" fill="#7C3AED" />
      {/* Bun highlight */}
      <circle cx="212" cy="96" r="4" fill="#A78BFA" opacity="0.6" />

      {/* Hair ties */}
      <circle cx="90" cy="122" r="8" fill="#F472B6" />
      <circle cx="90" cy="122" r="4" fill="#FBCFE8" />
      <circle cx="210" cy="122" r="8" fill="#F472B6" />
      <circle cx="210" cy="122" r="4" fill="#FBCFE8" />

      {/* Eyebrows */}
      <path d="M122 140 Q133 134 144 140" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M156 140 Q167 134 178 140" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <ellipse cx="133" cy="154" rx="13" ry="14" fill="white" />
      <ellipse cx="167" cy="154" rx="13" ry="14" fill="white" />
      <circle cx="135" cy="156" r="8" fill="#1E1B4B" />
      <circle cx="169" cy="156" r="8" fill="#1E1B4B" />
      <circle cx="138" cy="153" r="3" fill="white" />
      <circle cx="172" cy="153" r="3" fill="white" />

      {/* Sparkles in eyes */}
      <path d="M127 145 L129 141 L131 145 L127 145" fill="#FBBF24" />
      <path d="M161 145 L163 141 L165 145 L161 145" fill="#FBBF24" />

      {/* Blush */}
      <ellipse cx="117" cy="168" rx="12" ry="7" fill="#F9A8D4" opacity="0.6" />
      <ellipse cx="183" cy="168" rx="12" ry="7" fill="#F9A8D4" opacity="0.6" />

      {/* Cute nose */}
      <circle cx="150" cy="172" r="3" fill="#F4A570" opacity="0.7" />

      {/* Smile */}
      <path d="M135 184 Q150 196 165 184" stroke="#E07A5F" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Stars decoration */}
      <path d="M60 60 L63 53 L66 60 L73 63 L66 66 L63 73 L60 66 L53 63 Z" fill="#FBBF24" opacity="0.8" />
      <path d="M230 70 L232 65 L234 70 L239 72 L234 74 L232 79 L230 74 L225 72 Z" fill="#A78BFA" opacity="0.8" />
      <circle cx="72" cy="230" r="4" fill="#F472B6" opacity="0.6" />
      <circle cx="240" cy="200" r="5" fill="#34D399" opacity="0.6" />
    </svg>
  );
}
