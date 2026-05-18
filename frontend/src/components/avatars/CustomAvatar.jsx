// ─── Palette options ──────────────────────────────────────────────────────────
export const SKIN_TONES    = ['#FDDCBE','#F0B98E','#D4956A','#B07040','#7A4820'];
export const HAIR_COLORS   = ['#1C1917','#5C3317','#B07840','#D4A056','#E07A5F','#E596B2','#8B68C8','#415f83'];
export const OUTFIT_COLORS = ['#415f83','#6B85A8','#E596B2','#5BA970','#8B68C8','#E07A5F','#D4A017','#6B8070'];
export const BG_COLORS     = ['#EEF2FA','#FEF0F5','#EBF6EE','#FFF8E1','#F5EEFF','#E8F4FF','#FFF0E8','#F0F5F0'];
export const HAIR_STYLE_NAMES = ['Space Bun','Panjang','Pendek','Curly','Bob','Ponytail','Undercut','Slick Back'];
export const ACCESSORY_NAMES  = ['Tidak ada','Kacamata','Bintang','Pita','Bunga'];
export const GENDER_NAMES     = ['Perempuan','Laki-laki'];
export const DEFAULT_CONFIG   = { bgColor:0, skinTone:0, hairStyle:0, hairColor:0, outfitColor:0, accessory:0, gender:0 };

// ─── Hair back layer ──────────────────────────────────────────────────────────
function HairBack({ style, color }) {
  switch (style) {
    case 0: return (
      <g>
        <circle cx="71" cy="74" r="23" fill={color}/>
        <circle cx="129" cy="74" r="23" fill={color}/>
        <rect x="60" y="76" width="80" height="44" rx="6" fill={color}/>
      </g>
    );
    case 1: return (
      <g>
        <ellipse cx="100" cy="73" rx="52" ry="26" fill={color}/>
        <rect x="50" y="72" width="100" height="108" rx="26" fill={color}/>
        <ellipse cx="50" cy="145" rx="16" ry="22" fill={color}/>
        <ellipse cx="150" cy="145" rx="16" ry="22" fill={color}/>
      </g>
    );
    case 2: return <ellipse cx="100" cy="76" rx="52" ry="27" fill={color}/>;
    case 3: return (
      <g>
        <circle cx="100" cy="66" r="48" fill={color}/>
        <circle cx="64"  cy="78" r="30" fill={color}/>
        <circle cx="136" cy="78" r="30" fill={color}/>
        <circle cx="78"  cy="58" r="24" fill={color}/>
        <circle cx="122" cy="58" r="24" fill={color}/>
        <circle cx="100" cy="50" r="24" fill={color}/>
      </g>
    );
    case 4: return (
      <g>
        <ellipse cx="100" cy="73" rx="52" ry="26" fill={color}/>
        <rect x="50" y="72" width="100" height="68" rx="22" fill={color}/>
      </g>
    );
    case 5: return (
      <g>
        <ellipse cx="100" cy="73" rx="52" ry="26" fill={color}/>
        <path d="M148 86 Q180 90 176 138 Q172 162 162 158 Q152 154 156 118 Q158 96 148 86Z" fill={color}/>
      </g>
    );
    case 6: return <ellipse cx="100" cy="70" rx="50" ry="22" fill={color}/>;
    case 7: return (
      <g>
        <ellipse cx="100" cy="73" rx="52" ry="26" fill={color}/>
        <rect x="52" y="72" width="96" height="56" rx="24" fill={color}/>
      </g>
    );
    default: return <ellipse cx="100" cy="73" rx="52" ry="26" fill={color}/>;
  }
}

