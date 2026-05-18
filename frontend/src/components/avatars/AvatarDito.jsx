export default function AvatarDito({ size = 80, className = "" }) {
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
      <circle cx="150" cy="150" r="150" fill="#FFFBEB" />

      {/* Body */}
      <ellipse cx="150" cy="260" rx="65" ry="47" fill="#D97706" />
      <ellipse cx="150" cy="252" rx="53" ry="38" fill="#FCD34D" />

      {/* Hoodie pocket */}
      <rect x="125" y="252" width="50" height="20" rx="8" fill="#D97706" opacity="0.5" />

      {/* Neck */}
      <rect x="130" y="194" width="40" height="26" rx="10" fill="#D4A574" />

      {/* Head - slightly more square */}
      <rect x="90" y="105" width="120" height="110" rx="38" fill="#D4A574" />

      {/* Hair under cap */}
      <rect x="90" y="105" width="120" height="30" rx="20" fill="#1C1917" />
      {/* Sideburns */}
      <rect x="90" y="128" width="14" height="20" rx="7" fill="#1C1917" />
      <rect x="196" y="128" width="14" height="20" rx="7" fill="#1C1917" />

      {/* Baseball cap brim shadow */}
      <rect x="78" y="112" width="144" height="20" rx="10" fill="#0C0A09" opacity="0.3" />

      {/* Baseball cap */}
      <rect x="88" y="85" width="124" height="42" rx="16" fill="#1C1917" />
      {/* Cap brim */}
      <rect x="72" y="112" width="156" height="16" rx="8" fill="#1C1917" />
      {/* Cap button on top */}
      <circle cx="150" cy="88" r="8" fill="#374151" />
      {/* Cap logo */}
      <text x="138" y="112" fontSize="14" fill="#FCD34D" fontFamily="Arial" fontWeight="bold">SC</text>
      {/* Cap seam lines */}
      <path d="M150 88 L150 130" stroke="#374151" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
      <path d="M150 88 Q120 100 105 116" stroke="#374151" strokeWidth="1.5" opacity="0.4" />
      <path d="M150 88 Q180 100 195 116" stroke="#374151" strokeWidth="1.5" opacity="0.4" />

      {/* Eyebrows — confident arch */}
      <path d="M118 150 Q132 142 146 149" stroke="#6B3A2A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M154 149 Q168 142 182 150" stroke="#6B3A2A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Eyes — confident/cool */}
      <ellipse cx="132" cy="162" rx="12" ry="11" fill="white" />
      <ellipse cx="168" cy="162" rx="12" ry="11" fill="white" />
      <circle cx="133" cy="163" r="7" fill="#3D1A0F" />
      <circle cx="169" cy="163" r="7" fill="#3D1A0F" />
      <circle cx="131" cy="160" r="3" fill="white" />
      <circle cx="167" cy="160" r="3" fill="white" />

      {/* Half-closed eyelids (cool look) */}
      <path d="M120 157 Q132 152 144 157" fill="#D4A574" />
      <path d="M156 157 Q168 152 180 157" fill="#D4A574" />

      {/* Earring — left ear */}
      <circle cx="90" cy="172" r="5" fill="#D4A574" />
      <circle cx="90" cy="172" r="3" fill="#FCD34D" />
      <circle cx="90" cy="180" r="4" fill="#FCD34D" />
      <line x1="90" y1="175" x2="90" y2="180" stroke="#D97706" strokeWidth="2" />

      {/* Blush (subtle) */}
      <ellipse cx="114" cy="174" rx="10" ry="6" fill="#C08050" opacity="0.3" />
      <ellipse cx="186" cy="174" rx="10" ry="6" fill="#C08050" opacity="0.3" />

      {/* Nose */}
      <path d="M146 178 Q150 183 154 178" stroke="#A0714A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Smirk / confident smile */}
      <path d="M136 191 Q148 200 162 194" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Decorative elements */}
      <path d="M60 65 L62 59 L64 65 L70 67 L64 69 L62 75 L60 69 L54 67 Z" fill="#FBBF24" opacity="0.9" />
      <circle cx="235" cy="68" r="6" fill="#F472B6" opacity="0.7" />
      <circle cx="238" cy="220" r="5" fill="#A78BFA" opacity="0.6" />
      <path d="M60 215 L62 209 L64 215 L70 217 L64 219 L62 225 L60 219 L54 217 Z" fill="#34D399" opacity="0.7" />
    </svg>
  );
}
