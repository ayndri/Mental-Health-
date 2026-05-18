export default function AvatarKai({ size = 80, className = "" }) {
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
      <ellipse cx="150" cy="258" rx="65" ry="47" fill="#0D9488" />
      <ellipse cx="150" cy="250" rx="53" ry="38" fill="#5EEAD4" />

      {/* Neck */}
      <rect x="130" y="193" width="40" height="28" rx="10" fill="#C8956C" />

      {/* Head */}
      <ellipse cx="150" cy="158" rx="60" ry="62" fill="#C8956C" />

      {/* Curly afro hair */}
      {/* Base shape */}
      <ellipse cx="150" cy="115" rx="72" ry="58" fill="#1C1917" />

      {/* Curly texture — top */}
      <circle cx="128" cy="90" r="18" fill="#292524" />
      <circle cx="150" cy="82" r="20" fill="#292524" />
      <circle cx="172" cy="90" r="18" fill="#292524" />
      <circle cx="112" cy="104" r="16" fill="#1C1917" />
      <circle cx="188" cy="104" r="16" fill="#1C1917" />
      <circle cx="138" cy="78" r="14" fill="#3D3836" />
      <circle cx="162" cy="78" r="14" fill="#3D3836" />
      <circle cx="150" cy="68" r="16" fill="#3D3836" />

      {/* Side curls */}
      <circle cx="100" cy="120" r="14" fill="#292524" />
      <circle cx="200" cy="120" r="14" fill="#292524" />
      <circle cx="96" cy="138" r="11" fill="#3D3836" />
      <circle cx="204" cy="138" r="11" fill="#3D3836" />

      {/* Hair sheen */}
      <circle cx="148" cy="80" r="5" fill="#6B7280" opacity="0.3" />
      <circle cx="158" cy="76" r="3" fill="#6B7280" opacity="0.2" />

      {/* Eyebrows */}
      <path d="M120 145 Q133 138 145 144" stroke="#44221A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M155 144 Q167 138 180 145" stroke="#44221A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Eyes — big expressive */}
      <ellipse cx="132" cy="159" rx="14" ry="15" fill="white" />
      <ellipse cx="168" cy="159" rx="14" ry="15" fill="white" />
      <circle cx="134" cy="161" r="9" fill="#44221A" />
      <circle cx="170" cy="161" r="9" fill="#44221A" />
      {/* Iris highlights */}
      <circle cx="131" cy="157" r="3.5" fill="white" />
      <circle cx="167" cy="157" r="3.5" fill="white" />
      <circle cx="138" cy="162" r="1.5" fill="white" opacity="0.7" />
      <circle cx="174" cy="162" r="1.5" fill="white" opacity="0.7" />

      {/* Blush */}
      <ellipse cx="115" cy="172" rx="11" ry="7" fill="#E0896A" opacity="0.4" />
      <ellipse cx="185" cy="172" rx="11" ry="7" fill="#E0896A" opacity="0.4" />

      {/* Nose */}
      <ellipse cx="150" cy="177" rx="4" ry="3" fill="#B07550" opacity="0.6" />

      {/* Big smile */}
      <path d="M132 190 Q150 205 168 190" stroke="#8B3A2A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Teeth */}
      <path d="M136 193 Q150 204 164 193 Q155 198 150 198 Q145 198 136 193" fill="white" opacity="0.9" />

      {/* Decorative elements */}
      <path d="M58 58 L61 51 L64 58 L71 61 L64 64 L61 71 L58 64 L51 61 Z" fill="#34D399" opacity="0.8" />
      <circle cx="238" cy="72" r="7" fill="#FBBF24" opacity="0.7" />
      <circle cx="62" cy="228" r="5" fill="#A78BFA" opacity="0.6" />
      <path d="M228 220 L230 214 L232 220 L238 222 L232 224 L230 230 L228 224 L222 222 Z" fill="#F472B6" opacity="0.7" />
    </svg>
  );
}