// ─── Hair front layer ─────────────────────────────────────────────────────────
function HairFront({ style, color }) {
  switch (style) {
    case 0: return (
      <g>
        <circle cx="71" cy="74" r="23" fill={color}/>
        <circle cx="129" cy="74" r="23" fill={color}/>
        <ellipse cx="100" cy="73" rx="52" ry="26" fill={color}/>
        <path d="M50 90 Q62 66 100 68 Q138 66 150 90 L146 93 Q132 72 100 74 Q68 72 54 93Z" fill={color}/>
        <ellipse cx="64"  cy="68" rx="8" ry="5" fill="white" opacity="0.15"/>
        <ellipse cx="136" cy="68" rx="8" ry="5" fill="white" opacity="0.15"/>
      </g>
    );
    case 1: return (
      <g>
        <ellipse cx="100" cy="70" rx="52" ry="28" fill={color}/>
        <path d="M48 88 Q58 62 100 64 Q142 62 152 88 L147 92 Q136 68 100 70 Q64 68 53 92Z" fill={color}/>
        <rect x="50" y="82" width="15" height="66" rx="7" fill={color}/>
        <rect x="135" y="82" width="15" height="66" rx="7" fill={color}/>
        <ellipse cx="100" cy="65" rx="44" ry="12" fill="white" opacity="0.1"/>
      </g>
    );
    case 2: return (
      <g>
        <ellipse cx="100" cy="72" rx="52" ry="28" fill={color}/>
        <path d="M48 87 Q55 63 100 64 Q145 63 152 87 L148 91 Q137 68 100 70 Q63 68 52 91Z" fill={color}/>
        <rect x="50" y="82" width="13" height="30" rx="7" fill={color}/>
        <rect x="137" y="82" width="13" height="30" rx="7" fill={color}/>
      </g>
    );
    case 3: return (
      <g>
        <circle cx="100" cy="62" r="48" fill={color}/>
        <circle cx="62"  cy="74" r="28" fill={color}/>
        <circle cx="138" cy="74" r="28" fill={color}/>
        <circle cx="76"  cy="55" r="22" fill={color}/>
        <circle cx="124" cy="55" r="22" fill={color}/>
        <circle cx="100" cy="48" r="22" fill={color}/>
        <circle cx="88"  cy="50" r="9"  fill={color} opacity="0.7"/>
        <circle cx="112" cy="50" r="9"  fill={color} opacity="0.7"/>
        <circle cx="75"  cy="65" r="9"  fill={color} opacity="0.7"/>
        <circle cx="125" cy="65" r="9"  fill={color} opacity="0.7"/>
      </g>
    );
    case 4: return (
      <g>
        <ellipse cx="100" cy="70" rx="52" ry="28" fill={color}/>
        <path d="M48 86 Q56 62 100 64 Q144 62 152 86 L147 90 Q136 68 100 70 Q64 68 53 90Z" fill={color}/>
        <rect x="50" y="80" width="14" height="50" rx="7" fill={color}/>
        <rect x="136" y="80" width="14" height="50" rx="7" fill={color}/>
      </g>
    );
    case 5: return (
      <g>
        <ellipse cx="100" cy="70" rx="52" ry="28" fill={color}/>
        <path d="M48 85 Q56 62 100 64 Q144 62 152 85 L148 89 Q137 68 100 70 Q63 68 52 89Z" fill={color}/>
        <rect x="50" y="80" width="13" height="26" rx="7" fill={color}/>
        <circle cx="146" cy="85" r="7" fill={color}/>
        <circle cx="146" cy="85" r="4" fill="white" opacity="0.25"/>
      </g>
    );
    case 6: return (
      <g>
        <ellipse cx="100" cy="64" rx="46" ry="20" fill={color}/>
        <path d="M56 84 Q66 62 100 62 Q134 62 144 82 L140 85 Q128 68 100 68 Q72 68 60 86Z" fill={color}/>
        <rect x="50" y="84" width="10" height="18" rx="5" fill={color} opacity="0.3"/>
        <rect x="140" y="84" width="10" height="18" rx="5" fill={color} opacity="0.3"/>
        <ellipse cx="100" cy="60" rx="28" ry="7" fill="white" opacity="0.12"/>
      </g>
    );
    case 7: return (
      <g>
        <ellipse cx="100" cy="66" rx="50" ry="22" fill={color}/>
        <path d="M52 82 Q62 66 100 64 Q138 66 148 82 L144 84 Q132 70 100 70 Q68 70 56 84Z" fill={color}/>
        <rect x="50" y="82" width="12" height="22" rx="6" fill={color}/>
        <rect x="138" y="82" width="12" height="22" rx="6" fill={color}/>
        <path d="M70 68 Q100 60 130 68" stroke="white" strokeWidth="2" fill="none" opacity="0.12"/>
        <path d="M74 74 Q100 66 126 74" stroke="white" strokeWidth="1.5" fill="none" opacity="0.08"/>
      </g>
    );
    default: return (
      <g>
        <ellipse cx="100" cy="70" rx="52" ry="28" fill={color}/>
        <path d="M48 86 Q56 62 100 64 Q144 62 152 86" fill={color}/>
      </g>
    );
  }
}

