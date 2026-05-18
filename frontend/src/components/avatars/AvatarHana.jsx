export default function AvatarHana({ size = 80, className = "" }) {
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
      <circle cx="150" cy="150" r="150" fill="#FFF0F6" />

      {/* Body / outfit */}
      <ellipse cx="150" cy="258" rx="65" ry="47" fill="#F472B6" />
      <ellipse cx="150" cy="250" rx="53" ry="38" fill="#FBCFE8" />

      {/* Neck */}
      <rect x="130" y="192" width="40" height="28" rx="10" fill="#F4C090" />

      {/* Head */}
      <ellipse cx="150" cy="158" rx="60" ry="62" fill="#F4C090" />

      {/* Hair back */}
      <ellipse cx="150" cy="140" rx="68" ry="70" fill="#92400E" />

      {/* Long flowing hair sides */}
      <path d="M90 155 Q72 195 78 245 Q85 260 95 255 Q100 220 98 185 Q100 165 95 155 Z" fill="#92400E" />
      <path d="M210 155 Q228 195 222 245 Q215 260 205 255 Q200 220 202 185 Q200 165 205 155 Z" fill="#92400E" />

      {/* Hair waves */}
      <path d="M78 210 Q88 202 98 210 Q88 218 78 210" fill="#78350F" opacity="0.5" />
      <path d="M202 210 Q212 202 222 210 Q212 218 202 210" fill="#78350F" opacity="0.5" />
      <path d="M80 230 Q90 222 100 230" stroke="#78350F" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M200 230 Q210 222 220 230" stroke="#78350F" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Hair top */}
      <ellipse cx="150" cy="107" rx="60" ry="38" fill="#92400E" />

      {/* Hair highlight */}
      <path d="M130 100 Q145 92 160 98" stroke="#B45309" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Eyebrows */}
      <path d="M122 142 Q133 136 144 141" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M156 141 Q167 136 178 142" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyes — kind/warm */}
      <ellipse cx="133" cy="156" rx="12" ry="13" fill="white" />
      <ellipse cx="167" cy="156" rx="12" ry="13" fill="white" />
      <circle cx="135" cy="157" r="8" fill="#92400E" />
      <circle cx="169" cy="157" r="8" fill="#92400E" />
      <circle cx="137" cy="154" r="3" fill="white" />
      <circle cx="171" cy="154" r="3" fill="white" />

      {/* Eyelashes */}
      <path d="M122 148 L119 143" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M127 145 L125 140" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M160 145 L158 140" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M165 146 L163 141" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M172 147 L174 142" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="116" cy="169" rx="11" ry="7" fill="#F9A8D4" opacity="0.65" />
      <ellipse cx="184" cy="169" rx="11" ry="7" fill="#F9A8D4" opacity="0.65" />

      {/* Nose */}
      <path d="M147 174 Q150 178 153 174" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Gentle smile */}
      <path d="M136 186 Q150 197 164 186" stroke="#C05621" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Small flowers decoration */}
      <circle cx="70" cy="75" r="7" fill="#F472B6" opacity="0.7" />
      <circle cx="70" cy="75" r="3" fill="#FBBF24" />
      <circle cx="230" cy="80" r="5" fill="#A78BFA" opacity="0.7" />
      <circle cx="65" cy="220" r="4" fill="#34D399" opacity="0.6" />
      <circle cx="240" cy="215" r="6" fill="#F472B6" opacity="0.5" />
    </svg>
  );
}
