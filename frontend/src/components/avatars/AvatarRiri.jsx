export default function AvatarRiri({ size = 80, className = "" }) {
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
      <circle cx="150" cy="150" r="150" fill="#ECFDF5" />

      {/* Body */}
      <ellipse cx="150" cy="260" rx="65" ry="47" fill="#059669" />
      <ellipse cx="150" cy="252" rx="53" ry="38" fill="#6EE7B7" />

      {/* Collar detail */}
      <path d="M118 244 L150 256 L182 244 L180 252 L150 262 L120 252 Z" fill="#34D399" opacity="0.6" />

      {/* Neck */}
      <rect x="130" y="194" width="40" height="28" rx="10" fill="#FFDDB7" />

      {/* Head — round & chubby */}
      <ellipse cx="150" cy="162" rx="68" ry="70" fill="#FFDDB7" />

      {/* Bob hair — back */}
      <ellipse cx="150" cy="143" rx="70" ry="62" fill="#1C1917" />
      {/* Bob hair sides */}
      <rect x="82" y="138" width="22" height="50" rx="11" fill="#1C1917" />
      <rect x="196" y="138" width="22" height="50" rx="11" fill="#1C1917" />

      {/* Bob hair fringe */}
      <path d="M88 138 Q110 110 150 108 Q190 110 212 138 Q180 122 150 122 Q120 122 88 138 Z" fill="#1C1917" />

      {/* Hair shine */}
      <path d="M130 115 Q145 108 160 113" stroke="#374151" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Glasses frames */}
      {/* Left lens */}
      <rect x="108" y="150" width="38" height="30" rx="12" fill="none" stroke="#1C1917" strokeWidth="4" />
      {/* Right lens */}
      <rect x="154" y="150" width="38" height="30" rx="12" fill="none" stroke="#1C1917" strokeWidth="4" />
      {/* Bridge */}
      <path d="M146 163 L154 163" stroke="#1C1917" strokeWidth="3.5" strokeLinecap="round" />
      {/* Temple arms */}
      <path d="M108 163 Q98 160 88 165" stroke="#1C1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M192 163 Q202 160 212 165" stroke="#1C1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Lens tint */}
      <rect x="110" y="152" width="34" height="26" rx="10" fill="#A7F3D0" opacity="0.3" />
      <rect x="156" y="152" width="34" height="26" rx="10" fill="#A7F3D0" opacity="0.3" />

      {/* Eyebrows (above glasses) */}
      <path d="M114 147 Q127 141 140 147" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M160 147 Q173 141 186 147" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyes inside glasses */}
      <ellipse cx="127" cy="163" rx="9" ry="9" fill="white" />
      <ellipse cx="173" cy="163" rx="9" ry="9" fill="white" />
      <circle cx="128" cy="164" r="6" fill="#374151" />
      <circle cx="174" cy="164" r="6" fill="#374151" />
      <circle cx="126" cy="161" r="2.5" fill="white" />
      <circle cx="172" cy="161" r="2.5" fill="white" />

      {/* Blush — prominent chubby cheeks */}
      <ellipse cx="105" cy="182" rx="14" ry="9" fill="#FCA5A5" opacity="0.5" />
      <ellipse cx="195" cy="182" rx="14" ry="9" fill="#FCA5A5" opacity="0.5" />

      {/* Small freckles */}
      <circle cx="112" cy="178" r="2" fill="#F4A570" opacity="0.5" />
      <circle cx="106" cy="182" r="1.5" fill="#F4A570" opacity="0.5" />
      <circle cx="188" cy="178" r="2" fill="#F4A570" opacity="0.5" />
      <circle cx="194" cy="182" r="1.5" fill="#F4A570" opacity="0.5" />

      {/* Cute nose */}
      <circle cx="150" cy="184" r="3.5" fill="#F4A570" opacity="0.6" />

      {/* Warm smile */}
      <path d="M133 197 Q150 210 167 197" stroke="#E07A5F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Dimples */}
      <circle cx="128" cy="196" r="3" fill="#F4A570" opacity="0.4" />
      <circle cx="172" cy="196" r="3" fill="#F4A570" opacity="0.4" />

      {/* Decorative elements */}
      <path d="M60 60 L63 54 L66 60 L72 63 L66 66 L63 72 L60 66 L54 63 Z" fill="#34D399" opacity="0.8" />
      <circle cx="235" cy="65" r="7" fill="#A78BFA" opacity="0.7" />
      <circle cx="240" cy="215" r="5" fill="#FBBF24" opacity="0.7" />
      <circle cx="62" cy="222" r="6" fill="#F472B6" opacity="0.6" />

      {/* Book icon decoration */}
      <rect x="56" y="160" width="18" height="22" rx="3" fill="#A78BFA" opacity="0.4" />
      <rect x="58" y="162" width="14" height="18" rx="2" fill="white" opacity="0.5" />
      <line x1="60" y1="167" x2="70" y2="167" stroke="#7C3AED" strokeWidth="1.5" opacity="0.4" />
      <line x1="60" y1="171" x2="70" y2="171" stroke="#7C3AED" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