// ─── Accessory layer ──────────────────────────────────────────────────────────
function Accessory({ type }) {
  switch (type) {
    case 1: return (
      <g>
        <circle cx="84"  cy="114" r="13" fill="rgba(175,200,230,0.12)" stroke="#7A8FA8" strokeWidth="2.2"/>
        <circle cx="116" cy="114" r="13" fill="rgba(175,200,230,0.12)" stroke="#7A8FA8" strokeWidth="2.2"/>
        <path d="M97 114 L103 114" stroke="#7A8FA8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M71 110 L62 106" stroke="#7A8FA8" strokeWidth="2" strokeLinecap="round"/>
        <path d="M129 110 L138 106" stroke="#7A8FA8" strokeWidth="2" strokeLinecap="round"/>
      </g>
    );
    case 2: return (
      <path d="M132 73 L134 66 L136 73 L143 75 L136 77 L134 84 L132 77 L125 75Z" fill="#FBBF24"/>
    );
    case 3: return (
      <g>
        <path d="M80 66 C72 55 60 58 62 67 C64 76 76 73 80 66Z" fill="#E596B2"/>
        <path d="M120 66 C128 55 140 58 138 67 C136 76 124 73 120 66Z" fill="#E596B2"/>
        <circle cx="100" cy="66" r="7" fill="#C97898"/>
        <circle cx="100" cy="66" r="4" fill="#F5C0D4"/>
      </g>
    );
    case 4: return (
      <g>
        <path d="M58 80 Q80 68 100 64 Q120 68 142 80" stroke="#86EFAC" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="66"  cy="76" r="8"  fill="#FEE2E2"/><circle cx="66"  cy="76" r="4.5" fill="#FCA5A5"/>
        <circle cx="82"  cy="67" r="8"  fill="#FEF3C7"/><circle cx="82"  cy="67" r="4.5" fill="#FDE68A"/>
        <circle cx="100" cy="63" r="9"  fill="#FEF0F5"/><circle cx="100" cy="63" r="5"   fill="#E596B2"/>
        <circle cx="118" cy="67" r="8"  fill="#EBF6EE"/><circle cx="118" cy="67" r="4.5" fill="#86EFAC"/>
        <circle cx="134" cy="76" r="8"  fill="#EAF0FA"/><circle cx="134" cy="76" r="4.5" fill="#93C5FD"/>
      </g>
    );
    default: return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CustomAvatar({ config = {}, size = 120 }) {
  const {
    bgColor     = 0,
    skinTone    = 0,
    hairStyle   = 0,
    hairColor   = 0,
    outfitColor = 0,
    accessory   = 0,
    gender      = 0,
  } = (typeof config === 'string' ? (() => { try { return JSON.parse(config); } catch { return {}; } })() : config) || {};

  const skin   = SKIN_TONES[skinTone]       ?? SKIN_TONES[0];
  const hair   = HAIR_COLORS[hairColor]     ?? HAIR_COLORS[0];
  const outfit = OUTFIT_COLORS[outfitColor] ?? OUTFIT_COLORS[0];
  const bg     = BG_COLORS[bgColor]         ?? BG_COLORS[0];
  const male   = gender === 1;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill={bg}/>

      {/* Body */}
      <ellipse cx="100" cy="215" rx={male ? 100 : 92} ry="72" fill={outfit}/>
      <ellipse cx="100" cy="200" rx={male ? 68 : 60}  ry="54" fill={outfit} opacity="0.65"/>

      {/* Neck */}
      <rect x={male ? 84 : 87} y="152" width={male ? 32 : 26} height="30" rx="13" fill={skin}/>

      <HairBack style={hairStyle} color={hair}/>

      {/* Ears */}
      <ellipse cx="50"  cy="122" rx="12" ry="15" fill={skin}/>
      <ellipse cx="150" cy="122" rx="12" ry="15" fill={skin}/>
      <ellipse cx="50"  cy="122" rx="6.5" ry="8.5" fill={skin} opacity="0.45"/>
      <ellipse cx="150" cy="122" rx="6.5" ry="8.5" fill={skin} opacity="0.45"/>

      {/* Face */}
      <ellipse cx="100" cy="118" rx={male ? 52 : 50} ry={male ? 52 : 54} fill={skin}/>

      {/* Cheeks */}
      <ellipse cx="70"  cy="132" rx="13" ry="9" fill="#F9A8D4" opacity={male ? 0.08 : 0.28}/>
      <ellipse cx="130" cy="132" rx="13" ry="9" fill="#F9A8D4" opacity={male ? 0.08 : 0.28}/>

      {/* Eye whites */}
      <ellipse cx="83"  cy="113" rx="10" ry="11" fill="white"/>
      <ellipse cx="117" cy="113" rx="10" ry="11" fill="white"/>

      {/* Pupils */}
      <circle cx="86"  cy="114" r="7" fill="#2C2C2C"/>
      <circle cx="120" cy="114" r="7" fill="#2C2C2C"/>

      {/* Iris shine */}
      <circle cx="88"  cy="111" r="2.8" fill="white"/>
      <circle cx="122" cy="111" r="2.8" fill="white"/>
      <circle cx="83"  cy="117" r="1.2" fill="white" opacity="0.6"/>
      <circle cx="117" cy="117" r="1.2" fill="white" opacity="0.6"/>

      {/* Eyelashes — female only */}
      {!male && <>
        <path d="M73 106 Q83 100 93 106"   stroke="#2C2C2C" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        <path d="M107 106 Q117 100 127 106" stroke="#2C2C2C" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      </>}

      {/* Eyebrows */}
      <path d="M74 100 Q83 94 92 100"    stroke={hair} strokeWidth={male ? 4.5 : 3} strokeLinecap="round" fill="none"/>
      <path d="M108 100 Q117 94 126 100" stroke={hair} strokeWidth={male ? 4.5 : 3} strokeLinecap="round" fill="none"/>

      {/* Nose */}
      <path d="M96 124 Q100 130 104 124" stroke={skin} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Mouth */}
      {!male ? <>
        <path d="M86 138 Q100 150 114 138" stroke="#D4707A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M91 138 Q100 143 109 138" fill="#E8A0A8" opacity="0.35"/>
      </> : (
        <path d="M89 139 Q100 148 111 139" stroke="#B07080" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      )}

      <HairFront style={hairStyle} color={hair}/>
      <Accessory type={accessory}/>
    </svg>
  );
}
